// Initializes the `data` service on path `/api/v1/data`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Data } from './data.class';
import createModel from '../../models/data.model';
import hooks from './data.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'api/v1/data': Data & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/data', new Data(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/data');

  service.hooks(hooks);
}
