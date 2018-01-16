# ilorm-plugin-depreciation
## Depreciation
Sometimes you schema evolve, and you want to soft change your data from the old schema
to the new one.

## Fonctionnalities
### Call event handler when you try to write or read an depreciated field
```javascript
const schema = schema.new({
  firstName: schema.String().required(),
  first_name: schema.String().depreciated({
    onRead: () => throw new Error('Use depreciated field'),
    onWrite: () => throw new Error('Use depreciated field'),
  }),
});
```
### Migrate old field to the new one :
```javascript
const schema = schema.new({
  firstName: schema.String().required(),
  first_name: schema.String().depreciated({
    newField: 'firstName'
  }),
});


// After ;
user.first_name = 'guillaume';

// user.firstName will have guillaume as value
```
### Declare old field based on the new one :
```javascript
const schema = schema.new({
  firstName: schema.String().required(),
  first_name: schema.String().depreciated({
    newField: 'firstName'
  }),
});

// After ;
user.firstName = 'guillaume';

// user.first_name will have guillaume as value
```

### Change how to store the data
```javascript
const schema = schema.new({
  firstName: schema.String().required(),
  lastName: schema.String().required(),
  name: schema.String().depreciated({
    onWrite: (instance, value) => {
      const [firstName, lastName] = value.split(' ');
      
      instance.firstName = firstName;
      instance.lastName = lastName;
    },
  }),
});

// After :
user.name = 'Guillaume Daix';

// user.firstName = 'Guillaume' && user.lastName = 'Daix'
```

## API
Add in every schema field a `depreciated` command with these parameters.
- {String} newField : bind the the old field with the new one.
- {Function(instance, oldFieldValue)} onWrite: The function will be called everytime the field is write.
- {Function(instance, oldFieldValue)} onRead: The function will be called everytime the field is read.

