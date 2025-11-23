# Project documentation

This article contains comprehensive documentation of the project implementation. In it, I want to present how to recreate my sample solution for creating an application implementation environment in the DevOps methodology.

---

### Complete documentation:

#### Deploy infrastructure
- [Packer](./deploy-environment/Packer.md)
- [Prepare virutal machines VM1 and VM2](./deploy-environment/Prepare%20VM1%20and%20VM2.md)
- [Configuring Docker applications](./deploy-environment/Docker%20configuration.md)
- [Terraform and Ansible](./deploy-environment/Terraform+Ansible.md)

#### CI
- [Installation and Configuration of Jenkins and Sonarqube](./CI/Jenkins.md)
#### CD
- [Configuration and implementation of K3S and ArgoCD](./CD/k3s.md)

#### Publication of the environment
- [Cloudflare and GitHub Webhook](./publish-environment/cloudflare-gh.md)

---
### Environment schema

![alt text](Environment-schema.png)
---
### This project is based on the entire application implementation scheme in the CI/CD process, using the following tools:

- GitHub - code repository
- Jenkins - CI tool for building artifacts 
- SonarQube - tool for analyzing the built application code and detecting vulnerabilities
- Docker/Docker Hub - technology used to build containers; Dockerhub as a remote repository for storing artifacts.
- ArgoCD - a tool based on the GitOps approach to deploying applications to the Kubernetes environment
- K3S - lightweight Kubernetes distribution

### In addition, I use the following tools to build and maintain the environment:
- Proxmox VE - open source virtualization software
- Packer - IaC tool for building system images
- Terraform - IaC tool for infrastructure management
- Ansible - tool for automating the deployment of virtual machine configurations

### Apps:
- HashiCorp Vault - keeping secrets
- Adguard Home - local DNS server
- Nginx Proxy Manager - reverse proxy server


### [Back to home page](../README.md)

