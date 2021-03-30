import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Property} from './property.model';
import {Client} from './client.model';
import {Payment} from './payment.model';

@model()
export class Request extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'number',
    required: true,
  })
  offer: number;

  @property({
    type: 'string',
  })
  firstPayment?: string;

  @property({
    type: 'number',
  })
  totalPayment?: number;

  @property({
    type: 'number',
  })
  feePayment?: number;

  @property({
    type: 'number',
  })
  feeNumber?: number;

  @belongsTo(() => Property)
  propertyId: string;

  @belongsTo(() => Client)
  clientId: string;

  @hasMany(() => Payment)
  payments: Payment[];

  constructor(data?: Partial<Request>) {
    super(data);
  }
}

export interface RequestRelations {
  // describe navigational properties here
}

export type RequestWithRelations = Request & RequestRelations;
