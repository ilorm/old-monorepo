# Ilorm-connector-mongodb
The ilorm connector to MongoDB.


## MongoQuery
An ilorm model binded with the ilorm connector mongoDB.
Could use a powerful extension of the Ilorm Query : IlormMongoQuery

### Aggregate
```
const query = UserModel.query();

query
    .firstName.is('Sam')
    .match() // Declare a match aggregator stage
    .gender.isKey()
    .age.avg('avgAge')
    .count('totalUser')
    .group()
    .run()
    
This code will be converted to the aggregate query :
[
    {
        $match: {
            firstName: 'Sam'
        }
    },
    {
        $group: {
            _id: '$gender',
            avgAge: { $avg: '$age' },
            totalUser: { $sum: 1 }
        }
    }
]




]
    

```