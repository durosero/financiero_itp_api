import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNull } from 'lodash';
import { NotFoundError } from 'src/classes/httpError/notFounError';
import { IEnrollment } from 'src/interfaces/enrollment.interface';
import { IGenerateInvoice } from 'src/interfaces/invoice.interface';
import { DataSource, Repository } from 'typeorm';
import {
  INFO_MATRICULA_SQL,
  INFO_PROGRAMA_SQL
} from '../constant/invoiceSql.constant';
import { GenerateInvoiceDto } from '../dto/generate-invoice.dto';
import { UniversityPeriod } from '../entities/univsityPeriod.entity';
import { PackageRepository } from '../repositories/package.repository';
import { ConsultInvoiceService } from './consultInvoice.service';

@Injectable()
export class GenerateInvoiceService {
  constructor(
    private readonly consultInvoiceService: ConsultInvoiceService,
    private readonly packageRepository: PackageRepository,

    @InjectRepository(UniversityPeriod)
    private periodRepository: Repository<UniversityPeriod>,

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

    const [infoMatricula] = isNull(matriculaId)
      ? await queryRunner.manager.query<IEnrollment[]>(INFO_PROGRAMA_SQL, [
          personaId,
          programaPersonaId,
        ])
      : await queryRunner.manager.query<IEnrollment[]>(INFO_MATRICULA_SQL, [
          matriculaId,
        ]);

    if (!infoMatricula)
      throw new NotFoundError('No se encontro el programa o la matricula');

    console.log(infoMatricula);

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
}
