import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Admin,
  City,
} from '../models';
import {AdminRepository} from '../repositories';

export class AdminCityController {
  constructor(
    @repository(AdminRepository)
    public adminRepository: AdminRepository,
  ) { }

  @get('/admins/{id}/city', {
    responses: {
      '200': {
        description: 'City belonging to Admin',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(City)},
          },
        },
      },
    },
  })
  async getCity(
    @param.path.string('id') id: typeof Admin.prototype.id,
  ): Promise<City> {
    return this.adminRepository.city(id);
  }
}
