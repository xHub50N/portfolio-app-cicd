# Preparation and initial configuration of virtual machines VM1 and VM2

 The VM1 machine, which will be named srv-provisioning, will be responsible for creating the infrastructure of the VM3 and VM4 virtual machines using Terraform. In addition, the VM1 machine will have Ansible installed on board to automatically configure and install the necessary software.

 The VM2 machine, with the working name srv-services, will have the necessary services installed within Docker containers for the proper functioning of the entire environment, including:
- Adguard Home, which will serve as a local DNS server
- Nginx Proxy Manager as a reverse proxy service
 - Hashicorp Vault as a vault for secrets needed to create and manage the environment

![alt text](./images/Prepare%20VM1%20and%20VM2/clone-vm.png)

 First, we need to clone the virtual machine based on our template, which was created using packer.

 ![alt text](./images/Prepare%20VM1%20and%20VM2/cloud-init.png)
 After cloning the VM, we can move on to the cloud-init section. We need to select that the address should be assigned by DHCP (earlier, an address reservation was added to the router via MAC) and click regenerate-image. We can now start the virtual machine

![alt text](./images/Prepare%20VM1%20and%20VM2/ssh-login.png)

We have successfully logged into VM1, now we can repeat this step for VM2.

### Preparing Terraform and Ansible

The repository in the /scripts folder contains two scripts for installing Terraform and Ansible.

#### Installing Ansible
```
#!/bin/bash

apt update
apt install software-properties-common
add-apt-repository --yes --update ppa:ansible/ansible
apt install ansible -y
apt install python3.12-venv -y
python3 -m venv ~/.venvs/ansible-vault
source ~/.venvs/ansible-vault/bin/activate
pip install --upgrade pip
pip install ansible hvac requests
ansible-galaxy collection install community.hashi_vault
source ~/.venvs/ansible-vault/bin/activate
```

#### Installing Terraform

```
#!/bin/bash

sudo apt-get update && sudo apt-get install -y gnupg software-properties-common
wget -O- https://apt.releases.hashicorp.com/gpg | \
gpg --dearmor | \
sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(grep -oP '(?<=UBUNTU_CODENAME=).*' /etc/os-release || lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update
sudo apt-get install terraform
```

![alt text](./images/Prepare%20VM1%20and%20VM2/terraform+ansible.png)

The software has been successfully installed.

The next step will be to prepare Ansible playbooks and Terraform files to set up the infrastructure. 

Copy the contents of the Ansible and Terraform folders from the repository to the VM1 virtual machine

![alt text](./images/Prepare%20VM1%20and%20VM2/terraform+ansible-files.png)

This is how it should look 

![alt text](./images/Prepare%20VM1%20and%20VM2/copy-key.png)

Additionally, it will be useful to copy the private and public keys that were created during the packer configuration.

#### Ansible configuration

The next step will be to prepare the ansible configuration. First, we will prepare the inventory.ini file, which will contain information about the IP addresses of the virtual machines and the user we will use to log in.
```
[cicd]
192.168.1.21 ansible_user={your-user}
192.168.1.22 ansible_user={your-user}

[ci]
192.168.1.21 ansible_user={your-user}

[cd]
192.168.1.22 ansible_user={your-user}

[services]
192.168.1.23 ansible_user={your-user} ansible_ssh_private_key_file=~/.ssh/id_rsa
```

This is what the file looks like. First, we are interested in the last host. We need to specify the path to the private key file, which will be used for authentication when executing the Ansible playbook. 

The hosts listed above will not need to log in using a private key. At a later stage, Hashicorp Vault will be launched, allowing us to authenticate without storing private keys on different devices. Everything will be centralized.

```
- name: Docker installation
  hosts: services
  become: true
  roles:
    - docker

- name: Copy docker-compose files to run - Adguard-home, nginx-proxy-manager, hashicorp-vault
  hosts: services
  become: true
  roles:
   - services
```

This is what the playbook-services.yml file looks like

```
- name: Install required packages
  apt:
    name:
      - apt-transport-https
      - ca-certificates
      - curl
      - software-properties-common
    state: present
    update_cache: yes

- name: Add Docker GPG key
  apt_key:
    url: https://download.docker.com/linux/ubuntu/gpg
    state: present

- name: Add Docker repo
  apt_repository:
    repo: deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable
    state: present
    update_cache: yes

- name: Install Docker
  apt:
    name: docker-ce
    state: present

- name: Install Docker Compose
  get_url:
    url: https://github.com/docker/compose/releases/download/v2.24.7/docker-compose-linux-x86_64
    dest: /usr/local/bin/docker-compose
    mode: '0755'

- name: Add user to docker group
  user:
    name: "{{ ansible_user }}"
    groups: docker
    append: yes
```

This is the main.yml file that is responsible for docker roles.

```
- name: Create directories for Docker containers
  file:
    path: "{{ item }}"
    state: directory
    mode: '0755'
  loop:
    - /docker
    - /docker/adguard
    - /docker/adguard/work
    - /docker/adguard/conf
    - /docker/npm
    - /docker/npm/data
    - /docker/npm/letsencrypt
    - /docker/vault
    - /docker/vault/data
    - /docker/vault/config

- name: Copy docker-compose.yaml to create adguard
  copy:
    src: adguard-docker-compose.yaml
    dest: /docker/adguard/docker-compose.yaml

- name: Copy docker-compose.yaml to create nginx-proxy-manager
  copy:
    src: npm-docker-compose.yaml
    dest: /docker/npm/docker-compose.yaml

- name: Copy docker-compose.yaml to create hashicorp-vault
  copy:
    src: vault-docker-compose.yaml
    dest: /docker/vault/docker-compose.yaml

- name: Copy vault.hcl
  copy:
    src: vault.hcl
    dest: /docker/vault/config/vault.hcl
```

This is what the file responsible for role services looks like

Once everything is configured according to our needs, we can run the playbook with the command

```
ansible-playbook -i inventory.ini playbook-services.yml
```

![alt text](./images/Prepare%20VM1%20and%20VM2/ready-ansible.png)

This is what the result of a successful playbook execution looks like!

At the very end, we can create our own service that will write the DNS address of the VM2 server to the `/etc/resolv.conf` file.

Script content:

```
#!/bin/bash

SERVICE_NAME="set-static-dns.service"
DNS_IP="192.168.1.23"
SERVICE_PATH="/etc/systemd/system/$SERVICE_NAME"

cat <<EOF | sudo tee $SERVICE_PATH > /dev/null
[Unit]
Description=Set static DNS in resolv.conf
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/bin/bash -c 'echo "nameserver $DNS_IP" > /etc/resolv.conf'

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload

sudo systemctl enable $SERVICE_NAME

sudo systemctl start $SERVICE_NAME

cat /etc/resolv.conf

```

Now we can move on to configuring services on VM2.

### [Back to main page](../Docs.md)