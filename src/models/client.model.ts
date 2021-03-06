import {
  belongsTo,
  Entity,
  hasMany,
  hasOne,
  model,
  property,
} from '@loopback/repository';
import {City} from './city.model';
import {Finances} from './finances.model';
import {Request} from './request.model';

@model()
export class Client extends Entity {
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  lastname: string;

  @property({
    type: 'number',
    required: true,
  })
  document: number;

  @property({
    type: 'date',
    required: true,
  })
  birthday: string;

  @property({
    type: 'string',
  })
  image?: string;

  @property({
    type: 'string',
    required: true,
  })
  image_public_id: string;

  @property({
    type: 'number',
    required: true,
  })
  phone: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  adress: string;

  @hasMany(() => Request)
  requests: Request[];

  @belongsTo(() => City)
  cityId: string;

  @hasOne(() => Finances)
  finances: Finances;

  constructor(data?: Partial<Client>) {
    super(data);
  }
}

export interface ClientRelations {
  // describe navigational properties here
}

export type ClientWithRelations = Client & ClientRelations;
