# General Notes

## HA and FT:
Kafka is designed with failure in mind - Kafka is designed with failure in mind. At some point in time, web communications or storage resources fail. Kafka is Distributed System so all the Distributed Systems Problems are relevant to Kafka too - ex: Consistency, Availability, Partition Tolerance.

Leaders are special, in that producers and consumers can only interact with leaders in a Kafka cluster.

![CAP Theorem](images/cap.png)

### Preferred Leader Election
When a broker goes offline, one of the replicas becomes the new leader for the **partition**. When the broker comes back online, it has **no leader partitions**.

Kafka keeps track of which machine is configured to be the leader. Once the original broker is back up and in a good state, Kafka restores the information it missed in the interim and makes it the partition leader once more.

### Unclean Leader Election
Enable unclean leader election to allow an out-of-sync replica to become the leader and preserve the availability of the partition. With unclean leader election, messages that were not synced to the new leader are lost. This provides balance between **consistency (guaranteed message delivery) and availability** (see CAP theorem). With unclean leader election disabled, if a broker containing the leader replica for a partition becomes unavailable, and no in-sync replica exists to replace it, the partition becomes unavailable until the leader replica or another in-sync replica is back online.


## Writes -  Acks, Consistency and Availability
When writing or configuring a Kafka producer, you can choose how many replicas commit a new message before the message is acknowledged using the acks property.

Set **acks to 0** (immediately acknowledge the message without waiting for any brokers to commit), **1** (acknowledge after the leader commits the message), or **all** (acknowledge after all in-sync replicas are committed) according to your requirements. **Setting acks to all provides the highest consistency guarantee at the expense of slower writes to the cluster.**

### Minimum Insync Replicas
You can set the minimum number of in-sync replicas (ISRs) that must be available for the producer to successfully send messages to a partition using the min.insync.replicas setting. If min.insync.replicas is set to 2 and acks is set to all, each message must be written successfully to at least two replicas. This guarantees that the message is not lost **unless** both hosts crash. 

It also means that if one of the hosts crashes, the partition is **no longer available for writes**. Similar to the unclean leader election configuration, setting min.insync.replicas is a balance between higher consistency (requiring writes to more than one broker) and higher availability (allowing writes when fewer brokers are available).

```
min.insync.replicas.per.topic - To set this per Topic
min.insync.replicas.per.topic - To set this at Cluster level
```

## Kafka Deployment Design Considerations

1. Retention: 
```
Both Time and Space based Retention.
Have a way to update Retention on the fly.
Ensure that you dont Retain more than what is needed as this will reduce the Complexity by a huge factor.
```

2. Replication: 
```
Have Sufficient replication for Topic Partitions.
The default replication factor for new topics is one in ex: Cloudera's Kafka Distribution. Whereas, In AWS MSK the default replication factor is set to 3. 
For high availability production systems, The recommended replication factor should be at least three. This requires at least three Kafka brokers.
```

3. Consumer Lag
```
Ensure Consumer Lag to be within reasonable limits.
Ensure that the Retention is sufficient to handle Consumer Lag.
```

4. Cluster Infra Design
```
Ensure that the Cluster is balanced ex: A single Broker does not end-up being a leader for dis-proportionate number of Topic Partitions.
Ensure that the Cluster Nodes are spread across Failure Domains be it - Physical Hosts, Racks, AZs etc....
Ensure that the Storage design interms of Size, IOPs etc are all well planned.
```
