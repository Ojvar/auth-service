import { inject } from '@loopback/core';
import {
  get,
  param,
  post,
  requestBody,
  Response,
  RestBindings,
  RestServer,
} from '@loopback/rest';
import { AuthRedirectDTO } from '../dto';
import { MsalService, MSAL_SERVICE } from '../services';

export class AuthController {
  constructor(@inject(MSAL_SERVICE) private msalService: MsalService) { }

  @get('/auth/signin', {
    tags: ['auth'],
    description: 'Sign in by MS Account',
    summary: 'Sign in by MS Account',
    responses: {
      200: {
        description: 'Redirect URI',
        content: {
          'text/plain': { schemal: { type: 'string' } },
        },
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
    return this.msalService.signIn(redirectUri);
  }

  @post('/auth/redirect', {
    tags: ['auth'],
    description: 'Handle auth-callback of sign-in request',
    summary: 'Handle auth-callback of sign-in request',
    responses: { 204: { description: "Redirect to user's callback route " } },
  })
  async redirect(
    @inject(RestBindings.Http.RESPONSE) res: Response,
    @requestBody({
      content: {
        'application/x-www-form-urlencoded': { schema: { type: 'object' } },
      },
    })
    body: AuthRedirectDTO,
  ): Promise<void> {
    const result = await this.msalService.acquireToken(body);

    /// TODO: DO WHATEVER NEEDS TO DO AFTER USER AUTHENTICATION

    // Redirect to client callback (with POST method)
    return res.redirect(307, result.clientRedirectUri);
  }
}
