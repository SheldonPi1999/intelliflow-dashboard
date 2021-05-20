// Initializes the `graphs` service on path `/api/v1/graphs`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Graphs } from './graphs.class';
import createModel from '../../models/graphs.model';
import hooks from './graphs.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'api/v1/graphs': Graphs & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/graphs', new Graphs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/graphs');

  service.hooks(hooks);
}
