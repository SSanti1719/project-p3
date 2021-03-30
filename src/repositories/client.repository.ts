import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Client, ClientRelations, Request, City, Finances} from '../models';
import {RequestRepository} from './request.repository';
import {CityRepository} from './city.repository';
import {FinancesRepository} from './finances.repository';

export class ClientRepository extends DefaultCrudRepository<
  Client,
  typeof Client.prototype.id,
  ClientRelations
> {

  public readonly requests: HasManyRepositoryFactory<Request, typeof Client.prototype.id>;

  public readonly city: BelongsToAccessor<City, typeof Client.prototype.id>;

  public readonly finances: HasOneRepositoryFactory<Finances, typeof Client.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('RequestRepository') protected requestRepositoryGetter: Getter<RequestRepository>, @repository.getter('CityRepository') protected cityRepositoryGetter: Getter<CityRepository>, @repository.getter('FinancesRepository') protected financesRepositoryGetter: Getter<FinancesRepository>,
  ) {
    super(Client, dataSource);
    this.finances = this.createHasOneRepositoryFactoryFor('finances', financesRepositoryGetter);
    this.registerInclusionResolver('finances', this.finances.inclusionResolver);
    this.city = this.createBelongsToAccessorFor('city', cityRepositoryGetter,);
    this.registerInclusionResolver('city', this.city.inclusionResolver);
    this.requests = this.createHasManyRepositoryFactoryFor('requests', requestRepositoryGetter,);
    this.registerInclusionResolver('requests', this.requests.inclusionResolver);
  }
}
