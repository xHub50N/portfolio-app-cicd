provider "proxmox" {
  pm_api_url          = var.pm_api_url
  pm_api_token_id     = data.vault_kv_secret_v2.proxmox_creds.data["id"]
  pm_api_token_secret = data.vault_kv_secret_v2.proxmox_creds.data["token"]
  pm_tls_insecure     = var.pm_tls_insecure
}
provider "vault" {
  address = "https://vault.xhub50n.lat"
  token   = var.vault_token
}

data "vault_kv_secret_v2" "proxmox_creds" {
  mount = "secret"
  name  = "proxmox_terraform_key"
}

resource "proxmox_vm_qemu" "vm_ci" {
  name        = "vm-ci"
  target_node = "proxmox"
  clone       = "ubuntu-server-noble"
  vmid        = 301

  agent   = 1
  sockets = 1
  cores   = 4
  memory  = 4096
  os_type = "cloud-init"
  scsihw  = "virtio-scsi-pci"

  ciupgrade  = false
  ipconfig0  = "ip=dhcp"
  ciuser     = "terraform"
  sshkeys    = file("/home/hubert/.ssh/id_ed25519.pub")

  disks {
    ide {
      ide2 {
        cloudinit {
          storage = "local-lvm"
        }
      }
    }
    virtio {
      virtio0 {
        disk {
          storage   = "local-lvm"
          size      = "32G"
          iothread  = true
          replicate = false
        }
      }
    }
  }

  network {
    id      = 0
    bridge  = "vmbr0"
    model   = "virtio"
    macaddr = "BC:24:11:F1:41:10"
  }

}

resource "proxmox_vm_qemu" "vm_cd" {
  name        = "vm-cd"
  target_node = "proxmox"
  clone       = "ubuntu-server-noble"
  vmid        = 302

  agent   = 1
  sockets = 1
  cores   = 4
  memory  = 4096
  os_type = "cloud-init"
  scsihw  = "virtio-scsi-pci"

  ciupgrade  = false
  ipconfig0  = "ip=dhcp"
  ciuser     = "terraform"
  sshkeys    = file("/home/hubert/.ssh/id_ed25519.pub")

  disks {
    ide {
      ide2 {
        cloudinit {
          storage = "local-lvm"
        }
      }
    }
    virtio {
      virtio0 {
        disk {
          storage   = "local-lvm"
          size      = "32G"
          iothread  = true
          replicate = false
        }
      }
    }
  }

  network {
    id      = 0
    bridge  = "vmbr0"
    model   = "virtio"
    macaddr = "BC:24:11:F1:41:11"
  }

}
