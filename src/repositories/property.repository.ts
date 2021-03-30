import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Property, PropertyRelations, Request} from '../models';
import {RequestRepository} from './request.repository';

export class PropertyRepository extends DefaultCrudRepository<
  Property,
  typeof Property.prototype.id,
  PropertyRelations
> {

  public readonly requests: HasManyRepositoryFactory<Request, typeof Property.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('RequestRepository') protected requestRepositoryGetter: Getter<RequestRepository>,
  ) {
    super(Property, dataSource);
    this.requests = this.createHasManyRepositoryFactoryFor('requests', requestRepositoryGetter,);
    this.registerInclusionResolver('requests', this.requests.inclusionResolver);
  }
}
