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
  City,
  Client,
} from '../models';
import {CityRepository} from '../repositories';

export class CityClientController {
  constructor(
    @repository(CityRepository) protected cityRepository: CityRepository,
  ) { }

  @get('/cities/{id}/clients', {
    responses: {
      '200': {
        description: 'Array of City has many Client',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Client)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Client>,
  ): Promise<Client[]> {
    return this.cityRepository.clients(id).find(filter);
  }

  @post('/cities/{id}/clients', {
    responses: {
      '200': {
        description: 'City model instance',
        content: {'application/json': {schema: getModelSchemaRef(Client)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof City.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {
            title: 'NewClientInCity',
            exclude: ['id'],
            optional: ['cityId']
          }),
        },
      },
    }) client: Omit<Client, 'id'>,
  ): Promise<Client> {
    return this.cityRepository.clients(id).create(client);
  }

  @patch('/cities/{id}/clients', {
    responses: {
      '200': {
        description: 'City.Client PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {partial: true}),
        },
      },
    })
    client: Partial<Client>,
    @param.query.object('where', getWhereSchemaFor(Client)) where?: Where<Client>,
  ): Promise<Count> {
    return this.cityRepository.clients(id).patch(client, where);
  }

  @del('/cities/{id}/clients', {
    responses: {
      '200': {
        description: 'City.Client DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Client)) where?: Where<Client>,
  ): Promise<Count> {
    return this.cityRepository.clients(id).delete(where);
  }
}
