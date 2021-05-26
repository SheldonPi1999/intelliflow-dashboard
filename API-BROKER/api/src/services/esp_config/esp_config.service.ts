import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Esp_config } from './esp_config.class';
import createModel from '../../models/esp_config.model';
import hooks from './esp_config.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'api/v1/esp_config': Esp_config & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/esp_config', new Esp_config(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/esp_config');

  service.hooks(hooks);
}
