import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Finances} from '../models';
import {FinancesRepository} from '../repositories';

export class FinancesController {
  constructor(
    @repository(FinancesRepository)
    public financesRepository : FinancesRepository,
  ) {}

  @post('/finances')
  @response(200, {
    description: 'Finances model instance',
    content: {'application/json': {schema: getModelSchemaRef(Finances)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Finances, {
            title: 'NewFinances',
            exclude: ['id'],
          }),
        },
      },
    })
    finances: Omit<Finances, 'id'>,
  ): Promise<Finances> {
    return this.financesRepository.create(finances);
  }

  @get('/finances/count')
  @response(200, {
    description: 'Finances model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Finances) where?: Where<Finances>,
  ): Promise<Count> {
    return this.financesRepository.count(where);
  }

  @get('/finances')
  @response(200, {
    description: 'Array of Finances model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Finances, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Finances) filter?: Filter<Finances>,
  ): Promise<Finances[]> {
    return this.financesRepository.find(filter);
  }

  @patch('/finances')
  @response(200, {
    description: 'Finances PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Finances, {partial: true}),
        },
      },
    })
    finances: Finances,
    @param.where(Finances) where?: Where<Finances>,
  ): Promise<Count> {
    return this.financesRepository.updateAll(finances, where);
  }

  @get('/finances/{id}')
  @response(200, {
    description: 'Finances model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Finances, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Finances, {exclude: 'where'}) filter?: FilterExcludingWhere<Finances>
  ): Promise<Finances> {
    return this.financesRepository.findById(id, filter);
  }

  @patch('/finances/{id}')
  @response(204, {
    description: 'Finances PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Finances, {partial: true}),
        },
      },
    })
    finances: Finances,
  ): Promise<void> {
    await this.financesRepository.updateById(id, finances);
  }

  @put('/finances/{id}')
  @response(204, {
    description: 'Finances PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() finances: Finances,
  ): Promise<void> {
    await this.financesRepository.replaceById(id, finances);
  }

  @del('/finances/{id}')
  @response(204, {
    description: 'Finances DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.financesRepository.deleteById(id);
  }
}
