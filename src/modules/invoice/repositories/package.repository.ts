import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from '../entities/package.entity';

export class PackageRepository extends Repository<Package> {
  constructor(
    @InjectRepository(Package)
    private repository: PackageRepository,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  findConceptsById(packageId: number) {
    return this.createQueryBuilder('pk')
      .select('pk')
      .innerJoinAndSelect('pk.packageDetail', 'pkd')
      .innerJoinAndSelect('pk.config', 'pkc')
      .where('pk.id = :packageId', { packageId })
      .getOne();
  }
  findConceptsByCode(packageCode: string) {
    return this.createQueryBuilder('pk')
      .select('pk')
      .innerJoinAndSelect('pk.packageDetail', 'pkd')
      .innerJoinAndSelect('pk.config', 'pkc')
      .where('pk.code = :packageCode', { packageCode })
      .getOne();
  }
}
