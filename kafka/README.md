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

### [ Clome the kafka-docker repository ](https://github.com/wurstmeister/kafka-docker)

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

### Verify the depployment
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


![Alt text](docker-machine-create.png?raw=true "docker-machine create --driver virtualbox kafka-demo")
![Alt text](docker-machine-create.png?raw=true "docker-machine create --driver virtualbox kafka-demo")
![Alt text](docker-machine-create.png?raw=true "docker-machine create --driver virtualbox kafka-demo")
![Alt text](docker-machine-create.png?raw=true "docker-machine create --driver virtualbox kafka-demo")




1. Choose Cluster Name
2. Select Kubernetes version
3. Create an IAM Role for the EKS Service and attach  the following permissions policies
    a. AmazonEKSClusterPolicy - This policy provides Kubernetes the permissions it requires to manage resources on your behalf. Kubernetes requires Ec2:CreateTags permissions to place identifying information on EC2 resources including but not limited to Instances, Security Groups, and Elastic Network Interfaces.
    b. AmazonEKSServicePolicy - This policy allows Amazon Elastic Container Service for Kubernetes to create and manage the necessary resources to operate EKS Clusters.
4. Select a VPC - For HA multi-AZ ex: us-east-2
6. Select Subnets - For HA subnets from multiple AZs ex: us-east-2a, us-east-2b, s-east-2c
7. Create and apply an appropriate SG

### Configure kubectl to connect to the cluster
1. Install aws cli
2. Install aws-iam-authenticator - `go get -u -v github.com/kubernetes-sigs/aws-iam-authenticator/cmd/aws-iam-authenticator`
3. Configure the AWS_ACCESS_KEY_ID, AWS_ACCESS_KEY_ID, AWS_DEFAULT_REGION for the IAM User and Region used via console respectively
4. Run `aws eks update-kubeconfig --name CLUSTER_NAME`
5. Verify the set-up by running  any kubectl command that queries the api server ex: `kubectl get svc`

## How does aws-iam-authenticator work ? 
Detailed info see [How does auth work in EKS with IAM Users ](http://marcinkaszynski.com/2018/07/12/eks-auth.html)
Once Kubernets cluster and Kubectl is configured, A call from kubectl to the Kubernetes API server will firstly pass a bearer token, by way of a webhook, over to IAM to ensure that the request is coming from a valid identity. Once the validity of the identity has been confirmed, Kubernetes then uses it's own RBAC capability (Role Based Access Control) to approve or deny the specific action the requester tried to perform.

#### Obtaining token:
ex: `aws-iam-authenticator token -i CLUSTER_NAME`

#### kube config user entry:
```yaml
- name: arn:aws:eks:us-east-2:ACCOUNTID:cluster/demo
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1alpha1
      args:
     . token
     . -i
     . demo
      command: aws-iam-authenticator
```
