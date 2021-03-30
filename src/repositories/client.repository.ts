import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Client, ClientRelations, Request, City} from '../models';
import {RequestRepository} from './request.repository';
import {CityRepository} from './city.repository';

export class ClientRepository extends DefaultCrudRepository<
  Client,
  typeof Client.prototype.id,
  ClientRelations
> {

  public readonly requests: HasManyRepositoryFactory<Request, typeof Client.prototype.id>;

  public readonly city: BelongsToAccessor<City, typeof Client.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('RequestRepository') protected requestRepositoryGetter: Getter<RequestRepository>, @repository.getter('CityRepository') protected cityRepositoryGetter: Getter<CityRepository>,
  ) {
    super(Client, dataSource);
    this.city = this.createBelongsToAccessorFor('city', cityRepositoryGetter,);
    this.registerInclusionResolver('city', this.city.inclusionResolver);
    this.requests = this.createHasManyRepositoryFactoryFor('requests', requestRepositoryGetter,);
    this.registerInclusionResolver('requests', this.requests.inclusionResolver);
  }
}
