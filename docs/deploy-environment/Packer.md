# Preparing virtual machine images using the Packer tool

**Important information** - in this section, you will need to have your own DNS domain so that you can generate a certificate from Letsencrypt or ZeroSSL. For my purposes, I use the domain hbojda.ovh

First, we need to install the Packer tool, which we will need to create a virtual machine image on the Proxmox virtualizer. This step will help us standardize the configuration of systems and automate the deployment of new machines.

![Create token](./images/Packer/create-token.png)
On Proxmox, I create tokens for authentication and configuration of virtual machines. I create a separate token for Packer and for Terraform.

![alt text](./images/Packer/download-image.png)
Then I download the Ubuntu Server 24 image and upload it to Proxmox. 

The next step will be to install Packer on any Linux machine.

```
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(grep -oP '(?<=UBUNTU_CODENAME=).*' /etc/os-release || lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt-get update && sudo apt-get install packer
```

After installation, we need to create a private and public key for secure communication between the new virtual machines and the host. Asymmetric encryption will be a better option because we will only provide the public key explicitly in the packer file, but we still have secure possession of the private key for authentication. 

`ssh-keygen -b 2048 -t rsa` - Command to create a private and public key 

```
ssh_private_key_file = “/home/user/.ssh/id_rsa”
```

In the ubuntu-server-noble.pkr.hcl file, in the ssh_private_key_file field, we specify the path to the private key 

```
user-data:
    package_upgrade: false
    timezone: Europe/Warsaw
    users:
      - name: user
        groups: [adm, sudo]
        lock-passwd: false
        sudo: ALL=(ALL) NOPASSWD:ALL
        shell: /bin/bash
        ssh_authorized_keys:
           - {your-public-key}
```
In the http/user-data file, in the ssh_authorized_keys section, paste the contents of the public key.

Generating a certificate

In my case, I generated a certificate for the domain vault.hbojda.ovh using a CSR certificate generation request. I leave the generation of the certificate up to the user. I chose ZeroSSL, but Letsencrypt is also suitable.

![alt text](./images/Packer/zerossl-cert.png)

Next, copy the generated certificate to the files folder, because the packer file will use this certificate so that it can be installed on the system by default.

**Note: if you are using ZeroSSL, you must combine your domain certificate and ZeroSSL - if you use only your domain certificate, you may encounter trust errors.**

The rest of the configuration files can be left unchanged, but it is worth paying attention to the section

```
  boot_iso {
    type     = “scsi”
    iso_file = “local:iso/ubuntu-24.04.1-live-server-amd64.iso”
    unmount  = true
  }
```
Here, we need to specify the correct name of the system image we downloaded.

Finally, we create the credentials.pkr.hcl file

```
proxmox_api_url = “https://0.0.0.0:8006/api2/json”  # Proxmox address
proxmox_api_token_id = “user@pam!packer”  # API Token ID
proxmox_api_token_secret = “token”
```

Finally, execute the command 

`packer build -var-file=credentials.pkr.hcl ubuntu-server-noble.pkr.hcl`

After a few minutes, we should receive the following information

![alt text](./images/Packer/packer-finish.png) 

![alt text](./images/Packer/ready-template.png)

This is what the created virtual machine template looks like

### [Back to main page](../Docs.md)
