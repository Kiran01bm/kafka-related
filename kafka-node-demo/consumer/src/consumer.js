const moment = require('moment');
const uuidv4 = require('uuid/v4');
const kafka = require('kafka-node');
const type = require('./type');

(async () => {
  const kafkaClientOptions = { sessionTimeout: 100, spinDelay: 100, retries: 2 };
  const kafkaClient = new kafka.Client(process.env.KAFKA_ZOOKEEPER_CONNECT, 'consumer-client', kafkaClientOptions);
  
  const topics = [
    { topic: 'sales-topic' }
  ];
  
  const options = {
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: 'buffer'
  };
  
  const kafkaConsumer = new kafka.HighLevelConsumer(kafkaClient, topics, options);
  
  kafkaConsumer.on('message', async function(message) {
    console.log('Message received:', message);
    const messageBuffer = new Buffer(message.value, 'binary');

    const decodedMessage = type.fromBuffer(messageBuffer.slice(0));
    console.log('Decoded Message:', typeof decodedMessage, decodedMessage);

    const saleDateISO8601 = moment(decodedMessage.saleDate).toISOString();

  });
  
  kafkaClient.on('error', (error) => console.error('Kafka client error:', error));
  kafkaConsumer.on('error', (error) => console.error('Kafka consumer error:', error));
})();
