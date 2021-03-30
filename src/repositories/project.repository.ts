import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Project, ProjectRelations, Block, City} from '../models';
import {BlockRepository} from './block.repository';
import {CityRepository} from './city.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {

  public readonly blocks: HasManyRepositoryFactory<Block, typeof Project.prototype.id>;

  public readonly city: BelongsToAccessor<City, typeof Project.prototype.id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('BlockRepository') protected blockRepositoryGetter: Getter<BlockRepository>, @repository.getter('CityRepository') protected cityRepositoryGetter: Getter<CityRepository>,
  ) {
    super(Project, dataSource);
    this.city = this.createBelongsToAccessorFor('city', cityRepositoryGetter,);
    this.registerInclusionResolver('city', this.city.inclusionResolver);
    this.blocks = this.createHasManyRepositoryFactoryFor('blocks', blockRepositoryGetter,);
    this.registerInclusionResolver('blocks', this.blocks.inclusionResolver);
  }
}
