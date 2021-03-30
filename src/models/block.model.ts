import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Project} from './project.model';
import {Property} from './property.model';

@model()
export class Block extends Entity {
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

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @belongsTo(() => Project)
  projectId: string;

  @hasMany(() => Property)
  properties: Property[];

  constructor(data?: Partial<Block>) {
    super(data);
  }
}

export interface BlockRelations {
  // describe navigational properties here
}

export type BlockWithRelations = Block & BlockRelations;
