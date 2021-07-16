import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
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
  response
} from '@loopback/rest';
import {codeTypes, emailTypes, propertyStatus} from '../config/index.config';
import {ClientOffer} from '../config/interfaces';
import {Property} from '../models';
import {BlockRepository, CityRepository, ProjectRepository, PropertyRepository, UserRepository} from '../repositories';
import {GeneralFunctionsService} from '../services';

export class PropertyController {
  constructor(
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
    @repository(BlockRepository)
    public blockRepository: BlockRepository,
    @service(GeneralFunctionsService)
    private generalFunctions: GeneralFunctionsService,
    @repository(CityRepository)
    private cityRepository: CityRepository,
    @repository(ProjectRepository)
    private projectRepository: ProjectRepository,
    @repository(UserRepository)
    private userRepository: UserRepository

  ) {}

  @post('/properties')
  @response(200, {
    description: 'Property model instance',
    content: {'application/json': {schema: getModelSchemaRef(Property)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {
            title: 'NewProperty',
            exclude: ['id', 'code', 'status'],
          }),
        },
      },
    })
    property: Omit<Property, 'id'>,
  ): Promise<Property> {
    if (
      !property.blockId ||
      !(await this.blockRepository.findById(property.blockId))
    )
      throw new HttpErrors.BadRequest('BlockId no valid');

    property.code = this.generalFunctions.generateCode(codeTypes.property);
    property.status = propertyStatus.available;

    return this.propertyRepository.create(property);
  }

  @get('/properties/count')
  @response(200, {
    description: 'Property model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Property) where?: Where<Property>): Promise<Count> {
    return this.propertyRepository.count(where);
  }

  @get('/properties')
  @response(200, {
    description: 'Array of Property model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Property, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Property) filter?: Filter<Property>,
  ): Promise<Property[]> {
    return this.propertyRepository.find(filter);
  }

  @patch('/properties')
  @response(200, {
    description: 'Property PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {partial: true}),
        },
      },
    })
    property: Property,
    @param.where(Property) where?: Where<Property>,
  ): Promise<Count> {
    return this.propertyRepository.updateAll(property, where);
  }

  @get('/properties/{id}')
  @response(200, {
    description: 'Property model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Property, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Property, {exclude: 'where'})
    filter?: FilterExcludingWhere<Property>,
  ): Promise<Property> {
    return this.propertyRepository.findById(id, filter);
  }

  @patch('/properties/{id}')
  @response(204, {
    description: 'Property PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Property, {partial: true}),
        },
      },
    })
    property: Property,
  ): Promise<void> {
    await this.propertyRepository.updateById(id, property);
  }

  @put('/properties/{id}')
  @response(204, {
    description: 'Property PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() property: Property,
  ): Promise<void> {
    await this.propertyRepository.replaceById(id, property);
  }

  @del('/properties/{id}')
  @response(204, {
    description: 'Property DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.propertyRepository.deleteById(id);
  }



  @post('/properties/{id}/offer')
  @response(204, {
    description: 'Client offer send successfully',
  })
  async sendOffer(@param.path.string('id') id: string, @requestBody() offer:ClientOffer){

    const property = await this.propertyRepository.findById(id);

    if(!property) throw new HttpErrors.BadRequest('Id no valid');

    const block = await this.blockRepository.findById(property.blockId);

    const project = await this.projectRepository.findById(block.projectId);



    const sellers = await this.userRepository.find({ where: { cityId: project.cityId, role:2} });

    const limitRandom = sellers.length;

    const selectedSeller = sellers[Math.floor(Math.random() * (limitRandom - 0)) + 0];

    const emailData = {
      ...offer,
      email: selectedSeller.email,
      clientEmail: offer.email,
      projectName: project.name,
      projectCode: project.code,
      block: block.name,
      property: property.number
    }

    await this.generalFunctions.EmailNotification(emailData, emailTypes.client_offer);
  }
}

