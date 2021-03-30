import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Property,
  Block,
} from '../models';
import {PropertyRepository} from '../repositories';

export class PropertyBlockController {
  constructor(
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
  ) { }

  @get('/properties/{id}/block', {
    responses: {
      '200': {
        description: 'Block belonging to Property',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Block)},
          },
        },
      },
    },
  })
  async getBlock(
    @param.path.string('id') id: typeof Property.prototype.id,
  ): Promise<Block> {
    return this.propertyRepository.block(id);
  }
}
