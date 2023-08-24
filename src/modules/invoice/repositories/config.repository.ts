import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PackageConfiguration } from '../entities/packageConfiguration.entity';

export class ConfigRepository extends Repository<PackageConfiguration> {
  constructor(
    @InjectRepository(PackageConfiguration)
    private repository: ConfigRepository,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  getCurrentConfig() {
    return this.repository.findOne({
      where: {
        estado: 1,
      },
      order: {
        fechaCreacion: 'DESC',
      },
    });
  }
}
