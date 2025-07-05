provider "proxmox" {
  pm_api_url          = var.pm_api_url
  pm_api_token_id     = var.pm_api_token_id
  pm_api_token_secret = var.pm_api_token_secret
  pm_tls_insecure     = var.pm_tls_insecure
}


resource "proxmox_vm_qemu" "vm_ci" {
  name        = "vm-ci"
  target_node = "proxmox"
  clone       = "ubuntu-server-noble"
  vmid        = 300

  agent   = 1
  sockets = 1
  cores   = 4
  memory  = 4096
  os_type = "cloud-init"
  scsihw  = "virtio-scsi-pci"

  ciupgrade  = false
  ipconfig0  = "ip=dhcp"
  ciuser     = "terraform"
  cipassword = var.pm_user_password
  sshkeys    = file("C:\\Users\\huber\\.ssh\\id_ed25519.pub")

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
    id     = 0
    bridge = "vmbr0"
    model  = "virtio"
    macaddr = "BC:24:11:F1:41:10"
  }

}

resource "proxmox_vm_qemu" "vm_cd" {
  name        = "vm-cd"
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
  cipassword = var.pm_user_password
  sshkeys    = file("C:\\Users\\huber\\.ssh\\id_ed25519.pub")

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
    id     = 0
    bridge = "vmbr0"
    model  = "virtio"
    macaddr = "BC:24:11:F1:41:11"
  }

}