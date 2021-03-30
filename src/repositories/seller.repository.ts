import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Seller, SellerRelations} from '../models';

export class SellerRepository extends DefaultCrudRepository<
  Seller,
  typeof Seller.prototype.id,
  SellerRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Seller, dataSource);
  }
}
