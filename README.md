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
  birthday: schema.Date(),
  weight: schema.Number().min(5).max(500)
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

userModel.query()
  .firstName.is('Smith')
  .findOne()
  .then(user => {
    user.weight = 30;
    return user.save();
  });
```

### ilorm.model ###
* query() : Create a new ilorm query

## Query ##
### Fields ###
* fields(name or arrayOfName) : Run next filter or update on one or multiple fields
* name : Shortcut for fields(name)

### Filters ###
* [field].is(value) : The query have an : field === value
* [field].isNot(value) : The query have an : field !== value
* [field].between(min, max) : The query have an : field >= min && field <= max
* [field].min(value) : The query have an field >= min
* [field].max(value) : The query have an field <= max
* ([field]).associatedWith(value) : The model is associated with the value (another model or an id...)
* ([field]).notAssociatedWith(value) : The model is not associated with the value (another model or an id ...)

### Update ###
Used for update or updateOne query only :
* [field].set(value) : field = value
* [field].inc(value) : field += value

### Operations ###
* find() : Run the query and return a promise with the result (array of instance)
* findOne() : Run the query and return a promise the result (instance)
* count() : Count the number of instance and return it
* remove() : Remove the instance which match the query
* removeOne() : Remove only one instance which math the query
* update() : Used to update many instance
* updateOne() : Used to update one instance
* multiple( operations ) : Used to run multiple operation on the same query.
* stream() : Run the query with a stream context could be the best solution for big query


#### Query.update ####

```javascript
userModel.query()
  .firstName.is('Smith')
  .weight.set(30)
  .update();

```

#### Query.multiple ####

```javascript
userModel.query()
  .multiple({
    count: 'total',
    find: 'list'
  })
  .then({ total, list } => {
    ...
  });
```

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

```javascript```
