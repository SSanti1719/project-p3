import {inject, intercept, service} from '@loopback/core';
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
  Request,
  requestBody,
  response,
  RestBindings,
} from '@loopback/rest';
import path from 'path';
import {
  cloudFilesRoutes,
  codeTypes,
  emailTypes,
  requestStatus,
} from '../config/index.config';
import {filesInterceptor} from '../middleware/multer';
import {Payment} from '../models';
import {
  ClientRepository,
  PaymentRepository,
  PropertyRepository,
  RequestRepository,
} from '../repositories';
import {GeneralFunctionsService} from '../services';
import {cloudinary} from '../services/cloudinary.service';

export class PaymentController {
  constructor(
    @repository(PaymentRepository)
    public paymentRepository: PaymentRepository,
    @repository(RequestRepository)
    public requestRepository: RequestRepository,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @service(GeneralFunctionsService)
    private generalFunctions: GeneralFunctionsService,
    @repository(PropertyRepository)
    public propertyRepository: PropertyRepository,
    @repository(ClientRepository)
    public clientRepository: ClientRepository,
  ) {}

  @post('/payments')
  @intercept(filesInterceptor)
  @response(200, {
    description: 'Payment model instance',
    content: {'application/json': {schema: getModelSchemaRef(Payment)}},
  })
  async create(): Promise<Payment> {
    let {value, date, requestCode} = this.req.body;
    const {file} = this.req;

    value = Number(value);

    if (!value || !date || !requestCode)
      throw new HttpErrors.BadRequest('Incomplete data');

    const request = await this.requestRepository.findOne({
      where: {code: requestCode},
    });

    if (!request || request.status !== requestStatus.accepted)
      throw new HttpErrors.BadRequest('requestCode no valid');

    if (<number>request.totalPayment <= 0)
      throw new HttpErrors.BadRequest(
        'payment no valid, the payment has already been finalized',
      );

    if (!request.firstPayment) {
      if (value !== request.offer)
        throw new HttpErrors.BadRequest(
          'First payment value does not match offer value',
        );
      console.log(request.totalPayment, typeof request.totalPayment);
      let totalPayment = <number>request.totalPayment - value;
      let feePayment = totalPayment / <number>request.feeNumber;

      request.totalPayment = totalPayment;
      request.feePayment = feePayment;
    } else {
      if (Number(value) !== request.feePayment)
        throw new HttpErrors.BadRequest(
          'Payment value does not match fee payment value',
        );

      let totalPayment = <number>request.totalPayment - value;
      request.totalPayment = totalPayment;
    }

    const uploadedImage: cloudinary.UploadApiResponse = await cloudinary.v2.uploader.upload(
      file.path,
      {
        public_id: `${cloudFilesRoutes.payments}/${path.basename(
          file.path,
          path.extname(file.path),
        )}`,
      },
    );

    const receiptPayment = uploadedImage.secure_url;
    const receipt_public_id = uploadedImage.public_id;
    const code = this.generalFunctions.generateCode(codeTypes.payment);

    const payment = await this.paymentRepository.create({
      code,
      value,
      date,
      receiptPayment,
      receipt_public_id,
      requestId: request.id,
    });

    if (!request.firstPayment) {
      request.firstPayment = payment.id;
    }

    this.requestRepository.updateById(request.id, request);

    const property = await this.propertyRepository.findById(request.propertyId);
    const client = await this.clientRepository.findById(request.clientId);

    const emailData = {
      value: payment.value,
      code: payment.code,
      date: payment.date,
      propertyCode: property.code,
      totalValue: property.value,
      remainingValue: request.totalPayment,
      requestCode,
      email: client.email,
      feePayment: request.feePayment,
      feeNumber: request.feeNumber,
    };

    this.generalFunctions.EmailNotification(
      emailData,
      emailTypes.client_payment,
    );

    return payment;
  }

  @get('/payments/count')
  @response(200, {
    description: 'Payment model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Payment) where?: Where<Payment>): Promise<Count> {
    return this.paymentRepository.count(where);
  }

  @get('/payments')
  @response(200, {
    description: 'Array of Payment model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Payment, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Payment) filter?: Filter<Payment>,
  ): Promise<Payment[]> {
    return this.paymentRepository.find(filter);
  }

  @patch('/payments')
  @response(200, {
    description: 'Payment PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payment, {partial: true}),
        },
      },
    })
    payment: Payment,
    @param.where(Payment) where?: Where<Payment>,
  ): Promise<Count> {
    return this.paymentRepository.updateAll(payment, where);
  }

  @get('/payments/{id}')
  @response(200, {
    description: 'Payment model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Payment, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Payment, {exclude: 'where'})
    filter?: FilterExcludingWhere<Payment>,
  ): Promise<Payment> {
    return this.paymentRepository.findById(id, filter);
  }

  @patch('/payments/{id}')
  @response(204, {
    description: 'Payment PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payment, {partial: true}),
        },
      },
    })
    payment: Payment,
  ): Promise<void> {
    await this.paymentRepository.updateById(id, payment);
  }

  @put('/payments/{id}')
  @response(204, {
    description: 'Payment PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() payment: Payment,
  ): Promise<void> {
    await this.paymentRepository.replaceById(id, payment);
  }

  @del('/payments/{id}')
  @response(204, {
    description: 'Payment DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.paymentRepository.deleteById(id);
  }
}
