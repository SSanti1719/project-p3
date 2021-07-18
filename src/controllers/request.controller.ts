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
import {codeTypes, emailTypes, requestStatus} from '../config/index.config';
import {Request} from '../models';
import {
  ClientRepository,
  PropertyRepository,
  RequestRepository,
  UserRepository,
} from '../repositories';
import {GeneralFunctionsService} from '../services';

export class RequestController {
  constructor(
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(ClientRepository) public clientRepository: ClientRepository,
    @service(GeneralFunctionsService)
    private generalFunctions: GeneralFunctionsService,
  ) {}

  @post('/requests')
  @response(200, {
    description: 'Request model instance',
    content: {'application/json': {schema: getModelSchemaRef(Request)}},
  })
  async create(@requestBody() request: any): Promise<Request> {
    console.log('request: ', request);

    if (!request.propertyCode || !request.seller_id || !request.clientDocument)
      throw new HttpErrors.BadRequest(
        'propertyId , userId , clientId is required',
      );

    const client = await this.clientRepository.findOne({
      where: {document: request.clientDocument},
    });
    console.log('client: ', client);
    const seller = await this.userRepository.findById(request.seller_id);
    console.log('seller: ', seller);
    const property = await this.propertyRepository.findOne({
      where: {code: request.propertyCode},
    });
    console.log('property: ', property);

    if (!property || !seller || !client)
      throw new HttpErrors.BadRequest(
        'propertyId or userId or clientId no valid',
      );

    request.code = this.generalFunctions.generateCode(codeTypes.request);

    request.status = requestStatus.review;

    request.date = new Date().toJSON();

    const requestCreated = await this.requestRepository.create({
      code: request.code,
      date: request.date,
      clientId: client.id,
      userId: seller.id,
      feeNumber: request.feeNumber,
      offer: request.offer,
      propertyId: property.id,
    });

    const emailData = {
      code: requestCreated.code,
      seller_name: seller.name,
      property_code: property.code,
      property_number: property.number,
      value: property.value,
      offer: requestCreated.offer,
      feeNumber: requestCreated.feeNumber,
      client_name: client.name,
      email: client.email,
      client_document: client.document,
      client_phone: client.phone,
    };
    await this.generalFunctions.EmailNotification(
      emailData,
      emailTypes.request_create,
    );

    return requestCreated;
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
    request: Request | any,
  ): Promise<void> {
    if (
      request.status !== requestStatus.accepted &&
      request.status !== requestStatus.rejected &&
      request.status !== requestStatus.review
    ) {
      throw new HttpErrors.BadRequest('request status no valid');
    } else {
      const findRequest = await this.requestRepository.findById(id);
      const seller = await this.userRepository.findById(findRequest.userId);
      const property = await this.propertyRepository.findById(
        findRequest.propertyId,
      );
      const client = await this.clientRepository.findById(findRequest.clientId);
      const emailData = {
        code: findRequest.code,
        seller_name: seller.name,
        property_code: property.code,
        property_number: property.number,
        status: request.status,
        email: client.email,
      };
      await this.generalFunctions.EmailNotification(
        emailData,
        emailTypes.request_update,
      );

      if (request.status === requestStatus.accepted)
        request.totalPayment = property.value;

      await this.requestRepository.updateById(id, request);
    }
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
