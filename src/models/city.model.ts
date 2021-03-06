import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Client} from './client.model';
import {Country} from './country.model';
import {Project} from './project.model';
import {User} from './user.model';

@model()
export class City extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @belongsTo(() => Country)
  countryId: string;

  @hasMany(() => Client)
  clients: Client[];

  @hasMany(() => Project)
  projects: Project[];

  @hasMany(() => User)
  users: User[];

  constructor(data?: Partial<City>) {
    super(data);
  }
}

export interface CityRelations {
  // describe navigational properties here
}

export type CityWithRelations = City & CityRelations;
