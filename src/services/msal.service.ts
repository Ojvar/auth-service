// import {
//   AuthorizationUrlRequest,
//   ConfidentialClientApplication,
//   Configuration,
//   CryptoProvider,
//   ResponseMode,
// } from '@azure/msal-node';
// import { injectable, BindingScope, BindingKey, inject } from '@loopback/core';
// import { RedisService, REDIS_SERVICE } from './redis.service';
// import debugFactory from 'debug';
// import { HttpErrors, Model } from '@loopback/rest';
// import { AuthRedirectDTO } from '../dto';
//
// const trace = debugFactory('auth::msal-service');
//
// export const MSAL_SERVICE = BindingKey.create<MsalService>(
//   'services.MsalService',
// );
// export const MSAL_SERVICE_CONFIG = BindingKey.create<MsalServiceConfig>(
//   'services.config.MsalService',
// );
//
// export type PkceCodes = {
//   challengeMethod: 'S256' | string;
//   verifier: string;
//   challenge: string;
// };
// export type RedisValueType = {
//   pkceCodes: PkceCodes;
//   authCodeRequest: AuthCodeRequest;
// };
// export type MsalServiceConfig = { redirectURI: string } & Configuration;
// export type AuthCodeRequest = {
//   redirectUri: string;
//   code: string;
//   scopes: string[];
//   [key: string]: unknown;
// };
//
// export class AcquireToken extends Model {
//   clientRedirectUri: string;
//   authToken: unknown;
//
//   constructor(data?: Partial<AcquireToken>) {
//     super(data);
//   }
// }
//
// @injectable({ scope: BindingScope.APPLICATION })
// export class MsalService {
//   private msalInstance: ConfidentialClientApplication;
//   private cryptoProvider: CryptoProvider = new CryptoProvider();
//
//   constructor(
//     @inject(REDIS_SERVICE) private redisService: RedisService,
//     @inject(MSAL_SERVICE_CONFIG) private configs: MsalServiceConfig,
//   ) {
//     trace(this.configs);
//     this.msalInstance = new ConfidentialClientApplication(this.configs);
//   }
//
//   async signIn(clientRedirectUri: string) {
//     const csrfToken = this.cryptoProvider.createNewGuid();
//     const state = this.cryptoProvider.base64Encode(
//       JSON.stringify({ csrfToken, redirectTo: clientRedirectUri }),
//     );
//     const scopes = ['offline_access', 'Calendars.Read'];
//     const authCodeUrlRequestParams = { state, scopes };
//     const authCodeRequestParams = { scopes };
//
//     // Get Reidrect URL
//     const { verifier, challenge } = await this.cryptoProvider.generatePkceCodes();
//     const pkceCodes = { challengeMethod: 'S256', verifier, challenge };
//     const authCodeUrlRequest: AuthorizationUrlRequest = {
//       redirectUri: this.configs.redirectURI,
//       responseMode: ResponseMode.FORM_POST,
//       codeChallenge: pkceCodes.challenge,
//       codeChallengeMethod: pkceCodes.challengeMethod,
//       ...authCodeUrlRequestParams,
//     };
//     const authCodeRequest: AuthCodeRequest = {
//       redirectUri: this.configs.redirectURI,
//       code: '',
//       ...authCodeRequestParams,
//     };
//
//     try {
//       const authCodeUrlResponse = await this.msalInstance.getAuthCodeUrl(
//         authCodeUrlRequest,
//       );
//       await this.saveIntoRedis(state, { authCodeRequest, pkceCodes });
//
//       return authCodeUrlResponse;
//     } catch (error) {
//       console.error(error);
//       throw new HttpErrors.InternalServerError('Authentication process failed');
//     }
//   }
//
//   async acquireToken(body: AuthRedirectDTO): Promise<AcquireToken> {
//     // TODO: Acquire Token - STEP 2  , this is that 'redirct' route
//     console.log('BODY', body);
//
//     const { state, code } = body;
//     if (!state) {
//       throw new HttpErrors.UnprocessableEntity('state is missing');
//     }
//
//     // Load redis data
//     // NOTE: Checking CSRF was automatically done!
//     //  When we trying to load data from REDIS by STATE code, it actually is a king of csrf checking process
//     const { pkceCodes, authCodeRequest } = await this.loadFromRedis(state);
//     const { redirectTo } = JSON.parse(this.cryptoProvider.base64Decode(state));
//     trace('redirectTo', redirectTo);
//     trace(pkceCodes, authCodeRequest);
//
//     try {
//       authCodeRequest.code = code;
//       authCodeRequest.codeVerifier = pkceCodes.verifier;
//
//       const tokenResponse = await this.msalInstance.acquireTokenByCode(
//         authCodeRequest,
//       );
//       trace('TOKEN RESPONSE', tokenResponse);
//
//       // req.session.accessToken = tokenResponse.accessToken;
//       // req.session.idToken = tokenResponse.idToken;
//       // req.session.account = tokenResponse.account;
//       // req.session.isAuthenticated = true;
//
//       return new AcquireToken({
//         authToken: tokenResponse,
//         clientRedirectUri: redirectTo,
//       });
//     } catch (error) {
//       console.error(error);
//       throw new HttpErrors.UnprocessableEntity('Authenctication failed');
//     }
//   }
//
//   async saveIntoRedis(key: string, data: RedisValueType) {
//     key = `auth_req::${key}`;
//     return this.redisService.client.SET(key, JSON.stringify(data));
//   }
//   async loadFromRedis(key: string): Promise<RedisValueType> {
//     key = `auth_req::${key}`;
//     const rawValue = await this.redisService.client.GET(key);
//     if (!rawValue) {
//       throw new HttpErrors.UnprocessableEntity('Invalid State');
//     }
//     return JSON.parse(rawValue ?? '{}') as RedisValueType;
//   }
// }
