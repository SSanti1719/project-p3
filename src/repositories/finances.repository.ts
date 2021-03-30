import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Finances, FinancesRelations, Client} from '../models';
import {ClientRepository} from './client.repository';

export class FinancesRepository extends DefaultCrudRepository<
  Finances,
  typeof Finances.prototype.id,
  FinancesRelations
> {

  public readonly client: BelongsToAccessor<Client, typeof Finances.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('ClientRepository') protected clientRepositoryGetter: Getter<ClientRepository>,
  ) {
    super(Finances, dataSource);
    this.client = this.createBelongsToAccessorFor('client', clientRepositoryGetter,);
    this.registerInclusionResolver('client', this.client.inclusionResolver);
  }
}
