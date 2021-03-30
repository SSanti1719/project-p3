import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Payment, PaymentRelations, Request} from '../models';
import {RequestRepository} from './request.repository';

export class PaymentRepository extends DefaultCrudRepository<
  Payment,
  typeof Payment.prototype.id,
  PaymentRelations
> {

  public readonly request: BelongsToAccessor<Request, typeof Payment.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('RequestRepository') protected requestRepositoryGetter: Getter<RequestRepository>,
  ) {
    super(Payment, dataSource);
    this.request = this.createBelongsToAccessorFor('request', requestRepositoryGetter,);
    this.registerInclusionResolver('request', this.request.inclusionResolver);
  }
}
