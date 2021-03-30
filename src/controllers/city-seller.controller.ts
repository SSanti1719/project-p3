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
  Seller,
} from '../models';
import {CityRepository} from '../repositories';

export class CitySellerController {
  constructor(
    @repository(CityRepository) protected cityRepository: CityRepository,
  ) { }

  @get('/cities/{id}/sellers', {
    responses: {
      '200': {
        description: 'Array of City has many Seller',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Seller)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Seller>,
  ): Promise<Seller[]> {
    return this.cityRepository.sellers(id).find(filter);
  }

  @post('/cities/{id}/sellers', {
    responses: {
      '200': {
        description: 'City model instance',
        content: {'application/json': {schema: getModelSchemaRef(Seller)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof City.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Seller, {
            title: 'NewSellerInCity',
            exclude: ['id'],
            optional: ['cityId']
          }),
        },
      },
    }) seller: Omit<Seller, 'id'>,
  ): Promise<Seller> {
    return this.cityRepository.sellers(id).create(seller);
  }

  @patch('/cities/{id}/sellers', {
    responses: {
      '200': {
        description: 'City.Seller PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Seller, {partial: true}),
        },
      },
    })
    seller: Partial<Seller>,
    @param.query.object('where', getWhereSchemaFor(Seller)) where?: Where<Seller>,
  ): Promise<Count> {
    return this.cityRepository.sellers(id).patch(seller, where);
  }

  @del('/cities/{id}/sellers', {
    responses: {
      '200': {
        description: 'City.Seller DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Seller)) where?: Where<Seller>,
  ): Promise<Count> {
    return this.cityRepository.sellers(id).delete(where);
  }
}
