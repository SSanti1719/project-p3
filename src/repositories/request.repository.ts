import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Request, RequestRelations, Property, Client, Payment} from '../models';
import {PropertyRepository} from './property.repository';
import {ClientRepository} from './client.repository';
import {PaymentRepository} from './payment.repository';

export class RequestRepository extends DefaultCrudRepository<
  Request,
  typeof Request.prototype.id,
  RequestRelations
> {

  public readonly property: BelongsToAccessor<Property, typeof Request.prototype.id>;

  public readonly client: BelongsToAccessor<Client, typeof Request.prototype.id>;

  public readonly payments: HasManyRepositoryFactory<Payment, typeof Request.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('PropertyRepository') protected propertyRepositoryGetter: Getter<PropertyRepository>, @repository.getter('ClientRepository') protected clientRepositoryGetter: Getter<ClientRepository>, @repository.getter('PaymentRepository') protected paymentRepositoryGetter: Getter<PaymentRepository>,
  ) {
    super(Request, dataSource);
    this.payments = this.createHasManyRepositoryFactoryFor('payments', paymentRepositoryGetter,);
    this.registerInclusionResolver('payments', this.payments.inclusionResolver);
    this.client = this.createBelongsToAccessorFor('client', clientRepositoryGetter,);
    this.registerInclusionResolver('client', this.client.inclusionResolver);
    this.property = this.createBelongsToAccessorFor('property', propertyRepositoryGetter,);
    this.registerInclusionResolver('property', this.property.inclusionResolver);
  }
}
