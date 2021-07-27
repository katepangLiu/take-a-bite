# Kubernetes Backup and Restore made easy

- What is Data Management in K8s and why it's a challenging task?
- Possible ways to handle it.
- How K10 solves the problems?

## Data Services

- inside cluster
  - Data is physically stored on some storage backend.
    - Cloud Storage
    - On-Premise Service
- outside cluster
  - AWS RDS
  - ...



## Data Management Use Cases

- Underlying infrastructure fails
- inside-cluster DB gets corrupted
- Replicating K8s cluster



## Challenge

- How to capture an application backup? 
  - Databases inside cluster
  - Managed Data Service outside cluster

- Restore and Replicate.



## What possible solutions we have?

- VM or Etcd backup
  - Cluster state backed up
  - Application Data not backed up
- Cloud providers backup and restore mechanism
  - partially managed by cloud platform
  - Data in Volume backed up
  - No cluster state
- Custom Backup Scripts for different infrastructure levels
  - levels
    - Data Services
    - Kubernetes Distributions
      - AWS
      - Google
      - ...
    - Storage Infrastructure
      - On-Premise
      - Cloud
  - Tailored to application
  - Gets complex very soon
  - Difficult to maintain



## How K10 solves these problems?

**Abstraction of underlying infrastructure**

**layers**

- Data Services
- Kubernetes Distributions
- Storage Infrastructure

**Pros**

- Consistent Data Management
- Teams can choose whichever platform they prefer
- Extensive ecosystem
- 1 easy-to-use dashboard

**Everything is captured by K10**

**Policy-driven Automation**

- Create Policies to automate your data management workflow

**Multi-Cluster Manager**

**Kubernetes native API**

- K10 exposes an API based on Kubernetes CRD's
  - Automate your Policy creation & configuration



## How K10 actually work?

### Install

```shell
helm install k10 kasten/k10 -namespace=kasten-io
```

- K10 Dashboard
  - Applications
    - Applications Details
      - Workloads
      - Networking
      - Config
  - Policies
  - Data

### Create a Backup Policy

New Policy

- Name
- Comments
- Actions
- Backup Frequency
- Select Applications
  - By Name
  - By Labels
  - None
- Enable Backups via Snapshot Exports
  - Export Location Profile
    - New Profile
      - name
      - Cloud Storage Provider
        - S3
          - Access
          - Endpoint
          - Region
          - Bucket Name
- Select Application Resources
  - All
  - Filter Resources
    - include
    - exclude

A policy is a yaml file  -- Policy as Code.



### Restore the application

Steps:

- Choose Restore Point
- Create a new namespace
- Restore

Result:

- New Namespace created
- Complete Application cloned



### Transformation on Restore

Transformations

- By default, K10 restores K8s resources as they exist in the restore point 
- You can transform k8s resource artifacts on restore
  - Change Storage Type
  - Change # of Replicas
  - Change Avail, Zone

Steps:

- Add New Transform
  - Options
    - Choose an operation



## Wrap Up

K10

- Easy Data Management
  - Backup & Restore
  - Disaster Recovery
  - Application Mobility

https://www.kasten.io/devops-tool

- Hans-on Lab
- Free Kasten K10



## Reference

https://www.youtube.com/watch?v=01qcYSck1c4&ab_channel=TechWorldwithNana







