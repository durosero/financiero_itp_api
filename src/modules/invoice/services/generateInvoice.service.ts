import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNull, isEmpty } from 'lodash';
import { NotFoundError } from 'src/classes/httpError/notFounError';
import { UnprocessableEntity } from 'src/classes/httpError/unProcessableEntity';
import { IEnrollment } from 'src/interfaces/enrollment.interface';
import { IGenerateInvoice } from 'src/interfaces/invoice.interface';
import { DataSource, Repository } from 'typeorm';
import {
  INFO_MATRICULA_SQL,
  INFO_PROGRAMA_SQL,
} from '../constant/invoiceSql.constant';
import { GenerateInvoiceDto } from '../dto/generate-invoice.dto';
import { DetailInvoice } from '../entities/detailInvoice.entity';
import { UniversityPeriod } from '../entities/univsityPeriod.entity';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { PackageRepository } from '../repositories/package.repository';
import { ConsultInvoiceService } from './consultInvoice.service';

@Injectable()
export class GenerateInvoiceService {
  constructor(
    private readonly consultInvoiceService: ConsultInvoiceService,
    private readonly packageRepository: PackageRepository,
    private readonly invoiceRepository: InvoiceRepository,

    @InjectRepository(UniversityPeriod)
    private periodRepository: Repository<UniversityPeriod>,

    @InjectRepository(DetailInvoice)
    private detailInvoiceRepository: Repository<DetailInvoice>,

    private readonly dataSource: DataSource,
  ) {}

  async mainGenerateInvoice(payload: GenerateInvoiceDto) {
    const {
      codPaquete,
      matriculaId,
      isPagoOnline,
      total,
      personaId,
      programaPersonaId,
    } = payload;

    const packageInvoce = await this.packageRepository.findConceptsByCode(
      codPaquete,
    );
    if (!packageInvoce) throw new NotFoundError('No se encontro el paquete');

    const queryRunner = this.dataSource.createQueryRunner();

    const [infoMatricula] = !matriculaId
      ? await queryRunner.manager.query<IEnrollment[]>(INFO_PROGRAMA_SQL, [
          personaId,
          programaPersonaId,
        ])
      : await queryRunner.manager.query<IEnrollment[]>(INFO_MATRICULA_SQL, [
          matriculaId,
        ]);

    if (!infoMatricula)
      throw new NotFoundError('No se encontro el programa o la matricula');

    const params: IGenerateInvoice = {
      infoEstudiante: infoMatricula,
      codPaquete,
      matriculaId,
      isPagoOnline,
      total,
      categoriaPagoId: packageInvoce.categoriaId,
    };

    const invoice = this.consultInvoiceService.generateInvoiceByParams(params);
    return invoice;
  }

  async generateAndSaveInvoice(payload: GenerateInvoiceDto) {
    const invoiceNew = await this.mainGenerateInvoice(payload);

    if (!invoiceNew)
      throw new UnprocessableEntity('No se pudo generar la factura');

    const duplicateInvoice = await this.invoiceRepository.findDuplicateInvoice(
      payload.personaId,
      invoiceNew.categoriaPagoId,
    );

    if (duplicateInvoice) {
      await this.detailInvoiceRepository.delete({
        facturaId: duplicateInvoice.id,
      });
    }
    const invoiceSave = this.invoiceRepository.create({
      ...duplicateInvoice,
      ...invoiceNew,
    });

    return this.invoiceRepository.save(invoiceSave);
  }
}
