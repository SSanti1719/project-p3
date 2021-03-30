import {Entity, model, property} from '@loopback/repository';

@model()
export class Finances extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  totalIncome: number;

  @property({
    type: 'string',
    required: true,
  })
  jobDataTime: string;

  @property({
    type: 'string',
    required: true,
  })
  familyReference: string;

  @property({
    type: 'string',
    required: true,
  })
  familyReferencePhone: string;

  @property({
    type: 'string',
    required: true,
  })
  personalReference: string;

  @property({
    type: 'string',
    required: true,
  })
  personalReferencePhone: string;

  constructor(data?: Partial<Finances>) {
    super(data);
  }
}

export interface FinancesRelations {
  // describe navigational properties here
}

export type FinancesWithRelations = Finances & FinancesRelations;
