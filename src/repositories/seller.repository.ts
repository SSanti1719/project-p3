import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Seller, SellerRelations, City} from '../models';
import {CityRepository} from './city.repository';

export class SellerRepository extends DefaultCrudRepository<
  Seller,
  typeof Seller.prototype.id,
  SellerRelations
> {

  public readonly city: BelongsToAccessor<City, typeof Seller.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('CityRepository') protected cityRepositoryGetter: Getter<CityRepository>,
  ) {
    super(Seller, dataSource);
    this.city = this.createBelongsToAccessorFor('city', cityRepositoryGetter,);
    this.registerInclusionResolver('city', this.city.inclusionResolver);
  }
}
