import { inject } from '@loopback/core';
import { get, param } from '@loopback/rest';
import { MsGraphAgentService, MSGRAPH_AGENT_SERVCIE } from '../services';

export class AuthController {
  constructor(
    @inject(MSGRAPH_AGENT_SERVCIE)
    private msgraphAgentService: MsGraphAgentService,
  ) { }

  @get('/auth/signin', {
    tags: ['auth'],
    description: 'Sign in by MS Account',
    summary: 'Sign in by MS Account',
    responses: {
      200: {
        description: 'Redirect URI',
        content: { 'text/plain': { schemal: { type: 'string' } } },
      },
    },
  })
  async signIn(
    @param.query.string('redirect_uri', {
      required: true,
      description: 'ClientSide callback address',
    })
    redirectUri: string,
  ): Promise<string> {
    return this.msgraphAgentService.auth(redirectUri);
  }

  // @post('/auth/redirect', {
  //   tags: ['auth'],
  //   description: 'Handle auth-callback of sign-in request',
  //   summary: 'Handle auth-callback of sign-in request',
  //   responses: { 204: { description: "Redirect to user's callback route " } },
  // })
  // async redirect(
  //   @inject(RestBindings.Http.RESPONSE) res: Response,
  //   @requestBody({
  //     content: {
  //       'application/x-www-form-urlencoded': { schema: { type: 'object' } },
  //     },
  //   })
  //   body: AuthRedirectDTO,
  // ): Promise<void> {
  //   const result = await this.msalService.acquireToken(body);
  //
  //   /// TODO: DO WHATEVER NEEDS TO DO AFTER USER AUTHENTICATION
  //
  //   // Redirect to client callback (with POST method)
  //   const url = result.clientRedirectUri + '?' + qs.stringify(result.authToken);
  //   return res.redirect(url);
  //
  //   // return res.redirect(307, result.clientRedirectUri);
  // }
}
