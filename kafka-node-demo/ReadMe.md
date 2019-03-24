# Kafka NodeJS - Producer and Consumer Example

**Note:** This work is based on this [demo](https://github.com/anthonyhastings/kafka-nodejs-example), I've removed the PG elements from it and moved the base image tagging to pick up the latest.

## Components
1. Producer with http end point
2. Consumer

## Stack boot-up
```
docker-compose up -d
```

## Stack stop
```
docker-compose down
```

## Copy of Logs

### Requests made ex: 3 calls

```
~/Documents/GIT/kafka-related/kafka-node-demo on  master! ⌚ 14:45:27
$ curl -X POST \
  http://localhost:8080/sales \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/x-www-form-urlencoded' \
  -d total=6.40
{"sales-topic":{"0":0}}%

~/Documents/GIT/kafka-related/kafka-node-demo on  master! ⌚ 14:46:10
$ curl -X POST \
  http://localhost:8080/sales \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/x-www-form-urlencoded' \
  -d total=7.40
{"sales-topic":{"0":1}}%

~/Documents/GIT/kafka-related/kafka-node-demo on  master! ⌚ 14:46:18
$ curl -X POST \
  http://localhost:8080/sales \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/x-www-form-urlencoded' \
  -d total=8.40
{"sales-topic":{"0":2}}%

~/Documents/GIT/kafka-related/kafka-node-demo on  master! ⌚ 14:46:24
```

### Producer Logs
```
$ docker logs -f kafka-node-producer
2019/03/24 03:45:13 Waiting for: tcp://zookeeper:2181
2019/03/24 03:45:13 Waiting for: tcp://kafka:9092
2019/03/24 03:45:13 Connected to tcp://zookeeper:2181
2019/03/24 03:45:13 Problem with dial: dial tcp 172.30.0.3:9092: connect: connection refused. Sleeping 1s
2019/03/24 03:45:14 Problem with dial: dial tcp 172.30.0.3:9092: connect: connection refused. Sleeping 1s
2019/03/24 03:45:15 Connected to tcp://kafka:9092

> kafka-nodejs-example-producer@1.0.0 start /src
> node producer.js

Sent payload to Kafka: [ { topic: 'sales-topic',
    messages: <Buffer a0 8d f2 dc b5 5a 9a 99 99 99 99 99 19 40>,
    attributes: 1,
    partition: 0 } ]
Sending payload result: { 'sales-topic': { '0': 0 } }
Sent payload to Kafka: [ { topic: 'sales-topic',
    messages: <Buffer f4 8f f3 dc b5 5a 9a 99 99 99 99 99 1d 40>,
    attributes: 1,
    partition: 0 } ]
Sending payload result: { 'sales-topic': { '0': 1 } }
Sent payload to Kafka: [ { topic: 'sales-topic',
    messages: <Buffer 94 f3 f3 dc b5 5a cd cc cc cc cc cc 20 40>,
    attributes: 1,
    partition: 0 } ]
Sending payload result: { 'sales-topic': { '0': 2 } }
```

### Consumer Logs
```
$ docker logs -f kafka-node-consumer
2019/03/24 03:45:13 Waiting for: tcp://zookeeper:2181
2019/03/24 03:45:13 Waiting for: tcp://kafka:9092
2019/03/24 03:45:13 Problem with dial: dial tcp 172.30.0.3:9092: connect: connection refused. Sleeping 1s
2019/03/24 03:45:13 Connected to tcp://zookeeper:2181
2019/03/24 03:45:14 Problem with dial: dial tcp 172.30.0.3:9092: connect: connection refused. Sleeping 1s
2019/03/24 03:45:15 Connected to tcp://kafka:9092

> kafka-nodejs-example-consumer@1.0.0 start /src
> node consumer.js

Kafka consumer error: { TopicsNotExistError: The topic(s) sales-topic do not exist
    at new TopicsNotExistError (/src/node_modules/kafka-node/lib/errors/TopicsNotExistError.js:11:9)
    at /src/node_modules/kafka-node/lib/client.js:447:43
    at /src/node_modules/async/dist/async.js:473:16
    at iteratorCallback (/src/node_modules/async/dist/async.js:1064:13)
    at /src/node_modules/async/dist/async.js:969:16
    at /src/node_modules/kafka-node/lib/client.js:455:7
    at /src/node_modules/kafka-node/lib/zookeeper.js:354:7
    at /src/node_modules/node-zookeeper-client/index.js:165:26
    at Object.async.whilst (/src/node_modules/node-zookeeper-client/node_modules/async/lib/async.js:627:13)
    at /src/node_modules/node-zookeeper-client/node_modules/async/lib/async.js:623:23
  topics: [ 'sales-topic' ],
  message: 'The topic(s) sales-topic do not exist' }
Message received: { topic: 'sales-topic',
  value: <Buffer a0 8d f2 dc b5 5a 9a 99 99 99 99 99 19 40>,
  offset: 0,
  partition: 0,
  highWaterOffset: 1,
  key: null }
Decoded Message: object SaleType { saleDate: 1553399169872, total: 6.4 }
(node:29) [DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues. Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead.
Message received: { topic: 'sales-topic',
  value: <Buffer f4 8f f3 dc b5 5a 9a 99 99 99 99 99 1d 40>,
  offset: 1,
  partition: 0,
  highWaterOffset: 2,
  key: null }
Decoded Message: object SaleType { saleDate: 1553399178234, total: 7.4 }
Message received: { topic: 'sales-topic',
  value: <Buffer 94 f3 f3 dc b5 5a cd cc cc cc cc cc 20 40>,
  offset: 2,
  partition: 0,
  highWaterOffset: 3,
  key: null }
Decoded Message: object SaleType { saleDate: 1553399184586, total: 8.4 }
```

