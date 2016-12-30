# ilorm (I Love ORM)
New kind of NodeJS ORM

## Features

## Initialize

## Schema
```javascript
const ilorm = require('ilorm');
const schema = ilorm.schema;

const schema = schema.new({
  firstName: schema.String().required(),
  lastName: schema.String().required(),
  children: schema.Array(schema.reference('User'))
  birthday: Schema.Date(),
  weight: Schema.Number().min(5).max(500)
});

```
### ilorm.schema ###
* new( schema ) : Create a new ilorm schema
* String() : Declare a string field
* Number() : Declare a number field
* Boolean() : Declare a boolean field.
* Object( subSchema ) : Declare a subobject schema
* Array( subSchema ) : Declare an array schema
* Map( subSchema ) : Declare a map

### allSchemaType ###
* required() : The field is required for create an object (per default not required).
* default(value) : Set a precise value for default (if you do not set a value at creation).

### Number() ###

### String() ###

## Models
```javascript
const ilorm = require('ilorm');
const ilormMongo = require('ilorm-mongodb');
const model = require('ilorm').model;

const userSchema = require('./schema');
const userModel = model('User', userModel, ilormMongo({ db }));

userModel.hooks.addBefore({
  find: function findHook(params) {
    //Do something
    return Promise.resolve(params);
  }
});

userModel.find({
  firstName: '...'
}).then(user => {
  user.weight = 30;
  return user.save();
});
```

### ilorm.model ###
* find( query )
* findOne( query )
* insert( item )
* remove( query )
* update( query, update )

## Instances
Instances are returned after a loading (find, or stream). It's a specific item loaded from the database. You can create a new instance from the model :
```javascript
const instance = new userModel();
instance.firstName = 'Thibauld';
instance.lastName = 'Smith';
instance.save();
```
* save() : Save the instance in the database (auto insert or update).
* remove() : Delete the instance from the database.

## Streams
```javascript
userModel.find({}).stream()
  .associatedWith(userModel.find({firstName: 'Chris'}))
  .map(user => {
    user.weight++;
    return user.save();
  })
```


```javascript```
