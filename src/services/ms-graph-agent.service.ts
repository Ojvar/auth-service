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
import { MSGRAPH_SERVICE, MsGraph, AquireTokenResult } from '../services';
import { AuthRedirectRequestDTO } from '../dto';
import { RedisService, REDIS_SERVICE } from './redis.service';
import { Model, model, property } from '@loopback/repository';
import pkceChallenge from 'pkce-challenge';

export const PKCE_LEN = 128;
export const CODE_CHALLENGE_METHOD = 'S256';

export const MSGRAPH_AGENT_SERVCIE = BindingKey.create<MsGraphAgentService>(
  'services.MsGraphAgentService',
);
export const MSGRAPH_AGENT_SERVCIE_CONFIG =
  BindingKey.create<MsGraphAgentServiceConfig>(
    'services.config.MsGraphAgentService',
  );
export type MsGraphAgentServiceConfig = {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  scope: string;
  redirectUri: string;
};

export const REDIS_EXPIRE_TIME = 300; // 5 Minutes
export type RedisValueDataType = {
  clientCallbackUri: string;
  scope: string;
  code_challenge: string;
  code_verifier: string;
};
export type StateValue = {
  csrfToken: string;
  data: RedisValueDataType;
};

@model()
export class AquireTokenResultDTO extends Model {
  @property({ type: 'boolean', required: true }) success: boolean;
  @property({ type: 'string', required: true }) redirectUri: string;
  @property({ type: 'string', required: false }) error?: string;
  @property({ required: false }) token?: AquireTokenResult;

  constructor(data?: Partial<AquireTokenResultDTO>) {
    super(data);
  }
}

@injectable({ scope: BindingScope.APPLICATION })
export class MsGraphAgentService {
  constructor(
    @inject(REDIS_SERVICE) private redisService: RedisService,
    @inject(MSGRAPH_SERVICE) private msgraph: MsGraph,
    @inject(MSGRAPH_AGENT_SERVCIE_CONFIG)
    private configs: MsGraphAgentServiceConfig,
  ) { }

  async auth(clientCallbackUri: string): Promise<string> {
    const { code_verifier, code_challenge } = pkceChallenge(PKCE_LEN);
    const { scope, redirectUri, clientId, tenantId } = this.configs;
    const { csrfToken, data } = this.generateState({
      clientCallbackUri,
      scope,
      code_challenge,
      code_verifier,
    });
    await this.saveIntoRedis(csrfToken, data);
    return (
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?` +
      qs.stringify({
        scope,
        state: csrfToken,
        response_type: 'code',
        response_mode: 'form_post',
        redirect_uri: redirectUri,
        client_id: clientId,
        code_challenge,
        code_challenge_method: CODE_CHALLENGE_METHOD,
      })
    );
  }

  async aquireToken(
    callbackData: AuthRedirectRequestDTO,
  ): Promise<AquireTokenResultDTO> {
    const userData = await this.loadFromRedis(callbackData.state);
    if (callbackData.error || !callbackData.code) {
      return new AquireTokenResultDTO({
        success: false,
        error: callbackData.error,
        redirectUri: userData.clientCallbackUri,
      });
    }

    // Aquire token
    const { scope, redirectUri, clientId, tenantId, clientSecret } = this.configs;
    const token = await this.msgraph.aquireToken(
      tenantId,
      clientId,
      redirectUri,
      clientSecret,
      scope,
      callbackData.code!,
      userData.code_verifier,
    );
    return new AquireTokenResultDTO({
      success: true,
      redirectUri: userData.clientCallbackUri,
      token,
    });
  }

  async getUserEvents(token: string, filter: string): Promise<unknown> {
    return this.msgraph.userEvents(token, filter);
  }

  private async saveIntoRedis(key: string, data: RedisValueDataType) {
    key = `auth_req_${key}`;
    return this.redisService.client.SET(key, JSON.stringify(data), {
      EX: REDIS_EXPIRE_TIME,
    });
  }
  private async loadFromRedis(key: string): Promise<RedisValueDataType> {
    key = `auth_req_${key}`;
    const rawValue = await this.redisService.client.GET(key);
    if (!rawValue) {
      throw new HttpErrors.UnprocessableEntity('Invalid State');
    }
    return JSON.parse(rawValue ?? '{}') as RedisValueDataType;
  }
  private generateState(data: RedisValueDataType): StateValue {
    const csrfToken = generateUniqueId().toString();
    return { csrfToken, data };
  }
}
