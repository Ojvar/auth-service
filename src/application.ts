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
import { MSAL_SERVICE_CONFIG, REDIS_SERVICE_CONFIG } from './services';
import { LogLevel } from '@azure/msal-node';

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
    this.configMSAL();
  }

  configMSAL() {
    const {
      AZURE_CLIENT_ID,
      AZURE_TENANT_ID,
      AZURE_CLIENT_SECRET,
      AZURE_CLOUD_INSTANCE,
      AZURE_REDIRECT_URI,
    } = process.env;
    this.bind(MSAL_SERVICE_CONFIG).to({
      redirectURI: AZURE_REDIRECT_URI,
      auth: {
        clientId: AZURE_CLIENT_ID,
        authority: `${AZURE_CLOUD_INSTANCE}${AZURE_TENANT_ID}`,
        clientSecret: AZURE_CLIENT_SECRET,
      },
      system: {
        loggerOptions: {
          loggerCallback(
            _loglevel: LogLevel,
            message: string,
            _containsPii: boolean,
          ) {
            console.log(message);
          },
          piiLoggingEnabled: false,
          logLevel: LogLevel.Info,
        },
      },
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
