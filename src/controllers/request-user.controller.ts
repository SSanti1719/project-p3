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
  User,
} from '../models';
import {RequestRepository} from '../repositories';

export class RequestUserController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
  ) { }

  @get('/requests/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Request',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Request.prototype.id,
  ): Promise<User> {
    return this.requestRepository.user(id);
  }
}
