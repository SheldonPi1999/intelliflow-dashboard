import { Application } from '../declarations';
import users from './users/users.service';
import hubs from './hubs/hubs.service';
import graphs from './graphs/graphs.service';
import data from './data/data.service';
import simulation from './simulation/simulation.service';
import esp_config from './esp_config/esp_config.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function(app: Application): void {
  app.configure(users);
  app.configure(hubs);
  app.configure(graphs);
  app.configure(data);
  app.configure(simulation);
  app.configure(esp_config);
}
