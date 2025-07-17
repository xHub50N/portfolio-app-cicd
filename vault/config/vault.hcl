ui = true
disable_mlock = "true"

storage "raft" {
  path    = "/vault/data"
  node_id = "node1"
}

listener "tcp" {
  address = "[::]:8200"
  tls_cert_file = "/vault/tls/cert.crt"
  tls_key_file  = "/vault/tls/key.key"
}

api_addr = "https://192.168.0.234:8200"
cluster_addr = "https://192.168.0.234:8201"
