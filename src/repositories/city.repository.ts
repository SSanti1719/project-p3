import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {City, CityRelations, Client, Country} from '../models';
import {ClientRepository} from './client.repository';
import {CountryRepository} from './country.repository';

export class CityRepository extends DefaultCrudRepository<
  City,
  typeof City.prototype.id,
  CityRelations
> {

  public readonly country: BelongsToAccessor<Country, typeof City.prototype.id>;

  public readonly clients: HasManyRepositoryFactory<Client, typeof City.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('CountryRepository') protected countryRepositoryGetter: Getter<CountryRepository>, @repository.getter('ClientRepository') protected clientRepositoryGetter: Getter<ClientRepository>,
  ) {
    super(City, dataSource);
    this.clients = this.createHasManyRepositoryFactoryFor('clients', clientRepositoryGetter,);
    this.registerInclusionResolver('clients', this.clients.inclusionResolver);
    this.country = this.createBelongsToAccessorFor('country', countryRepositoryGetter,);
    this.registerInclusionResolver('country', this.country.inclusionResolver);
  }
}
