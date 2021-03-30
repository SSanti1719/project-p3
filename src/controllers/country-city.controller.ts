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
  Country,
  City,
} from '../models';
import {CountryRepository} from '../repositories';

export class CountryCityController {
  constructor(
    @repository(CountryRepository) protected countryRepository: CountryRepository,
  ) { }

  @get('/countries/{id}/cities', {
    responses: {
      '200': {
        description: 'Array of Country has many City',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(City)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<City>,
  ): Promise<City[]> {
    return this.countryRepository.cities(id).find(filter);
  }

  @post('/countries/{id}/cities', {
    responses: {
      '200': {
        description: 'Country model instance',
        content: {'application/json': {schema: getModelSchemaRef(City)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Country.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {
            title: 'NewCityInCountry',
            exclude: ['id'],
            optional: ['countryId']
          }),
        },
      },
    }) city: Omit<City, 'id'>,
  ): Promise<City> {
    return this.countryRepository.cities(id).create(city);
  }

  @patch('/countries/{id}/cities', {
    responses: {
      '200': {
        description: 'Country.City PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {partial: true}),
        },
      },
    })
    city: Partial<City>,
    @param.query.object('where', getWhereSchemaFor(City)) where?: Where<City>,
  ): Promise<Count> {
    return this.countryRepository.cities(id).patch(city, where);
  }

  @del('/countries/{id}/cities', {
    responses: {
      '200': {
        description: 'Country.City DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(City)) where?: Where<City>,
  ): Promise<Count> {
    return this.countryRepository.cities(id).delete(where);
  }
}
