import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Block,
  Property,
} from '../models';
import {BlockRepository} from '../repositories';

export class BlockPropertyController {
  constructor(
    @repository(BlockRepository) protected blockRepository: BlockRepository,
  ) { }

  @get('/blocks/{id}/properties', {
    responses: {
      '200': {
        description: 'Array of Block has many Property',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Property)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Property>,
  ): Promise<Property[]> {
    return this.blockRepository.properties(id).find(filter);
  }

  @post('/blocks/{id}/properties', {
    responses: {
      '200': {
        description: 'Block model instance',
        content: {'application/json': {schema: getModelSchemaRef(Property)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Block.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {
            title: 'NewPropertyInBlock',
            exclude: ['id'],
            optional: ['blockId']
          }),
        },
      },
    }) property: Omit<Property, 'id'>,
  ): Promise<Property> {
    return this.blockRepository.properties(id).create(property);
  }

  @patch('/blocks/{id}/properties', {
    responses: {
      '200': {
        description: 'Block.Property PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {partial: true}),
        },
      },
    })
    property: Partial<Property>,
    @param.query.object('where', getWhereSchemaFor(Property)) where?: Where<Property>,
  ): Promise<Count> {
    return this.blockRepository.properties(id).patch(property, where);
  }

  @del('/blocks/{id}/properties', {
    responses: {
      '200': {
        description: 'Block.Property DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Property)) where?: Where<Property>,
  ): Promise<Count> {
    return this.blockRepository.properties(id).delete(where);
  }
}
