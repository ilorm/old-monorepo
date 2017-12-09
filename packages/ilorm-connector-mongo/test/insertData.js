/**
 * Created by guil_ on 07/12/2017.
 */

const ilorm = require('ilorm');
const ilormMongo = require('./lib');
const { Schema, declareModel, ModelFactory, } = ilorm;

ilorm.use(ilormMongo);

const userSchema = new Schema({
  firstName: Schema.string().required(),
  lastName: Schema.string().required(),
});

class User extends ModelFactory('user', userSchema, ilormMongo) {}

declareModel('user', User);


const guillaume = new User();
guillaume.firstName = 'guillaume';
guillaume.lastName = 'daix';
guillaume.save();

const benjamin = new User({
  firstName: 'benjamin',
  lastName: 'daix',
});
benjamin.save();

