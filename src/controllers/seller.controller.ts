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
import {Seller} from '../models';
import {SellerRepository} from '../repositories';

export class SellerController {
  constructor(
    @repository(SellerRepository)
    public sellerRepository : SellerRepository,
  ) {}

  @post('/sellers')
  @response(200, {
    description: 'Seller model instance',
    content: {'application/json': {schema: getModelSchemaRef(Seller)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Seller, {
            title: 'NewSeller',
            exclude: ['id'],
          }),
        },
      },
    })
    seller: Omit<Seller, 'id'>,
  ): Promise<Seller> {
    return this.sellerRepository.create(seller);
  }

  @get('/sellers/count')
  @response(200, {
    description: 'Seller model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Seller) where?: Where<Seller>,
  ): Promise<Count> {
    return this.sellerRepository.count(where);
  }

  @get('/sellers')
  @response(200, {
    description: 'Array of Seller model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Seller, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Seller) filter?: Filter<Seller>,
  ): Promise<Seller[]> {
    return this.sellerRepository.find(filter);
  }

  @patch('/sellers')
  @response(200, {
    description: 'Seller PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Seller, {partial: true}),
        },
      },
    })
    seller: Seller,
    @param.where(Seller) where?: Where<Seller>,
  ): Promise<Count> {
    return this.sellerRepository.updateAll(seller, where);
  }

  @get('/sellers/{id}')
  @response(200, {
    description: 'Seller model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Seller, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Seller, {exclude: 'where'}) filter?: FilterExcludingWhere<Seller>
  ): Promise<Seller> {
    return this.sellerRepository.findById(id, filter);
  }

  @patch('/sellers/{id}')
  @response(204, {
    description: 'Seller PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Seller, {partial: true}),
        },
      },
    })
    seller: Seller,
  ): Promise<void> {
    await this.sellerRepository.updateById(id, seller);
  }

  @put('/sellers/{id}')
  @response(204, {
    description: 'Seller PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() seller: Seller,
  ): Promise<void> {
    await this.sellerRepository.replaceById(id, seller);
  }

  @del('/sellers/{id}')
  @response(204, {
    description: 'Seller DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.sellerRepository.deleteById(id);
  }
}
