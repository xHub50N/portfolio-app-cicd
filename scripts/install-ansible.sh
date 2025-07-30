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