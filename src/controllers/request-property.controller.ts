import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Request,
  Property,
} from '../models';
import {RequestRepository} from '../repositories';

export class RequestPropertyController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
  ) { }

  @get('/requests/{id}/property', {
    responses: {
      '200': {
        description: 'Property belonging to Request',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Property)},
          },
        },
      },
    },
  })
  async getProperty(
    @param.path.string('id') id: typeof Request.prototype.id,
  ): Promise<Property> {
    return this.requestRepository.property(id);
  }
}
