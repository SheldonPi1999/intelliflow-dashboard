import { makeAuthPlugin } from '../feathers-client';

export default makeAuthPlugin({ userService: 'Users' });
