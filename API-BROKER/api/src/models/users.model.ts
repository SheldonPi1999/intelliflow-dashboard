// users-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'users';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const schema = new mongooseClient.Schema({

    /* Required */
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
    admin: { type: Boolean, required: true, default: false },

    /* Not required */
    gender: { type: String, required: false, default: '' },
    birthDate: { type: String, required: false, default: '' },
    phoneNumber: { type: String, required: false, default: '' },
    languages: { type: Array, required: false, default: [] },
    address: { type: String, required: false, default: '' },
    imageUrl: { type: String, required: false, default: 'http://localhost:3030/images/user.png' },

  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<any>(modelName, schema);
}
