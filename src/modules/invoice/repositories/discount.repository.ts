import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discounts } from '../entities/discounts.entity';
import { EDiscountStatus } from '../enums/invoice.enum';

export class DiscountRepository extends Repository<Discounts> {
  constructor(
    @InjectRepository(Discounts)
    private repository: DiscountRepository,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  findForEnrollment(
    categoriaId: number,
    estudianteId: string,
    periodoId: number,
  ) {
    return this.repository
      .createQueryBuilder('dto')
      .innerJoinAndSelect('dto.discountCategory', 'disc')
      .where('dto.categoriaPagoId = :categoriaId', { categoriaId })
      .andWhere('dto.estudianteId = :estudianteId', {
        estudianteId,
      })
      .andWhere('dto.periodoId = :periodoId', {
        periodoId,
      })
      .andWhere('dto.porcentajeEstadoId = :status', {
        status: EDiscountStatus.APROBADO,
      })
      .getMany();
  }

  findForInvoiceGeneral(categoriaId: number, estudianteId: string) {
    return this.repository
      .createQueryBuilder('dto')
      .where('dto.categoriaPagoId = :categoriaId', { categoriaId })
      .andWhere('dto.estudianteId = :estudianteId', {
        estudianteId,
      })
      .andWhere('dto.porcentajeEstadoId = :status', {
        status: EDiscountStatus.APROBADO,
      })
      .getMany();
  }
}
