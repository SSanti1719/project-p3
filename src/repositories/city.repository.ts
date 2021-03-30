import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {City, CityRelations, Client, Country, Project} from '../models';
import {ClientRepository} from './client.repository';
import {CountryRepository} from './country.repository';
import {ProjectRepository} from './project.repository';

export class CityRepository extends DefaultCrudRepository<
  City,
  typeof City.prototype.id,
  CityRelations
> {

  public readonly country: BelongsToAccessor<Country, typeof City.prototype.id>;

  public readonly clients: HasManyRepositoryFactory<Client, typeof City.prototype.id>;

  public readonly projects: HasManyRepositoryFactory<Project, typeof City.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('CountryRepository') protected countryRepositoryGetter: Getter<CountryRepository>, @repository.getter('ClientRepository') protected clientRepositoryGetter: Getter<ClientRepository>, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>,
  ) {
    super(City, dataSource);
    this.projects = this.createHasManyRepositoryFactoryFor('projects', projectRepositoryGetter,);
    this.registerInclusionResolver('projects', this.projects.inclusionResolver);
    this.clients = this.createHasManyRepositoryFactoryFor('clients', clientRepositoryGetter,);
    this.registerInclusionResolver('clients', this.clients.inclusionResolver);
    this.country = this.createBelongsToAccessorFor('country', countryRepositoryGetter,);
    this.registerInclusionResolver('country', this.country.inclusionResolver);
  }
}
