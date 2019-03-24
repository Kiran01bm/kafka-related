# npm install kafkajs

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka1:9092', 'kafka2:9092']
})

// Producing
const producer = kafka.producer()

await producer.connect()
await producer.send({
  topic: 'test-topic',
  messages: [
    { value: 'Hello KafkaJS user!' },
  ],
})

// Consuming
const consumer = kafka.consumer({ groupId: 'test-group' })

await consumer.connect()
await consumer.subscribe({ topic: 'test-topic' })

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log({
      value: message.value.toString(),
    })
  },
})
