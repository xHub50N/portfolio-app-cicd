# Przygotowanie i wstępne skonfigurowanie wirtualnych maszyn VM1 i VM2

 Maszyna VM1 która będzie posiadać nazwę srv-provisioning będzie odpowiedzialna za tworznie infrastruktury wirtualnych maszyn VM3 oraz VM4 za pomocą terraforma, dodatkowo maszyna VM1 będzie mieć na pokładzie zainstalowany ansible do dokonywania konfiguracji i instalacji potrzebnego oprogramowania w zautoamtyzowany sposób.

 Natomiast maszyna VM2 nazwa robocza to srv-services będzie posiadać niezbędne usługi zainstalowanych w ramach kontenerów docker-owych do poprawnego działania całego środowiska m.in:
 - Adguard Home który posłuzy jako lokalny serwer DNS
 - Nginx Proxy Manager jako usługa odwrotnego proxy
 - Hashicorp Vault jako skarbiec sekretów potrzebnych do tworzenia i zarządzania środowiskiem

 ![alt text](./images/Prepare%20VM1%20and%20VM2/clone-vm.png)

 W pierwszej kolejności musimy sklonować wirtaulną maszynę na podstawie naszego szablonu, który został stworzony za pomocą packer-a.

 ![alt text](./images/Prepare%20VM1%20and%20VM2/cloud-init.png)
 Po sklonowaniu VM możemy przejść do sekcji cloud-init, musimy zaznaczyć aby adresacja została przydzielona przez DHCP (wcześniej na routerze została dodana rezerwacja adresu poprzez MAC) i klikamy regenerate-image, możemy uruchomić wirtualną maszynę

![alt text](./images/Prepare%20VM1%20and%20VM2/ssh-login.png)

Udało się zalogować na VM1, teraz możemy powtórzyć ten krok dla VM2.

### Przygotowanie Terraform oraz Ansible 

W repozytorium w folderze /scripts znajdują się 2 skrypty do instalacji Terraforma i Ansible

#### Instalacja Ansible
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

#### Instalacja Terraform

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

Udało się zainstalować oprogramowanie.

Następnym krokiem będzie przygotowanie playbooków ansible oraz plików terraform do przygotowania infrastruktury. 

Z repozytorium kopiujemy zawartość folderów ansible oraz terraform na maszynę wirtualną VM1

![alt text](./images/Prepare%20VM1%20and%20VM2/terraform+ansible-files.png)

Tak to powinno wyglądać 

![alt text](./images/Prepare%20VM1%20and%20VM2/copy-key.png)

Dodatkowo przyda nam się skopiowanie klucza prywatnego i publicznego, który został utworzony podczas konfiguracji packera

#### Konfiguracja Ansible

Następnym krokiem będzie przygotowanie konfiguracji ansible, w pierwszej kolejności przygotujemy plik inventory.ini w którym będą zapisane informacje o ip wirtualnych maszyn oraz, którym użytkownikiem będziemy się logować.
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

Tak prezentuje się plik, w pierwszej kolejności interesuje nas ostatni host, musimy podać ścieżkę do pliku klucza prywatnego, to dzięki niemu będziemy się uwierzytelniać podczas wykonywania playbooka ansible 

Hosty które są powyżej nie będą musiały logować się za pomocą klucza prywatnego, w póżniejszym etapie zostanie uruchomiony Hashicorp Vault, dzięki niemu będziemy mogli się uwierzytelniać bez przechowywania kluczy prywatnych na różnych urządzeniach. Wszystko będzie zcentralizowane.

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

Tak prezentuje się plik playbook-services.yml

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

To jest plik main.yml który jest odpowiedzialny za role docker

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

Natomiast tak prezentuje się plik który jest odpowiedzialny za role services

Jeśli wszystko skonfigurujemy według naszych potrzeb możemy uruchomić playbook poleceniem 

```
ansible-playbook -i inventory.ini playbook-services.yml
```

![alt text](./images/Prepare%20VM1%20and%20VM2/ready-ansible.png)

Tak prezentuje się wynik udanego wykonania playbooka!

Na samym końcu możemy stworzyć własną usługę która będzie zapisywać do pliku `/etc/resolv.conf ` adres DNS serwera VM2

Zawartość skryptu:

```
#!/bin/bash

SERVICE_NAME="set-static-dns.service"
DNS_IP="192.168.1.23"
SERVICE_PATH="/etc/systemd/system/$SERVICE_NAME"

echo "Tworzę usługę systemd w: $SERVICE_PATH"
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

echo "Przeładowuję systemd..."
sudo systemctl daemon-reload

echo "Włączam usługę, aby uruchamiała się przy starcie..."
sudo systemctl enable $SERVICE_NAME

echo "Uruchamiam usługę..."
sudo systemctl start $SERVICE_NAME

echo -e "\nZawartość /etc/resolv.conf:"
cat /etc/resolv.conf

echo -e "\nUsługa została utworzona i uruchomiona."

```

Teraz możemy przejść do konfiguracji usług na VM2

### [Powrót do strony głównej](../Docs.md)