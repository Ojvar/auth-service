/* eslint-disable @typescript-eslint/naming-convention */
import {
  BindingKey,
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
} from '@loopback/core';
import { DataSource, juggler } from '@loopback/repository';

export const MSGRAPH_DATASOURCE = BindingKey.create<DataSource>(
  'datasources.MsGraph',
);
export const MSGRAPH_DATASOURCE_CONFIG = BindingKey.create<object>(
  'datasources.config.MsGraph',
);

const config = {
  name: 'MsGraph',
  connector: 'rest',
  baseURL: 'https://login.microsoftonline.com/',
  crud: false,
  operations: [
    // {
    //   template: {
    //     method: 'GET',
    //     url: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    //     query: {
    //       scope: '{scope}',
    //       response_type: 'code',
    //       response_mode: 'query',
    //       state: '{state}',
    //       redirect_uri: '{redirectUri}',
    //       client_id: '{clientId}',
    //     },
    //   },
    //   functions: { auth: ['clientId', 'redirctUri', 'state', 'scope'] },
    // },
    {
      template: {
        method: 'POST',
        url: 'https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {
          client_id: '{clientId}',
          scope: '{scope}',
          redirect_uri: '{redirectUri}',
          code: '{code}',
          grant_type: 'authorization_code',
          client_secret: '{clientSecret}',
          code_verifier: '{codeVerifier}',
        },
      },
      functions: {
        aquireToken: [
          'tenantId',
          'clientId',
          'redirectUri',
          'clientSecret',
          'scope',
          'code',
          'codeVerifier',
        ],
      },
    },
    {
      template: {
        method: 'GET',
        url: 'https://graph.microsoft.com/v1.0/me/events',
        headers: { authorization: 'Bearer {accessToken}' },
        query: { filter: '{filter}' },
      },
      functions: { userEvents: ['accessToken', 'filter'] },
    },
  ],
};

@lifeCycleObserver('datasource')
export class MsGraphDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'MsGraph';
  static readonly defaultConfig = config;

  constructor(
    @inject(MSGRAPH_DATASOURCE_CONFIG, { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
