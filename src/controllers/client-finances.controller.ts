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
  Client,
  Finances,
} from '../models';
import {ClientRepository} from '../repositories';

export class ClientFinancesController {
  constructor(
    @repository(ClientRepository) protected clientRepository: ClientRepository,
  ) { }

  @get('/clients/{id}/finances', {
    responses: {
      '200': {
        description: 'Client has one Finances',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Finances),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Finances>,
  ): Promise<Finances> {
    return this.clientRepository.finances(id).get(filter);
  }

  @post('/clients/{id}/finances', {
    responses: {
      '200': {
        description: 'Client model instance',
        content: {'application/json': {schema: getModelSchemaRef(Finances)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Client.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Finances, {
            title: 'NewFinancesInClient',
            exclude: ['id'],
            optional: ['clientId']
          }),
        },
      },
    }) finances: Omit<Finances, 'id'>,
  ): Promise<Finances> {
    return this.clientRepository.finances(id).create(finances);
  }

  @patch('/clients/{id}/finances', {
    responses: {
      '200': {
        description: 'Client.Finances PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Finances, {partial: true}),
        },
      },
    })
    finances: Partial<Finances>,
    @param.query.object('where', getWhereSchemaFor(Finances)) where?: Where<Finances>,
  ): Promise<Count> {
    return this.clientRepository.finances(id).patch(finances, where);
  }

  @del('/clients/{id}/finances', {
    responses: {
      '200': {
        description: 'Client.Finances DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Finances)) where?: Where<Finances>,
  ): Promise<Count> {
    return this.clientRepository.finances(id).delete(where);
  }
}
