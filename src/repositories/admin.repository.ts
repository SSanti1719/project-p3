import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Admin, AdminRelations, City} from '../models';
import {CityRepository} from './city.repository';

export class AdminRepository extends DefaultCrudRepository<
  Admin,
  typeof Admin.prototype.id,
  AdminRelations
> {

  public readonly city: BelongsToAccessor<City, typeof Admin.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('CityRepository') protected cityRepositoryGetter: Getter<CityRepository>,
  ) {
    super(Admin, dataSource);
    this.city = this.createBelongsToAccessorFor('city', cityRepositoryGetter,);
    this.registerInclusionResolver('city', this.city.inclusionResolver);
  }
}
