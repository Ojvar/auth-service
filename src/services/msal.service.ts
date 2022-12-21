import {
  AuthorizationUrlRequest,
  ConfidentialClientApplication,
  Configuration,
  CryptoProvider,
  ResponseMode,
} from '@azure/msal-node';
import { injectable, BindingScope, BindingKey, inject } from '@loopback/core';
import { RedisService, REDIS_SERVICE } from './redis.service';
import debugFactory from 'debug';
import { HttpErrors } from '@loopback/rest';

const trace = debugFactory('auth::msal-service');

export const MSAL_SERVICE = BindingKey.create<MsalService>(
  'services.MsalService',
);
export const MSAL_SERVICE_CONFIG = BindingKey.create<MsalServiceConfig>(
  'services.config.MsalService',
);

export type MsalServiceConfig = { redirectURI: string } & Configuration;

@injectable({ scope: BindingScope.APPLICATION })
export class MsalService {
  private msalInstance: ConfidentialClientApplication;
  private cryptoProvider: CryptoProvider = new CryptoProvider();

  constructor(
    @inject(REDIS_SERVICE) private redisService: RedisService,
    @inject(MSAL_SERVICE_CONFIG) private configs: MsalServiceConfig,
  ) {
    trace(this.configs);
    this.msalInstance = new ConfidentialClientApplication(this.configs);
  }

  async signIn(clientRedirectUri: string) {
    const csrfToken = this.cryptoProvider.createNewGuid();
    const state = this.cryptoProvider.base64Encode(
      JSON.stringify({ csrfToken, redirectTo: clientRedirectUri }),
    );
    const authCodeUrlRequestParams = { state, scopes: [] };
    const authCodeRequestParams = { scopes: [] };

    // Get Reidrect URL
    const { verifier, challenge } = await this.cryptoProvider.generatePkceCodes();
    const pkceCodes = { challengeMethod: 'S256', verifier, challenge };
    const authCodeUrlRequest: AuthorizationUrlRequest = {
      redirectUri: this.configs.redirectURI,
      responseMode: ResponseMode.FORM_POST,
      codeChallenge: pkceCodes.challenge,
      codeChallengeMethod: pkceCodes.challengeMethod,
      ...authCodeUrlRequestParams,
    };
    const authCodeRequest = {
      redirectUri: this.configs.redirectURI,
      code: '',
      ...authCodeRequestParams,
    };

    try {
      const authCodeUrlResponse = await this.msalInstance.getAuthCodeUrl(
        authCodeUrlRequest,
      );
      await this.saveIntoRedis(state, { authCodeRequest });

      return authCodeUrlResponse;
    } catch (error) {
      console.error(error);
      throw new HttpErrors.InternalServerError('Authentication process failed');
    }
  }

  async acquireToken() {
    // TODO: Acquire Token - STEP 2  , this is that 'redirct' route
  }

  async saveIntoRedis(key: string, data: object) {
    key = `auth_req::${key}`;
    return this.redisService.client.SET(key, JSON.stringify(data));
  }
}
