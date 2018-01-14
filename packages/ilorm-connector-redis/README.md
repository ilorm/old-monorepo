# Ilorm-connector-mongodb
The ilorm connector to Redis.

## Schema redis
### zschema

zschema is a tool to work with sorted map with redis.
```
const connectorRedis = require('ilorm-connector-redis');

const zschema = connectorRedis.zschema;

const schema = zschema.new({
  user: zschema.Key(),
  points: zschema.Number.sort(),
  group: zschema.String(),
  gender: zschema.String(),
});
```
