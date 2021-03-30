import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Project, ProjectRelations, Block} from '../models';
import {BlockRepository} from './block.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {

  public readonly blocks: HasManyRepositoryFactory<Block, typeof Project.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('BlockRepository') protected blockRepositoryGetter: Getter<BlockRepository>,
  ) {
    super(Project, dataSource);
    this.blocks = this.createHasManyRepositoryFactoryFor('blocks', blockRepositoryGetter,);
    this.registerInclusionResolver('blocks', this.blocks.inclusionResolver);
  }
}
