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
import {requestStatus} from '../config/index.config';
import {Request} from '../models';
import {
  ClientRepository,
  PropertyRepository,
  RequestRepository,
  UserRepository,
} from '../repositories';

export class RequestController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(ClientRepository) public clientRepository: ClientRepository,
  ) {}

  @post('/requests')
  @response(200, {
    description: 'Request model instance',
    content: {'application/json': {schema: getModelSchemaRef(Request)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {
            title: 'NewRequest',
            exclude: ['id'],
          }),
        },
      },
    })
    request: Omit<Request, 'id'>,
  ): Promise<Request> {
    if (
      !request.propertyId ||
      !request.userId ||
      !request.clientId ||
      !(await this.propertyRepository.findById(request.propertyId)) ||
      !(await this.userRepository.findById(request.userId)) ||
      !(await this.clientRepository.findById(request.clientId))
    )
      throw new HttpErrors.BadRequest(
        'propertyId or userId or clientId no valid',
      );

    request.status = requestStatus.review;

    return this.requestRepository.create(request);
  }

  @get('/requests/count')
  @response(200, {
    description: 'Request model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Request) where?: Where<Request>): Promise<Count> {
    return this.requestRepository.count(where);
  }

  @get('/requests')
  @response(200, {
    description: 'Array of Request model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Request, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Request) filter?: Filter<Request>,
  ): Promise<Request[]> {
    return this.requestRepository.find(filter);
  }

  @patch('/requests')
  @response(200, {
    description: 'Request PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {partial: true}),
        },
      },
    })
    request: Request,
    @param.where(Request) where?: Where<Request>,
  ): Promise<Count> {
    return this.requestRepository.updateAll(request, where);
  }

  @get('/requests/{id}')
  @response(200, {
    description: 'Request model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Request, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Request, {exclude: 'where'})
    filter?: FilterExcludingWhere<Request>,
  ): Promise<Request> {
    return this.requestRepository.findById(id, filter);
  }

  @patch('/requests/{id}')
  @response(204, {
    description: 'Request PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Request, {partial: true}),
        },
      },
    })
    request: Request,
  ): Promise<void> {
    if (
      request.status !== requestStatus.accepted &&
      request.status !== requestStatus.rejected &&
      request.status !== requestStatus.review
    )
      throw new HttpErrors.BadRequest('request status no valid');
    await this.requestRepository.updateById(id, request);
  }

  @put('/requests/{id}')
  @response(204, {
    description: 'Request PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() request: Request,
  ): Promise<void> {
    if (
      request.status !== requestStatus.accepted &&
      request.status !== requestStatus.rejected &&
      request.status !== requestStatus.review
    )
      throw new HttpErrors.BadRequest('request status no valid');
    await this.requestRepository.replaceById(id, request);
  }

  @del('/requests/{id}')
  @response(204, {
    description: 'Request DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.requestRepository.deleteById(id);
  }
}
