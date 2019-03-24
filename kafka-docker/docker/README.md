# Running Multiple Apache Kafka brokers in Docker (for a Development environment)

## Reference:
1. [ This work is based on the reference found here.. ](https://hub.docker.com/r/wurstmeister/kafka)
2. [ Additional reference ](http://wurstmeister.github.io/kafka-docker/)

## Procedure (with Default selections where possible):

### [ Clone the kafka-docker repository ](https://github.com/wurstmeister/kafka-docker)

### Update the docker-compose stack for Kafka and Zookeeper Stack:
```yaml
version: '2'
services:

  zookeeper:
    image: wurstmeister/zookeeper
    ports:
      - "2181:2181"
    networks:
      vpcbr:
        ipv4_address: 10.5.0.4
  kafka:
    build: .
    ports:
      - "9092"
    networks:
      vpcbr:
        ipv4_address: 10.5.0.5
    environment:
      KAFKA_ADVERTISED_HOST_NAME: EC2-PRIVATE-IP
      KAFKA_ZOOKEEPER_CONNECT: EC2-PRIVATE-IP:2181
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock

networks:
  vpcbr:
    driver: bridge
    ipam:
     config:
       - subnet: 10.5.0.0/16
         gateway: 10.5.0.1
```

### Boot-up the stack
```
docker-compose up -d
```

### Verification

#### Login to Kafka container
```
docker exec -it kafka-docker_kafka_1 /bin/bash
```

#### Create a topic with 1 broker
```
$KAFKA_HOME/bin/kafka-topics.sh --create --topic topic --partitions 4 --zookeeper EC2-PRIVATE-IP:2181 --replication-factor 1
```

#### Describe topics
```
$KAFKA_HOME/bin/kafka-topics.sh --describe --topic topic --zookeeper EC2-PRIVATE-IP:2181
```

#### List brokers
```
export HOST_IP=EC2-PRIVATE-IP && broker-list.sh
```

#### Start producer
```
$KAFKA_HOME/bin/kafka-console-producer.sh --topic=topic --broker-list=`broker-list.sh`
```

#### Start consumer
```
$KAFKA_HOME/bin/kafka-console-consumer.sh --topic=topic --bootstrap-server=EC2-PRIVATE-IP:32777
```

### Containers and Proxy listing
![Alt text](containers-proxy.png?raw=true "")
