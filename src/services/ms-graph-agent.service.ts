/* eslint-disable @typescript-eslint/naming-convention */
import {
  injectable,
  inject,
  BindingScope,
  BindingKey,
  generateUniqueId,
} from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import qs from 'querystring';
import { RedisService, REDIS_SERVICE } from './redis.service';

export const MSGRAPH_AGENT_SERVCIE = BindingKey.create<MsGraphAgentService>(
  'services.MsGraphAgentService',
);
export const MSGRAPH_AGENT_SERVCIE_CONFIG =
  BindingKey.create<MsGraphAgentServiceConfig>(
    'services.config.MsGraphAgentService',
  );

export const REDIS_EXPIRE_TIME = 300; // 5 Minutes
export type CsrfResult = {
  csrfToken: string;
  encoded: string;
};
export type RedisValueType = Object;
export type MsGraphAgentServiceConfig = {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  scope: string;
  redirectUri: string;
};

@injectable({ scope: BindingScope.APPLICATION })
export class MsGraphAgentService {
  constructor(
    @inject(REDIS_SERVICE) private redisService: RedisService,
    @inject(MSGRAPH_AGENT_SERVCIE_CONFIG)
    private configs: MsGraphAgentServiceConfig,
  ) { }

  async auth(clientRedirectUri: string): Promise<string> {
    const { csrfToken, encoded } = this.generateCSRF({ clientRedirectUri });
    const { scope, redirectUri, clientId, tenantId } = this.configs;
    await this.saveIntoRedis(csrfToken, encoded);
    return (
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?` +
      qs.stringify({
        scope,
        state: encoded,
        response_type: 'code',
        response_mode: 'query',
        redirect_uri: redirectUri,
        client_id: clientId,
      })
    );
  }

  private async saveIntoRedis(key: string, data: RedisValueType) {
    key = `auth_req::${key}`;
    return this.redisService.client.SET(key, JSON.stringify(data), {
      EX: REDIS_EXPIRE_TIME,
    });
  }
  private async loadFromRedis(key: string): Promise<RedisValueType> {
    key = `auth_req::${key}`;
    const rawValue = await this.redisService.client.GET(key);
    if (!rawValue) {
      throw new HttpErrors.UnprocessableEntity('Invalid State');
    }
    return JSON.parse(rawValue ?? '{}') as RedisValueType;
  }
  private generateCSRF(meta: object = {}): CsrfResult {
    const csrfToken = generateUniqueId().toString();
    return { csrfToken, encoded: this.toBase64({ csrfToken, ...meta }) };
  }
  private toBase64(data: object): string {
    return Buffer.from(JSON.stringify(data)).toString('base64');
  }
}
