import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import { MSGRAPH_AGENT_SERVCIE_CONFIG, REDIS_SERVICE_CONFIG } from './services';

export { ApplicationConfig };

export class AuthServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.configApp();
  }

  configApp() {
    this.configRedis();
    this.configMsGraph();
  }

  configMsGraph() {
    const {
      MSGRAPH_SCOPE,
      MSGRAPH_CLIENT_ID,
      MSGRAPH_TENANT_ID,
      MSGRAPH_REDIRECT_URI,
      MSGRAPH_CLIENT_SECRET,
    } = process.env;
    this.bind(MSGRAPH_AGENT_SERVCIE_CONFIG).to({
      clientId: MSGRAPH_CLIENT_ID,
      clientSecret: MSGRAPH_CLIENT_SECRET,
      redirectUri: MSGRAPH_REDIRECT_URI,
      scope: MSGRAPH_SCOPE,
      tenantId: MSGRAPH_TENANT_ID,
    });
  }

  configRedis() {
    const { REDIS_DB, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } = process.env;
    this.bind(REDIS_SERVICE_CONFIG).to({
      database: REDIS_DB,
      password: REDIS_PASSWORD,
      socket: { host: REDIS_HOST, port: REDIS_PORT },
    });
  }
}
