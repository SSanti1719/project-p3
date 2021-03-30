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
  Admin,
} from '../models';
import {CityRepository} from '../repositories';

export class CityAdminController {
  constructor(
    @repository(CityRepository) protected cityRepository: CityRepository,
  ) { }

  @get('/cities/{id}/admins', {
    responses: {
      '200': {
        description: 'Array of City has many Admin',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Admin)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Admin>,
  ): Promise<Admin[]> {
    return this.cityRepository.admins(id).find(filter);
  }

  @post('/cities/{id}/admins', {
    responses: {
      '200': {
        description: 'City model instance',
        content: {'application/json': {schema: getModelSchemaRef(Admin)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof City.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {
            title: 'NewAdminInCity',
            exclude: ['id'],
            optional: ['cityId']
          }),
        },
      },
    }) admin: Omit<Admin, 'id'>,
  ): Promise<Admin> {
    return this.cityRepository.admins(id).create(admin);
  }

  @patch('/cities/{id}/admins', {
    responses: {
      '200': {
        description: 'City.Admin PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {partial: true}),
        },
      },
    })
    admin: Partial<Admin>,
    @param.query.object('where', getWhereSchemaFor(Admin)) where?: Where<Admin>,
  ): Promise<Count> {
    return this.cityRepository.admins(id).patch(admin, where);
  }

  @del('/cities/{id}/admins', {
    responses: {
      '200': {
        description: 'City.Admin DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Admin)) where?: Where<Admin>,
  ): Promise<Count> {
    return this.cityRepository.admins(id).delete(where);
  }
}
