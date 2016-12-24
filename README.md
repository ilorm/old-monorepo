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

## Models
```javascript
const ilorm = require('ilorm');
const ilormMongo = require('ilorm-mongodb');
const model = require('ilorm').model;

const userSchema = require('./schema');
const userModel = model('User', userModel, ilormMongo);

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
