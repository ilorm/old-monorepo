# ilorm-plugin-softDelete
## Soft delete
When soft delete is enable. All remove / removeOne order are converted in update a flag "isDeleted" to true.
After, all the query targeting the database have a default query ; isDeleted = false.

## Use the plugin
The plugin add `forceRemove` and `forceRemoveOne` to handle the hard delete.

```javascript
const ilorm = require('ilorm');
const ilormSoftDelete = require('ilorm-soft-delete');

ilorm.use(ilormSoftDelete());

// Now model have ;
User.query()
    .removeOne(); // Soft delete (update the flag)

User.query()
    .forceRemoveOne(); // Hard delete (real delete).
```