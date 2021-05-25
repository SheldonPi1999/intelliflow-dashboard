import '@feathersjs/transport-commons';
import { HookContext } from '@feathersjs/feathers';
import { Application } from './declarations';

export default function(app: Application): void {
  if(typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return;
  }

  app.on('connection', (connection: any): void => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection);
  });

  app.on('login', (authResult: any, { connection }: any): void => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if(connection) {      
      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection);

      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.publish((data: any, hook: HookContext) => {
    // Here you can add event publishers to channels set up in `channels.ts`
    // To publish only for a specific event use `app.publish(eventname, () => {})`

    console.log('Publishing all events to all authenticated users. See `channels.ts` and https://docs.feathersjs.com/api/channels.html for more information.'); // eslint-disable-line

    // e.g. to publish all service events to all authenticated users use
    return app.channel('authenticated');
  });
}
