import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Request, RequestRelations, Property, Client} from '../models';
import {PropertyRepository} from './property.repository';
import {ClientRepository} from './client.repository';

export class RequestRepository extends DefaultCrudRepository<
  Request,
  typeof Request.prototype.id,
  RequestRelations
> {

  public readonly property: BelongsToAccessor<Property, typeof Request.prototype.id>;

  public readonly client: BelongsToAccessor<Client, typeof Request.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('PropertyRepository') protected propertyRepositoryGetter: Getter<PropertyRepository>, @repository.getter('ClientRepository') protected clientRepositoryGetter: Getter<ClientRepository>,
  ) {
    super(Request, dataSource);
    this.client = this.createBelongsToAccessorFor('client', clientRepositoryGetter,);
    this.registerInclusionResolver('client', this.client.inclusionResolver);
    this.property = this.createBelongsToAccessorFor('property', propertyRepositoryGetter,);
    this.registerInclusionResolver('property', this.property.inclusionResolver);
  }
}
