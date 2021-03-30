import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Block, BlockRelations, Project, Property} from '../models';
import {ProjectRepository} from './project.repository';
import {PropertyRepository} from './property.repository';

export class BlockRepository extends DefaultCrudRepository<
  Block,
  typeof Block.prototype.id,
  BlockRelations
> {

  public readonly project: BelongsToAccessor<Project, typeof Block.prototype.id>;

  public readonly properties: HasManyRepositoryFactory<Property, typeof Block.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>, @repository.getter('PropertyRepository') protected propertyRepositoryGetter: Getter<PropertyRepository>,
  ) {
    super(Block, dataSource);
    this.properties = this.createHasManyRepositoryFactoryFor('properties', propertyRepositoryGetter,);
    this.registerInclusionResolver('properties', this.properties.inclusionResolver);
    this.project = this.createBelongsToAccessorFor('project', projectRepositoryGetter,);
    this.registerInclusionResolver('project', this.project.inclusionResolver);
  }
}
