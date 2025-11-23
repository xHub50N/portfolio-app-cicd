# Configuring services on VM2-services

In this section, I will show you how to properly configure the services needed to run Hashicorp Vault in a local environment. To do this, I will use Docker containers as a quick and convenient way to deploy applications:
 - Adguard Home
 - Nginx Proxy Manager
 - Hashicorp Vault

**Important information** - in this section, you will need to have your own DNS domain so that you can generate a certificate from Letsencrypt or ZeroSSL. For my needs, I use the domain hbojda.ovh

After preparing the VM2 machine with the Ansible playbook, we can check if the docker-compose files have been transferred and if the folders have been created.

![alt text](./images/Docker%20configuration/check-docker.png)

As you can see in the picture above, the folders have been created.

### Adguard-home configuration

To run the Adguard Home application, we need to go to the appropriate directory and execute the command 

```
docker compose up -d
```

This is what the docker-compose file for Adguard Home looks like

```
services:
   adguardhome:
     image: adguard/adguardhome:latest
     container_name: adguardhome
     restart: always
     ports:
       - 53:53/tcp
       - 53:53/udp
       - 853:853/tcp
       - 3000:3000/tcp
     volumes:
       - ./work:/opt/adguardhome/work
       - ./conf:/opt/adguardhome/conf
```

![alt text](./images/Docker%20configuration/adguard-error.png)

The screenshot above shows that the container has been downloaded, but there was a problem with port 53 redirection because a local DNS server is currently running on the host system. To change this, execute the following commands:

```
systemctl stop systemd-resolved
systemctl disable systemd-resolved
docker compose up -d
```

![alt text](./images/Docker%20configuration/adguard-home.png)


Now we can move on to configuring AdGuard. Just go to http://adres-maszyny:3000 and follow the simple configuration steps.


![alt text](./images/Docker%20configuration/dns-rewrite.png)

In the Adguard settings, go to the Filters > DNS Rewrite tab and add a rewrite entry. 

### Configuring nginx-proxy-manager

We can go to the folder with nginx-proxy-manager. To run the application, enter the command 

```
docker compose up -d
```

This is what the docker-compose file for nginx proxy manager looks like

```
services:
  app:
    image: ‘jc21/nginx-proxy-manager:latest’
    restart: always
    ports:
      - ‘80:80’
      - ‘443:443’
      - '81:81'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

After starting the container, we can go to the address in the browser http://192.168.1.23:81  

![alt text](./images/Docker%20configuration/npm-conf.png)

As you can see, the NPM login screen appears. To log in, we need to use the default credentials
```
login: admin@example.com
password: changeme
```

![alt text](./images/Docker%20configuration/add-cert.png)

After logging in **and changing the password**, we can add our certificate to NPM. We need to have the private key of the certificate and the certificate itself ready for import.

![alt text](./images/Docker%20configuration/add-host.png)

Finally, we can add the host to redirect. I set the domain vault.hbojda.ovh and pointed it to the local port 8200 where HCP Vault will be running. Additionally, we connect it to the certificate.

### Hashicorp Vault configuration

Go to the directory and execute the command 

```
docker compose -d
```

This is what the docker compose file for HCP Vault looks like

```
services:
  vault:
    image: hashicorp/vault:1.17
    container_name: vault
    restart: always
    environment:
      VAULT_ADDR: "https://127.0.0.1:8200"
    ports:
      - "8200:8200"
      - "8201:8201"
    cap_add:
      - IPC_LOCK
    volumes:
      - ./data:/vault/data
      - ./config:/vault/config:ro
    entrypoint: vault server -config /vault/config/vault.hcl
```

Additionally, the Ansible playbook will copy the vault.hcl file.

```
ui = true
disable_mlock = "true"

storage "raft" {
  path    = "/vault/data"
  node_id = "node1"
}

listener "tcp" {
  address = "[::]:8200"
  tls_disable = 1
}

api_addr = "http://192.168.1.23:8200"
cluster_addr = "http://192.168.1.23:8201"
```

![alt text](./images/Docker%20configuration/vault-init.png)

We can now go to https://vault.hbojda.ovh. Communication now works over a secure encrypted connection, and we can now proceed with the HCP Vault configuration. At this point, click Create a new Raft cluster

![alt text](./images/Docker%20configuration/create-vault-token.png)

Now enter the number of secrets needed to unlock HCP Vault. These secrets should be stored in a secure location so that they do not fall into the wrong hands. Later, we can log into the system using these secrets and the root token.

![alt text](./images/Docker%20configuration/add-pv-key.png)

**IMPORTANT** To correctly add a private key to the vault, you must add it directly from the command line because when you add it from the GUI, the key formatting is incorrect. 

To go to the vault container, execute the command 

```
docker exec -it vault sh
```

and then copy and save the private key in any location and execute the command to add the key to the vault, after which we can delete the key
```
vault kv put kv/ssh_proxmox private_key=@id_rsa
rm id_rsa
```

![alt text](./images/Docker%20configuration/add-kv.png)

The next step after logging in is to add the kv secrets “engine” so that secrets can be stored in it as key-value pairs

![alt text](./images/Docker%20configuration/create-secrets.png)

The screenshot above shows the necessary secrets stored in the HCP vault, including:
- Docker Hub login details
- GitHub key
- Proxmox token
 - Private key needed for authentication with hosts

 ### [Back to main page](../Docs.md)