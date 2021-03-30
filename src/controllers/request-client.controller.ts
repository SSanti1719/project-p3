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
  Client,
} from '../models';
import {RequestRepository} from '../repositories';

export class RequestClientController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
  ) { }

  @get('/requests/{id}/client', {
    responses: {
      '200': {
        description: 'Client belonging to Request',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Client)},
          },
        },
      },
    },
  })
  async getClient(
    @param.path.string('id') id: typeof Request.prototype.id,
  ): Promise<Client> {
    return this.requestRepository.client(id);
  }
}
