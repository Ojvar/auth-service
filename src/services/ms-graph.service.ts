/* eslint-disable @typescript-eslint/naming-convention */
import { BindingKey, inject, Provider } from '@loopback/core';
import { model, property } from '@loopback/repository';
import { getService } from '@loopback/service-proxy';
import { MsGraphDataSource } from '../datasources';
import { MSGRAPH_DATASOURCE } from '../datasources/ms-graph.datasource';

export const MSGRAPH_SERVICE = BindingKey.create<MsGraph>('services.MsGraph');
export const MSGRAPH_SERVICE_CONFIG = BindingKey.create<object>(
  'services.config.MsGraph',
);

@model()
export class AquireTokenResult {
  @property({ type: 'string' }) token_type: string;
  @property({ type: 'string' }) scope: string;
  @property({ type: 'number' }) expires_in: number;
  @property({ type: 'number' }) ext_expires_in: number;
  @property({ type: 'string' }) access_token: string;
  @property({ type: 'string' }) refresh_token: string;
}

export interface MsGraph {
  aquireToken(
    tenantId: string,
    clientId: string,
    redirectUri: string,
    clientSecret: string,
    scope: string,
    code: string,
    codeVerifier: string,
  ): Promise<AquireTokenResult>;
  userEvents(accessToken: string, filter: string): Promise<unknown>;
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
