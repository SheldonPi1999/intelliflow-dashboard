// Initializes the `hubs` service on path `/api/v1/hubs`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Hubs } from './hubs.class';
import createModel from '../../models/hubs.model';
import hooks from './hubs.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'api/v1/hubs': Hubs & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true,
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/hubs', new Hubs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/hubs');

  service.hooks(hooks);
}
