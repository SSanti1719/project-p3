import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  User,
  City,
} from '../models';
import {UserRepository} from '../repositories';

export class UserCityController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @get('/users/{id}/city', {
    responses: {
      '200': {
        description: 'City belonging to User',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(City)},
          },
        },
      },
    },
  })
  async getCity(
    @param.path.string('id') id: typeof User.prototype.id,
  ): Promise<City> {
    return this.userRepository.city(id);
  }
}
