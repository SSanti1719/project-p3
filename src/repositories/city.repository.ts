import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {City, CityRelations, Country, Client, Seller, Admin} from '../models';
import {CountryRepository} from './country.repository';
import {ClientRepository} from './client.repository';
import {SellerRepository} from './seller.repository';
import {AdminRepository} from './admin.repository';

export class CityRepository extends DefaultCrudRepository<
  City,
  typeof City.prototype.id,
  CityRelations
> {

  public readonly country: BelongsToAccessor<Country, typeof City.prototype.id>;

  public readonly clients: HasManyRepositoryFactory<Client, typeof City.prototype.id>;

  public readonly sellers: HasManyRepositoryFactory<Seller, typeof City.prototype.id>;

  public readonly admins: HasManyRepositoryFactory<Admin, typeof City.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('CountryRepository') protected countryRepositoryGetter: Getter<CountryRepository>, @repository.getter('ClientRepository') protected clientRepositoryGetter: Getter<ClientRepository>, @repository.getter('SellerRepository') protected sellerRepositoryGetter: Getter<SellerRepository>, @repository.getter('AdminRepository') protected adminRepositoryGetter: Getter<AdminRepository>,
  ) {
    super(City, dataSource);
    this.admins = this.createHasManyRepositoryFactoryFor('admins', adminRepositoryGetter,);
    this.registerInclusionResolver('admins', this.admins.inclusionResolver);
    this.sellers = this.createHasManyRepositoryFactoryFor('sellers', sellerRepositoryGetter,);
    this.registerInclusionResolver('sellers', this.sellers.inclusionResolver);
    this.clients = this.createHasManyRepositoryFactoryFor('clients', clientRepositoryGetter,);
    this.registerInclusionResolver('clients', this.clients.inclusionResolver);
    this.country = this.createBelongsToAccessorFor('country', countryRepositoryGetter,);
    this.registerInclusionResolver('country', this.country.inclusionResolver);
  }
}
