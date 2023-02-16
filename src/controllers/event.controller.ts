import { inject } from '@loopback/core';
import { param, post } from '@loopback/rest';
import { MsGraphAgentService, MSGRAPH_AGENT_SERVCIE } from '../services';

const TAGS = ['events'];

export class EventController {
  constructor(
    @inject(MSGRAPH_AGENT_SERVCIE)
    private msgraphAgentService: MsGraphAgentService,
  ) { }

  @post('/events', {
    tags: TAGS,
    summary: 'Get events between date range',
    description: 'Get events between date range',
    responses: {
      200: {
        description: 'Events list',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                schema: 'object',
              },
            },
          },
        },
      },
    },
  })
  async getEvents(
    @param.header.string('token', { required: true }) token: string,
    @param.query.string('filter', { required: false }) filter: string,
  ): Promise<unknown> {
    return this.msgraphAgentService.getUserEvents(token, filter);
  }
}
