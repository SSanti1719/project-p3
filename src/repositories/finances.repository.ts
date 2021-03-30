import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Finances, FinancesRelations} from '../models';

export class FinancesRepository extends DefaultCrudRepository<
  Finances,
  typeof Finances.prototype.id,
  FinancesRelations
> {
  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Finances, dataSource);
  }
}
