import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Country} from './country.model';
import {Client} from './client.model';
import {Seller} from './seller.model';
import {Admin} from './admin.model';

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

  @hasMany(() => Seller)
  sellers: Seller[];

  @hasMany(() => Admin)
  admins: Admin[];

  constructor(data?: Partial<City>) {
    super(data);
  }
}

export interface CityRelations {
  // describe navigational properties here
}

export type CityWithRelations = City & CityRelations;
