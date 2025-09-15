---
title: "A Technical Description of the Cyoda Platform"
author: "Paul Schleger"
date: "2025-05-29"
category: "Platform"
excerpt: "This is a deep-dive technical reference for the Cyoda Platform (see https://cyoda.com), a distributed, transactional data-processing system built to support high-availability business applications. It outlines the architecture and mechanics of the Cyoda Platform Library (CPL), which includes asynchronous transactional workflows, point-in-time querying with snapshot isolation, distributed report execution, and event-context sharding. Designed for developers familiar with distributed systems, the document emphasizes low-level design decisions, like extended ACID semantics, integration with Cassandra and Zookeeper, and client-extensible workflows."
featured: false
published: true
image: "/images/blogs/tech_description.png"
tags: ["platform", "technical"]
---
# A Technical Description of the Cyoda Platform

*This updated 2018 article, though previously unpublished, remains a relevant and accurate technical description of the core Cyoda Platform. It outlines the foundational elements that will power our upcoming Cyoda Cloud and AI integrations…*


## **TL;DR**

This is a deep-dive technical reference for the Cyoda Platform (see [https://cyoda.com](https://cyoda.com/)), a distributed, transactional data-processing system built to support high-availability business applications. It outlines the architecture and mechanics of the Cyoda Platform Library (CPL), which includes asynchronous transactional workflows, point-in-time querying with snapshot isolation, distributed report execution, and event-context sharding. Designed for developers familiar with distributed systems, the document emphasizes low-level design decisions, like extended ACID semantics, integration with Cassandra and Zookeeper, and client-extensible workflows.

No fluff, no pictures — just the raw technical scaffolding behind Cyoda.

Only read it if you’re serious about scalable transactional backends.

You’ve been warned.

## **Description**

The *Cyoda Platform* (or *Cyoda™*) is a distributed, highly available, transactional data processing, storage and reporting software system. The features and capabilities of Cyoda are bundled in the *Cyoda Platform Library*™ (CPL), which can be licensed from Cyoda Ltd to efficiently build horizontally scalable business applications spanning a large set of use cases.

The design of Cyoda was inspired by our experience working in investment banks to build and integrate middle and back-office systems, and particularly also the 2015 pre-release version of the great book by Martin Kleppmann *Designing Data-Intensive Applications* (O’Reilly, 2017).

The CPL contains the *Cyoda Processing Manager*™ (CPM), a runnable component which is wrapped as a *Spring Boot*® Application, each of which can be deployed independently, typically as a standalone Spring Boot® application using an embedded Apache Tomcat® server. *A* collection of interacting CPM instances (CPM Nodes) forms a *Cyoda cluster,* which collectively provision the operational functions of the Cyoda Platform.

CPM Nodes and runtime instances of client software using the CPL require a running *Apache Cassandra*® (Cassandra) database cluster for its storage backend, as well as an *Apache Zookeeper*™ (Zookeeper) cluster for the coordination between CPM Nodes.

The CPL is made available as bytecode for the Java® Virtual Machine (JVM).

## **Software Functions**

### **The Cyoda Cluster**

In a proper running state, a connected cluster of CPM Nodes (Cyoda Cluster) offers the following features:

* **Consistency clock**  
* **Extended ACID transactional properties**  
* **Asynchronous workflow automation**  
* **Asynchronous distributed report execution**  
* **Event-context sharding and availability management**  
* **Cluster status and control functions**

**Consistency clock**

The *Consistency Time* is a system-wide sub-microsecond timestamp determining the point-in-time where all transactions submitted to the system before this time were either successfully committed, cancelled or rolled back. Conceptually, it is a *Consistency Clock* which represents the latest time where read operations are guaranteed to see consistent information.

The Cyoda Cluster operates a configurable controller to automatically resolve errored transactions, ensuring the Consistency Clock does not stop for an indefinite period.

**Extended ACID transactional properties**

Transactional processing in Cyoda is asynchronous and takes place in two phases: a preparation phase and a submission phase. Clients can open transactions in the preparation phase, register mutated and unmutated data objects, and submit these for processing. The processing of submitted transactions is asynchronous. The Cyoda Cluster orchestrates the execution of submitted transactions in the cluster such that clients can apply data operations with ACID transactional properties based on serializable snapshot isolation, if the associated read operations conducted within the transaction context are made with respect to the consistency time and read-dependent unmutated data objects are registered with the transaction.

Cyoda offers the following transactional properties if the associated client application code executed during a transactional sequence is properly implemented:

1. Transaction submissions are serialized. The data history can be viewed as a time-ordered series of applied transaction submission events.  
2. Entity transactions are atomic with regard to concurrent read operations made at the consistency time.  
3. A transaction is applied under serializable snapshot isolation (SSI), and therefore, transactions based on outdated information (outdated premise) which was registered with the transaction will not succeed.  
4. Successfully submitted transactions are durable.  
5. Processing of a submitted transaction is asynchronous, i.e. it will happen eventually.  
6. Arising from the principle of SSI, there is no guarantee that submitted transactions will complete successfully.  
7. The result of a submitted transaction is durable and idempotent.

**Asynchronous workflow-automation**

The CPL has functions for controlling data mutations via a workflow mechanism coupled to a state machine. All data which is processed transactionally is coupled to such a state-enabled context. This workflow framework, both for transactional and non-transactional processing, offers features which may lead to asynchronous handling of workflow-related operations. The Cyoda Cluster handles the orchestration and execution of such asynchronously scheduled processes, as well as the associated automation of workflow transitions.

**Asynchronous distributed report execution**

The CPL has functions to configure and schedule distributed complex data queries (Distributed Reports). The Cyoda Cluster detects distributed reports scheduled for execution and executes these across the cluster by partitioning the query and distributing the work across the cluster.

**Event-context sharding and availability management**

Processing in Cyoda is inherently distributed and asynchronous. Asynchronous processing is facilitated via the registration of events into durable event queues (essentially a scalable message-passing mechanism). Cyoda uses the principle of *Event-Context Sharding* to enable consistency and avoid the need for conflict resolution due to concurrent processing. Event-Context Sharding means that two asynchronously scheduled events for the same underlying context will always be processed serially (*Apache Kafka® uses a similar mechanism for partitioned topics*). The ordering for processing submitted transactions is related to, but not strictly based on, the transaction submission time. In other words, submitted transactions are not guaranteed to be processed in order. This implies that a transaction A may fail if a different transaction B submitted later is processed successfully before transaction A, and the result of applying transaction B leads to an outdated premise for transaction A. This type of sharding relies on the specific atomicity guarantees of Cassandra and is not related to data localization sharding.

Examples of asynchronous processes include transaction orchestration, workflow automation and distributed reporting. These mechanisms are internally structured to be idempotent, so that aborted event handling can be restarted without affecting the result.

Client applications, however, must provide idempotent elements which participate in asynchronous state machine processing to uphold the consistency and availability goals of the system.

Together with the sharding coordination between CPM Nodes facilitated via Zookeeper, these functions reduce the probability of indefinite pauses in processing requiring manual intervention (loss of availability) in the case of individual CPM nodes becoming unavailable (for example due to hardware or network failures): The Cyoda Cluster automatically detects offline nodes states and reallocates shard assignments to functioning CPM nodes.

Coupled with an appropriately configured Cassandra cluster, the Cyoda platform offers availability and fault-tolerance against a variety of failure scenarios.

**Cluster status and control functions**

Each CPM Node has a browser-based user interface (CPM UI) and associated API endpoints covering the following features:

* High-level Information about online CPM Nodes, Consistency Clock, transactions, shard allocation and queue configurations.  
* Statistics about event queues  
* Statistics about the polling of event queues  
* Details about individual events  
* Statistics about a diverse number of code-block execution times and execution counts  
* Ability to clear execution time and count statistics  
* View of all current transactions  
* View of historic transactions  
* Ability to view transaction details, including entity members  
* Ability to view entity (Versions, Changes, State Machine Events)  
* Ability to hard-reset the Consistency Clock  
* Ability to transition an entity  
* Monitor the Queue backlog  
* Monitor Queue executions  
* Monitor service processes, such as the Consistency Time Controller  
* Monitor status and enable/disable runnable components, such as Main Processing Controller, Service Processing Manager, Zookeeper Client Controller

## **Cyoda Platform Library**

Only software functions which are relevant for the integration of a client application on Cyoda will be described in this document. Any library functions not explicitly mentioned in this document are internal to Cyoda, even if the CPL makes these functions visible to an application.

To integrate client applications with Cyoda, the following functions are available:

* **Data modelling and persistence**  
* **Auditing**  
* **Indexing**  
* **Configurable entity workflow**  
* **Synchronous data querying**  
* **Asynchronous distributed reporting**  
* **Authorization of entity operations**  
* **Basic API functions**  
* **Client event data**  
* **Toolbox**

A short description of these functions is given in the following sections. Additional information can be requested by licensed customers.

**Data modelling and persistence**

The CPL offers services to handle the creation, modification, and deletion of stored data. Client applications can choose to model the data in different ways, depending on the classification; for low-volume data that does not need transactional features beyond atomicity and durability, a static data type is available (static entity). Data which needs to be transactionally processed with atomicity, consistency, isolation and durability (ACID) properties, a dynamic entity type (dynamic entity) is available for use.

For all entity types, the CPL enables client applications to model data at the Java class level. Domain classes (i.e. the entities) encapsulating the information which should be persisted, their substructure and the relationships between entities can be modelled via appropriate Java annotations at the class and field level, including, for example, to specify the field which acts as the unique identifier, to control range indexing on particular fields, or to specify a custom serializer for a field.

The persistence of entities is handled by the CPL via service functions in a generic fashion. Clients need only pass the object instance of the entity to the service function; the mapping of objects to physical storage is handled by the CPL.

The CPL will execute the service requests differently, depending on the entity type. For dynamic entities, client applications can bundle service requests for different entities within the same transaction. When interacting with data services using a transaction identifier, all read and write operations on entities are registered with the transaction (in the transaction log) and form part of the validation within the SSI mechanism.

For dynamic entities, the CPL will physically store the information in the Cassandra datastore in a write-only fashion, i.e. as a series of field-level changes and associated metadata, such as the transaction timestamp.

**Auditing**

Effectively, the write-only persistence mechanism for dynamic entities is also the audit trail for such entities. The metadata attached to entity changes includes user and timestamp information suitable for audit functions.

Client applications that process all dynamic entities transactionally may also make use of an additional auditing capability if the associated transaction logs are kept. Through the linkage between the entity version and the corresponding transaction log entry, it is possible to determine all entities which participated in the transaction. Since each participating entity links all its versions to corresponding transaction logs, the entire history of data dependencies can be traversed up to its origins. Client applications can also register with the transaction-relevant entities which played a role in determining the outcome, but were left unchanged. If properly done, it is possible to reconstruct the entire version history of the information upon which a particular state of an entity was based, as a form of data lineage.

Changes to static entities are also audited, but differently from dynamic entities, since static entities are not persisted using a write-only mechanism.

**Indexing**

For dynamic entities, the CPL will automatically index certain primitive data types, including Integer, Long, Float, Double, Date, LocalDate, LocalTime, LocalDateTime, ZonedDateTime, BigDecimal, and UUID. For transactional write operations, the indexing is a direct constituent of the transaction: when conducting read operations against the consistency time, all index values are consistent with the corresponding data.

The CPL enables client applications to define, configure and manage composite indexes, i.e. indexes which span multiple primitive fields, including string fields.

For any realistic client application, the use of indices and composite indices, via appropriate query definitions, is highly recommended and forms an integral part of achieving optimal performance on the Platform.

**Configurable entity workflow**

A dynamic entity is workflow-based, meaning that each entity has a state label (State) which may only take on values from a pre-defined, configurable finite set of States. A configurable workflow is associated with each entity. It defines the possible transitions from one State to another State, under which conditions such a transition is possible (Criteria) and what processes should be executed when it is traversed. The logic of processes to be executed upon transitioning is encapsulated in an Entity Processor class.

The CPL allows client applications to control the transactional relevance of Entity Processor configurations (non-transactional, same transaction, separate transaction, and forced non-transactional), as well as the synchronous character (synchronous or asynchronous). Entity Processor classes can be attached to different transitions and parameterized differently for each transition. Entity Processors, which are executed asynchronously, are serially processed in relation to a grouping identifier, which is, by default, the entity identifier. Client applications can provide custom grouping identifiers to override this behaviour.

The overall configuration is used by the state machine to manage the state-dependent operations of the CPL. The CPL has functions to allow client applications to manage the state machine configuration.

The state machine manages the traversal of the entity through its workflow and is embedded within the services offering data operations. During a save operation, the state machine assembles a narrative of the workflow traversal (State Machine Events), providing information about the steps taken. The State Machine Events are persisted and are available, for example, to conduct analyses and audits.

During the packaging of the CPM for code deployments, client build systems can provision client-specific entity classes, transition criteria classes, and Entity Processor classes to make these available for use within the CPM.

**Synchronous data querying**

The CPL offers the ability to search for entities via service calls executed synchronously. Queries can nest and combine using AND and OR logic of a large variety of basic field-level conditions, such as equality conditions, numeric (range) comparisons, string-type comparisons, etc.

The relevant field used in a condition is defined using a path specifier, unambiguously identifying the field within the data model of the entity. The CPL offers a function which can generate the correct path specification at runtime, with compile-time validation of the correct path.

For dynamic entities, all query-based fetch operations also include a specification of the point-in-time. Any dynamic entity mutations with timestamps greater than the given point-in-time are excluded from the operation. Cyoda thus effectively offers a querying function for any arbitrary snapshot of data in the past (Snapshot Isolation).

For dynamic entities, it is possible to execute index-based queries. Index-based queries are point-in-time and also cover range conditions. Unlike table-scan queries, the execution time of index-based queries is largely independent of the amount of data stored in the system.

**Asynchronous distributed reporting**

The CPL can also schedule distributed reports for asynchronous execution. The CPL allows client applications to define a report containing selection criteria based on the same mechanisms as for synchronous queries. Additionally, it is possible to specify field selection, sorting and grouping criteria.

The report configuration allows for alias definitions which combine different field-paths in the data model to a common logical (aliased) field. The constituents of an alias can be mapped to bring each field-path into a common representation, so that different representations in the data model can be joined and aggregated directly, if the corresponding data model provided by the client application allows for such associations.

During the packaging of the CPM for code deployments, client build systems can provision client-specific alias mappers for use by the CPL.

**Authorization of data operations**

The CPL enables data operations with and without authorization. Authorization is applied to data operations through particular security-based services (as opposed to non-security-based services). The authorization framework is based on a decision tree mechanism. Client applications provide a specific implementation of a decision tree for use by security-based services. The authorization framework aims at providing a flexible approach for defining a client-specific authorization process, which is structured, transparent and high-performance.

The decision-making is based on the entity object-instance, the user effectuating the data operation, in conjunction with the specific client implementation of the access decision tree. The decision tree is a directed graph that is connected and has no cycles. The vertices (nodes) of the graph are instances of specific classes taken from a set of possible node classes. Node classes are provisioned by the client application, so that, in principle, virtually any logic can be incorporated into the decision-making process.

During the packaging of the CPM for code deployments, client build systems must provision client-specific implementations of an access decision tree.

**Basic API functions**

The CPL contains elements useful for setting up *Spring Security* configurations for client applications, provisioning API functionality. The functions include some foundations for the use of stateless authentication based on JSON Web Tokens. It also includes a servlet filter for attaching the authenticated user to the Cyoda security manager. The proper attachment of an authenticated user to the Cyoda security manager is essential for correctly applying authorization and audit record-keeping functions.

**Client event data**

Asynchronous processing within the CPM is handled via internal durable event queues. The event queue data can be customized to enable the attachment of client-specific information upon scheduling of an event, and the processing of the attached client event data upon handling of the event.

An example use case for this function is for client applications to propagate logging correlation identifiers (for example, Micrometer Tracing, a distributed tracing framework maintained by Broadcom Inc.) across JVM instances interacting via Cyoda event queues, such as is the case when asynchronous transactions and Entity Processors are executed.

**Toolbox**

The CPL contains a Toolbox application, which is packaged as a standalone, Spring Boot application without a web environment, and is intended to be run from the command line. Configuration properties determine which tools within the Toolbox are run when invoked from the command line. Once each tool is run, the application exits.

The CPL offers the following tools that can be launched from the Toolbox invocation:

* Synchronization of the Cassandra database schema with a reference schema.  
* Import of static and dynamic entity data from JSON or XML resource files  
* Export of static and dynamic entity data into JSON or XML resource files  
* Transitioning of selected Entities defined by a query condition.  
* Reindexing

Each tool has its own set of configuration properties that can be specified via a properties file resource, and or command line options.

During the packaging of the CPM for code deployments, client build systems can provision client-specific tools for the Toolbox.

## **Hardware Requirements**

Cyoda Ltd. does not certify the CPL for use on any particular hardware infrastructure. The alternatives offered through virtualization, containerization and direct hardware infrastructure are extremely diverse. Customers are free to choose the infrastructure that suits their needs best, but must always apply quality assurance procedures that include the full production stack, with appropriately realistic test scenarios to ensure that the system is functional and operates correctly.

The actual system requirements in terms of storage, memory and CPU depend entirely upon specific applications utilizing Cyoda and the CPL, and can only be specified based on detailed non-functional requirements.

## **Software Requirements**

Cyoda Ltd. does not certify the CPL for use on any particular operating system or software-based enclosure, such as virtualization or containerized environments. Customers are free to choose the infrastructure that suits their needs best, but must always apply quality assurance procedures that include the full production stack, with appropriately realistic test scenarios to ensure that the system is functional and operates correctly.

A CPM Node, a standalone Spring Boot application, necessitates Java 21\. While minor Java versions are flexible and subject to change, particularly for security purposes, client systems utilizing the Cyoda Platform Library (CPL) are responsible for maintaining compatible operating system and software versions.

The CPM requires connectivity to pre-configured and provisioned Cassandra 4 and Zookeeper v3.9.x clusters, which are external components and not part of the core Cyoda platform.

CPM Nodes, Cassandra nodes, and Zookeeper nodes can be deployed on shared hardware or separate instances. Optimal configuration depends on the specific use case.

The software dependencies of the CPL are available upon request. Licensed customers with CPL access can generate this list independently using Maven commands.

The Cyoda Platform components can be deployed in traditional infrastructure, virtualized environments, or container orchestration systems such as Kubernetes. While the CPL does not enforce a specific deployment model, clients using containerized workloads are encouraged to apply production-grade resource management and observability patterns consistent with their operational stack.

## **Distribution Media**

The CPL is currently available to licensed and authorized customers via secure Internet download. Access and installation details are communicated to licensed and authorized customers.

## **Ordering Information**

For information on available licenses, services, and distribution media, please contact your sales representative or Cyoda Ltd directly, for example via [https://cyoda.com.](https://cyoda.com./)

## **Software Licensing**

This software is only furnished under a license.

## **Software Product Services**

A variety of service options are available from Cyoda Ltd. For more information, please contact your sales representative or Cyoda Ltd directly, for example via [https://cyoda.com.](https://cyoda.com./)

## **Software Warranty**

The warranty of the software is defined in the individual license contract.

## **The Future**

Cyoda Ltd is launching the *Cyoda Cloud* service, an application platform based on the Cyoda Platform Library as an Entity Database Management System (EDBMS). In such a solution, all client-specific logic is externalized via network-based gRPC integration with a cloud of client compute nodes and a configuration-based entity modelling approach.

