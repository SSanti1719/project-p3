import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Finances,
  Client,
} from '../models';
import {FinancesRepository} from '../repositories';

export class FinancesClientController {
  constructor(
    @repository(FinancesRepository)
    public financesRepository: FinancesRepository,
  ) { }

  @get('/finances/{id}/client', {
    responses: {
      '200': {
        description: 'Client belonging to Finances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Client)},
          },
        },
      },
    },
  })
  async getClient(
    @param.path.string('id') id: typeof Finances.prototype.id,
  ): Promise<Client> {
    return this.financesRepository.client(id);
  }
}
