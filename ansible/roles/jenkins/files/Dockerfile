FROM jenkins/jenkins:2.504.3-jdk21
USER root
COPY vault.crt /usr/local/share/ca-certificates/vault.crt
RUN apt-get update && apt-get install -y lsb-release ca-certificates curl && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
    https://download.docker.com/linux/debian $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" \
    | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    keytool -importcert -noprompt -trustcacerts -alias vault-root -file /usr/local/share/ca-certificates/vault.crt \
    -keystore /opt/java/openjdk/lib/security/cacerts \
    -storepass changeit && \
    apt-get update && update-ca-certificates  && apt-get install -y docker-ce-cli && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
USER jenkins
RUN jenkins-plugin-cli --plugins "blueocean docker-workflow json-path-api"
