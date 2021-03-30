import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Block, BlockRelations, Project} from '../models';
import {ProjectRepository} from './project.repository';

export class BlockRepository extends DefaultCrudRepository<
  Block,
  typeof Block.prototype.id,
  BlockRelations
> {

  public readonly project: BelongsToAccessor<Project, typeof Block.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>,
  ) {
    super(Block, dataSource);
    this.project = this.createBelongsToAccessorFor('project', projectRepositoryGetter,);
    this.registerInclusionResolver('project', this.project.inclusionResolver);
  }
}
