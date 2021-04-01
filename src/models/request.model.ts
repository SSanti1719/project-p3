import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {requestStatus} from '../config/index.config';
import {Client} from './client.model';
import {Payment} from './payment.model';
import {Property} from './property.model';
import {User} from './user.model';

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
    default: requestStatus.review,
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

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Request>) {
    super(data);
  }
}

export interface RequestRelations {
  // describe navigational properties here
}

export type RequestWithRelations = Request & RequestRelations;
