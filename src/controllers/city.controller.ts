import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {codeTypes} from '../config/index.config';
import {City} from '../models';
import {CityRepository, CountryRepository} from '../repositories';
import {GeneralFunctionsService} from '../services';

export class CityController {
  constructor(
    @repository(CityRepository)
    public cityRepository: CityRepository,
    @repository(CountryRepository) public countryRepository: CountryRepository,
    @service(GeneralFunctionsService)
    private generalFunctions: GeneralFunctionsService,
  ) {}

  @post('/cities')
  @response(200, {
    description: 'City model instance',
    content: {'application/json': {schema: getModelSchemaRef(City)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {
            title: 'NewCity',
            exclude: ['id', 'code'],
          }),
        },
      },
    })
    city: Omit<City, 'id'>,
  ): Promise<City> {
    if (
      !city.countryId ||
      !(await this.countryRepository.findById(city.countryId))
    )
      throw new HttpErrors.BadRequest('countryId no valid');

    city.code = this.generalFunctions.generateCode(codeTypes.city);

    return this.cityRepository.create(city);
  }

  @get('/cities/count')
  @response(200, {
    description: 'City model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(City) where?: Where<City>): Promise<Count> {
    return this.cityRepository.count(where);
  }

  @get('/cities')
  @response(200, {
    description: 'Array of City model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(City, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(City) filter?: Filter<City>): Promise<City[]> {
    return this.cityRepository.find(filter);
  }

  @patch('/cities')
  @response(200, {
    description: 'City PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {partial: true}),
        },
      },
    })
    city: City,
    @param.where(City) where?: Where<City>,
  ): Promise<Count> {
    return this.cityRepository.updateAll(city, where);
  }

  @get('/cities/{id}')
  @response(200, {
    description: 'City model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(City, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(City, {exclude: 'where'}) filter?: FilterExcludingWhere<City>,
  ): Promise<City> {
    return this.cityRepository.findById(id, filter);
  }

  @patch('/cities/{id}')
  @response(204, {
    description: 'City PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {partial: true}),
        },
      },
    })
    city: City,
  ): Promise<void> {
    await this.cityRepository.updateById(id, city);
  }

  @put('/cities/{id}')
  @response(204, {
    description: 'City PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() city: City,
  ): Promise<void> {
    await this.cityRepository.replaceById(id, city);
  }

  @del('/cities/{id}')
  @response(204, {
    description: 'City DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.cityRepository.deleteById(id);
  }
}
