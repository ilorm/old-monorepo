# ilorm-schema
Ilorm-Schema is the package used by ilorm to define your data.

The Ilorm-schema use two kind of object :
* Schema : Define one of your data.
* FieldType : Define a field of your schema.

A schema is a composition of FieldType.

The FieldType is an abstract class. You need use one of the child or define your own :
* FieldNumber : Represent a Number.
* FieldString : Represent a String.


## Create your own field
A field is a child class of the class FieldType. You can overload the following functions :

### Internal properties
* {Boolean} [default=false] isRequired : Enforce than the property exists at save.
* {*} [default=undefined] defaultValue : Default value for the property.

### default(value)
Define the default value of your field

### required()
Set the boolean isRequired at true.

### initValue()
Init the field with it's defaultValue

### isValid(value)
isValid will check if the given value is valid for the target field.
You can add typeof check, or many more conditions (regex per example).