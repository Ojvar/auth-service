import { BindingKey, inject, Provider } from '@loopback/core';
import { getService } from '@loopback/service-proxy';
import { MsGraphDataSource } from '../datasources';
import { MSGRAPH_DATASOURCE } from '../datasources/ms-graph.datasource';

export const MSGRAPH_SERVICE = BindingKey.create<MsGraph>('service.MsGraph');
export const MSGRAPH_SERVICE_CONFIG = BindingKey.create<object>(
  'service.config.MsGraph',
);

export interface MsGraph {
  // TODO: ADD METHODS
}

export class MsGraphProvider implements Provider<MsGraph> {
  constructor(
    @inject(MSGRAPH_DATASOURCE)
    protected dataSource: MsGraphDataSource = new MsGraphDataSource(),
  ) { }

  value(): Promise<MsGraph> {
    return getService(this.dataSource);
  }
}
