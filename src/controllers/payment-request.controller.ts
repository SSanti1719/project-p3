import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Payment,
  Request,
} from '../models';
import {PaymentRepository} from '../repositories';

export class PaymentRequestController {
  constructor(
    @repository(PaymentRepository)
    public paymentRepository: PaymentRepository,
  ) { }

  @get('/payments/{id}/request', {
    responses: {
      '200': {
        description: 'Request belonging to Payment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Request)},
          },
        },
      },
    },
  })
  async getRequest(
    @param.path.string('id') id: typeof Payment.prototype.id,
  ): Promise<Request> {
    return this.paymentRepository.request(id);
  }
}
