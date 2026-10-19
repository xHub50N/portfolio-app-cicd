export const siteConfig = {
  name: "Hubert Bojda",
  title: "DevOps Engineer",
  description: "Portfolio website of Hubert Bojda",
  accentColor: "#531d95",
  social: {
    email: "hubert.bojda.work@gmail.com",
    linkedin: "https://www.linkedin.com/in/hubert-bojda",
    github: "https://github.com/xHub50N",
  },
  aboutMe:
    "I am a DevOps & Systems Engineer and Computer Science Master's student at the University of Silesia, combining strong hands-on Linux administration with modern automation and security practices. My experience bridges low-level system operations and scalable infrastructure engineering. I focus on containerization (Docker, Kubernetes), automated provisioning, and configuration management. With a solid foundation in Linux/Unix environments, Infrastructure as Code (Terraform), and secure CI/CD pipelines, I bridge the gap between development teams and production reliability. Having evolved through systems administration and DevSecOps, I bring a practical, security-first mindset to troubleshooting, performance optimization, and maintaining high availability for high-throughput SaaS platforms.",
  skills: ["Linux", "Docker", "CI/CD", "Terraform", "Ansible", "Kubernetes", "Azure", "GCP"],
  projects: [
    {
      name: "JustTrip App",
      description:
        "Designed and provisioned cost-efficient GCP infrastructure using Terraform, K3s, and Helm, while automating CI/CD pipelines with GitHub Actions, secure authentication through Workload Identity Federation, and secrets management using External Secrets Operator.",
      skills: ["GCP", "GitHub Actions", "Terraform", "Kubernetes", "Helm"],
    },
    {
      name: "High-Availability Password Manager",
      description:
        "Designed a hybrid infrastructure integrating an on-premises Proxmox cluster with Microsoft Azure, leveraging Terraform, Kubernetes, and Helm for infrastructure management and NetBird VPN for secure Zero Trust network access.",
      skills: ["Azure", "Proxmox", "Terraform", "Kubernetes", "Helm", "NetBird VPN"],
    },
    {
      name: "Portfolio App – CI/CD & GitOps",
      description:
        "Automated virtual machine provisioning and configuration using Terraform and Ansible, implementing CI/CD and GitOps workflows with Jenkins, ArgoCD, K3s, and HashiCorp Vault for secure secrets management.",
      skills: ["Terraform", "Ansible", "Jenkins", "Kubernetes", "HashiCorp Vault", "ArgoCD"],
    },
  ],
  experience: [
  {
    company: "iPresso",
    title: "DevOps & Systems Engineer",
    dateRange: "Oct 2026 - Present",
    bullets: [
      "Administer Linux-based infrastructure and support the operation, maintenance, and troubleshooting of production systems.",
      "Work with on-premises infrastructure, including servers, virtualization platforms, storage, and network services.",
      "Support containerized application environments using Docker and Docker Compose, with a focus on deployment reliability and troubleshooting.",
      "Work with infrastructure automation, monitoring, reverse proxies, and network security to improve system reliability and operational efficiency.",
    ],
  },
  {
    company: "Accenture",
    title: "DevSecOps Engineer",
    dateRange: "Mar 2026 - Sep 2026",
    bullets: [
      "Provisioned and managed Azure infrastructure across multiple environments using Terraform, including reusable infrastructure configurations.",
      "Managed Azure Kubernetes Service (AKS) workloads, Helm deployments, and Azure DevOps pipelines supporting application delivery.",
      "Administered Azure IAM and RBAC, managing identities, access permissions, and authorization across cloud environments.",
      "Supported Linux-based cloud infrastructure and security operations, including vulnerability management, compliance activities, and internal access security audits.",
    ],
  },
  {
    company: "TK-MED",
    title: "System Administrator",
    dateRange: "Jan 2025 - Feb 2026",
    bullets: [
      "Administered virtualized infrastructure using VMware vSphere, Microsoft Hyper-V, and Proxmox to support system availability and reliability.",
      "Maintained and secured Linux and Windows Server environments through system hardening, patch management, and security configuration.",
      "Provided second- and third-line infrastructure support, troubleshooting server and network incidents and performing root cause analysis.",
      "Automated routine administrative tasks using Python and Bash, and worked with Prometheus and Grafana for infrastructure monitoring and troubleshooting.",
    ],
  },
],
  education: [
    {
      school: "University of Silesia",
      degree: "Master of Science in Computer Science",
      dateRange: "2026 - 2027",
      achievements: [
      ],
    },
    {
      school: "Silesian University of Technology",
      degree: "Bachelor of Science in Computer Science",
      dateRange: "2022 - 2026",
      achievements: [
      ],
    },
  ],
};
