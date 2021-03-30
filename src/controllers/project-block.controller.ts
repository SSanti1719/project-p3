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
  Project,
  Block,
} from '../models';
import {ProjectRepository} from '../repositories';

export class ProjectBlockController {
  constructor(
    @repository(ProjectRepository) protected projectRepository: ProjectRepository,
  ) { }

  @get('/projects/{id}/blocks', {
    responses: {
      '200': {
        description: 'Array of Project has many Block',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Block)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Block>,
  ): Promise<Block[]> {
    return this.projectRepository.blocks(id).find(filter);
  }

  @post('/projects/{id}/blocks', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {schema: getModelSchemaRef(Block)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Project.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Block, {
            title: 'NewBlockInProject',
            exclude: ['id'],
            optional: ['projectId']
          }),
        },
      },
    }) block: Omit<Block, 'id'>,
  ): Promise<Block> {
    return this.projectRepository.blocks(id).create(block);
  }

  @patch('/projects/{id}/blocks', {
    responses: {
      '200': {
        description: 'Project.Block PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Block, {partial: true}),
        },
      },
    })
    block: Partial<Block>,
    @param.query.object('where', getWhereSchemaFor(Block)) where?: Where<Block>,
  ): Promise<Count> {
    return this.projectRepository.blocks(id).patch(block, where);
  }

  @del('/projects/{id}/blocks', {
    responses: {
      '200': {
        description: 'Project.Block DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Block)) where?: Where<Block>,
  ): Promise<Count> {
    return this.projectRepository.blocks(id).delete(where);
  }
}
