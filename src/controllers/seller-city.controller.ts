import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Seller,
  City,
} from '../models';
import {SellerRepository} from '../repositories';

export class SellerCityController {
  constructor(
    @repository(SellerRepository)
    public sellerRepository: SellerRepository,
  ) { }

  @get('/sellers/{id}/city', {
    responses: {
      '200': {
        description: 'City belonging to Seller',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(City)},
          },
        },
      },
    },
  })
  async getCity(
    @param.path.string('id') id: typeof Seller.prototype.id,
  ): Promise<City> {
    return this.sellerRepository.city(id);
  }
}
