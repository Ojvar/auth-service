import { inject } from '@loopback/core';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import { stringify } from 'querystring';
import { AuthRedirectRequestDTO } from '../dto';
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
        'application/x-www-form-urlencoded': {
          schema: getModelSchemaRef(AuthRedirectRequestDTO),
        },
      },
    })
    body: AuthRedirectRequestDTO,
  ): Promise<void> {
    const { redirectUri, ...result } = await this.msgraphAgentService.aquireToken(
      body,
    );
    res.redirect(
      `${redirectUri}?${stringify({
        ...result,
        token: JSON.stringify(result.token),
      })}`,
    );
  }
}
