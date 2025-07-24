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