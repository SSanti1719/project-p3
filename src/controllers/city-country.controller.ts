import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  City,
  Country,
} from '../models';
import {CityRepository} from '../repositories';

export class CityCountryController {
  constructor(
    @repository(CityRepository)
    public cityRepository: CityRepository,
  ) { }

  @get('/cities/{id}/country', {
    responses: {
      '200': {
        description: 'Country belonging to City',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Country)},
          },
        },
      },
    },
  })
  async getCountry(
    @param.path.string('id') id: typeof City.prototype.id,
  ): Promise<Country> {
    return this.cityRepository.country(id);
  }
}
