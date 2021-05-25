// Initializes the `simulation` service on path `/api/v1/simulation`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Simulation } from './simulation.class';
import createModel from '../../models/simulation.model';
import hooks from './simulation.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'api/v1/simulation': Simulation & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true,
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/simulation', new Simulation(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/simulation');

  service.hooks(hooks);
}
