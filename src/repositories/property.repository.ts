import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Property, PropertyRelations, Request, Block} from '../models';
import {RequestRepository} from './request.repository';
import {BlockRepository} from './block.repository';

export class PropertyRepository extends DefaultCrudRepository<
  Property,
  typeof Property.prototype.id,
  PropertyRelations
> {

  public readonly requests: HasManyRepositoryFactory<Request, typeof Property.prototype.id>;

  public readonly block: BelongsToAccessor<Block, typeof Property.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('RequestRepository') protected requestRepositoryGetter: Getter<RequestRepository>, @repository.getter('BlockRepository') protected blockRepositoryGetter: Getter<BlockRepository>,
  ) {
    super(Property, dataSource);
    this.block = this.createBelongsToAccessorFor('block', blockRepositoryGetter,);
    this.registerInclusionResolver('block', this.block.inclusionResolver);
    this.requests = this.createHasManyRepositoryFactoryFor('requests', requestRepositoryGetter,);
    this.registerInclusionResolver('requests', this.requests.inclusionResolver);
  }
}
