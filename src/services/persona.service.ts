import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '../modules/invoice/entities/person.entity';

@Injectable()
export class PersonaService {
  constructor(
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
  ) {

    
  }
}
