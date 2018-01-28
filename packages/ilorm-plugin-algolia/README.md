# ilorm-plugin-algolia
This plugin add binding between your data an algolia.

## Schema
With the plugin enable you can define which field will be stored in your database
and in algolia.

```javascript
const { Schema } = require('ilorm');

const userSchema = new Schema({
  email: Schema.string().required().algolia(),
  firstName: Schema.string().required().algolia()
})
```

## Declare model index
```javascript
const { newModel } = require('ilorm');

const UserModel = newModel({
  name: 'users',
  schema: userSchema,
  pluginsOptions: {
    algolia: {
      index: 'users',
    },
  },
  connector: // ...
})
```

## Search
With algolia enable on your model, you have a new search method on the query
```javascript
const User = require('./user.model');

const user = await User.query()
    .search('smith')
    .findOne();
```

