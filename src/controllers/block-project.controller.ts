import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Block,
  Project,
} from '../models';
import {BlockRepository} from '../repositories';

export class BlockProjectController {
  constructor(
    @repository(BlockRepository)
    public blockRepository: BlockRepository,
  ) { }

  @get('/blocks/{id}/project', {
    responses: {
      '200': {
        description: 'Project belonging to Block',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async getProject(
    @param.path.string('id') id: typeof Block.prototype.id,
  ): Promise<Project> {
    return this.blockRepository.project(id);
  }
}
