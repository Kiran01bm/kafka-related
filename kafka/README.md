# Running Multiple Apache Kafka brokers in Docker (for a Development environment)

## Reference:
[ This work is based on the reference found here: ](https://hub.docker.com/r/wurstmeister/kafka)
[ Additional reference: ](http://wurstmeister.github.io/kafka-docker/)

## Procedure (with Default selections where possible):

### Create Docker Machine (for better management and isolation):
![Alt text](docker-machine-create.png?raw=true "docker-machine create --driver virtualbox kafka-demo")
![Alt text](docker-machine-ip.png?raw=true "docker-machine ip kafka-demo")


### Configure your docker client to talk Docker engine on Docker Machine named kafka-demo
```
eval $(docker-machine env kafka-demo)
```

### [ Clone the kafka-docker repository ](https://github.com/wurstmeister/kafka-docker)

### Update the docker-compose stack for Kafka and Zookeeper Stack:
```yaml
version: '2'
services:
  zookeeper:
    image: wurstmeister/zookeeper
    ports:
      - "2181:2181"
  kafka:
    build: .
    ports:
      - "9092"
    environment:
      KAFKA_ADVERTISED_HOST_NAME: INSERT_DOCKER_MACHINE_IP
      KAFKA_ZOOKEEPER_CONNECT: INSERT_DOCKER_MACHINE_IP:2181
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

### Boot-up the stack
```
docker-compose up -d
```

### Verify the deployment
![Alt text](docker-ps.png?raw=true "docker ps")


### Start the kafka shell (to be used later to create consumer and producer)
![Alt text](kafka-shell.png?raw=true "./start-kafka-shell.sh 192.168.99.101 192.168.99.101:2181")

### Create a topic with replication-factor set to 1 i.e only one broker
![Alt text](kafka-create-topic.png?raw=true "$KAFKA_HOME/bin/kafka-topics.sh --create --topic topic --partitions 4 --zookeeper $ZK --replication-factor 1")

### List topics and brokers
![Alt text](kafka-list-topics.png?raw=true "$KAFKA_HOME/bin/kafka-topics.sh --describe --topic topic --zookeeper $ZK")

### Start Kafka producer and send a console message
![Alt text](kafka-producer.png?raw=true "$KAFKA_HOME/bin/kafka-console-producer.sh --topic=topic --broker-list=`broker-list.sh`")

### Start Kafka consumer and verify message delivery
![Alt text](kafka-consumer.png?raw=true "$KAFKA_HOME/bin/kafka-console-consumer.sh --topic=topic --bootstrap-server=192.168.99.101:32768`")

