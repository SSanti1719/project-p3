import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Project,
  City,
} from '../models';
import {ProjectRepository} from '../repositories';

export class ProjectCityController {
  constructor(
    @repository(ProjectRepository)
    public projectRepository: ProjectRepository,
  ) { }

  @get('/projects/{id}/city', {
    responses: {
      '200': {
        description: 'City belonging to Project',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(City)},
          },
        },
      },
    },
  })
  async getCity(
    @param.path.string('id') id: typeof Project.prototype.id,
  ): Promise<City> {
    return this.projectRepository.city(id);
  }
}
