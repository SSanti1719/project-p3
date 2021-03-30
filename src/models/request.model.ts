import {Entity, model, property} from '@loopback/repository';

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


  constructor(data?: Partial<Request>) {
    super(data);
  }
}

export interface RequestRelations {
  // describe navigational properties here
}

export type RequestWithRelations = Request & RequestRelations;
