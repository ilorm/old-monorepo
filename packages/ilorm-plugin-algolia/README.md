# ilorm-plugin-algolia
This plugin adds binding between your data and algolia.

## Schema
With this plugin enabled you can define which fields will be stored in your database
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
const algoliasearch = require('algoliasearch');
const { newModel } = require('ilorm');

const client = algoliasearch(CLIENT_ID, CLIENT_SECRET);

const UserModel = newModel({
  name: 'users',
  schema: userSchema,
  pluginsOptions: {
    algolia: {
      index: client.index('users'),
    },
  },
  connector: // ...
})
```

## Search
With algolia enabled on your model, you will have a new search method on the query
```javascript
const User = require('./user.model');

const user = await User.query()
    .search('smith')
    .findOne();
```

