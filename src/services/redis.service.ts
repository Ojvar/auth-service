import {
  BindingKey,
  BindingScope,
  inject,
  injectable,
  lifeCycleObserver,
  LifeCycleObserver,
} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {
  RedisClientType as BaseRedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from '@redis/client';
import debugFactory from 'debug';
import {createClient, RedisClientOptions} from 'redis';

const trace = debugFactory('auth::redis-service');

export const REDIS_SERVICE = BindingKey.create<RedisService>(
  'services.RedisService',
);
export const REDIS_SERVICE_CONFIG = BindingKey.create<RedisClientOptions>(
  'services.config.RedisService',
);

type RedisClientType = BaseRedisClientType<
  RedisModules,
  RedisFunctions,
  RedisScripts
>;

@lifeCycleObserver('services')
@injectable({scope: BindingScope.APPLICATION})
export class RedisService implements LifeCycleObserver {
  private _redis: null | RedisClientType;

  constructor(
    @inject(REDIS_SERVICE_CONFIG) private configs: RedisClientOptions,
  ) {
    trace(this.configs);
  }

  get client(): RedisClientType {
    if (!this._redis) {
      throw new HttpErrors.InternalServerError('UnInitialized Redis Client');
    }
    return this._redis;
  }

  async start() {
    await this.connect();
  }

  async connect() {
    trace('Connecting to the server...');
    this._redis = createClient(this.configs);
    await this._redis.connect();
    trace('Successfully connected to the server');
  }

  async disconnect() {
    trace('Disconnecting from the server...');
    await this._redis?.disconnect();
    trace('Successfully disconnected from the server');
  }
}
