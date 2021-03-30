import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Client,
  City,
} from '../models';
import {ClientRepository} from '../repositories';

export class ClientCityController {
  constructor(
    @repository(ClientRepository)
    public clientRepository: ClientRepository,
  ) { }

  @get('/clients/{id}/city', {
    responses: {
      '200': {
        description: 'City belonging to Client',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(City)},
          },
        },
      },
    },
  })
  async getCity(
    @param.path.string('id') id: typeof Client.prototype.id,
  ): Promise<City> {
    return this.clientRepository.city(id);
  }
}
