import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {mongodb} from '../config/index.config';

const config = {
  name: 'MongoDB',
  connector: 'mongodb',
  url: mongodb.uri,
  host: mongodb.host,
  port: mongodb.port,
  user: mongodb.user,
  password: mongodb.password,
  database: mongodb.db_name,
  useNewUrlParser: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongoDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'MongoDB';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.MongoDB', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
