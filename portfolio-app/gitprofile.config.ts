// gitprofile.config.ts
const CONFIG = {
  github: {
    username: 'xHub50N', // Your GitHub org/user name. (This is the only required config)
  },
  /**
   * If you are deploying to https://<USERNAME>.github.io/, for example your repository is at https://github.com/arifszn/arifszn.github.io, set base to '/'.
   * If you are deploying to https://<USERNAME>.github.io/<REPO_NAME>/,
   * for example your repository is at https://github.com/arifszn/portfolio, then set base to '/portfolio/'.
   */
  base: '/',
  projects: {
    github: {
      display: true, // Display GitHub projects?
      header: 'Github Projects',
      mode: 'manual', // Mode can be: 'automatic' or 'manual'
      automatic: {
        sortBy: 'updated', // Sort projects by 'stars' or 'updated'
        limit: 8, // How many projects to display.
        exclude: {
          forks: false, // Forked projects will not be displayed if set to true.
          projects: ['xHub50N/xHub50N'], // These projects will not be displayed. example: ['arifszn/my-project1', 'arifszn/my-project2']
        },
      },
      manual: {
        // Properties for manually specifying projects
        projects: ['xHub50N/portfolio-app-cicd','Dawo9889/cupid-app','xHub50N/docker-homelab','xHub50N/docker-kubernetes-azure','Dawo9889/engineering-thesis','xHub50N/kubernetes-cluster-with-vagrant','xHub50N/k3s-tutorial','xHub50N/weather-prediction-classifier'], // List of repository names to display. example: ['arifszn/my-project1', 'arifszn/my-project2']
      },
    },
    external: {
      header: 'My Projects!',
      // To hide the `External Projects` section, keep it empty.
      projects: [
        // {
        //   title: 'Project Name',
        //   description:
        //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut.',
        //   imageUrl:
        //     'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
        //   link: 'https://example.com',
        // },
        // {
        //   title: 'Project Name',
        //   description:
        //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut.',
        //   imageUrl:
        //     'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg',
        //   link: 'https://example.com',
        // },
      ],
    },
  },
  seo: { title: 'Portfolio of Hubert Bojda', description: '', imageURL: '' },
  social: {
    linkedin: 'hubert-bojda',
    x: '',
    mastodon: '',
    researchGate: '',
    facebook: '',
    instagram: '',
    reddit: '',
    threads: '',
    youtube: '', // example: 'pewdiepie'
    udemy: '',
    dribbble: '',
    behance: '',
    medium: '',
    dev: '',
    stackoverflow: '', // example: '1/jeff-atwood'
    discord: '',
    telegram: '',
    website: '',
    phone: '',
    email: 'hubert.bojda.work@gmail.com',
  },
  resume: {
    fileUrl:
      "./Hubert-Bojda-resume.pdf", // Empty fileUrl will hide the `Download Resume` button.
  },
  skills: [
    'Docker',
    'Kubernetes',
    'CICD',
    'Jenkins',
    'Terraform',
    'Ansible',
    'Python',
    'Javascript',
    'Azure',
    'Git',
    'Proxmox',
    'VMware',
    'Linux',
    'Public Key Infrastructure'
  ],
  experiences: [
    {
      company: 'TK-MED',
      position: 'Junior SysAdmin',
      from: 'January 2025',
      to: 'Present',
    },
    {
      company: 'Vattenfall',
      position: 'Intern',
      from: 'July 2024',
      to: 'August 2024',
    },
  ],
  certifications: [
    {
      name: 'IT Administrator - choose your technological specialisation',
      body: 'ING Hubs Poland',
      year: 'June 2025',
      link: 'https://credsverse.com/credentials/69128112-71b9-4e39-99d0-d85689cabb58',
    },
    {
      name: 'CKA Certification Course - Certified Kubernetes Administrator',
      body: 'Kodekloud',
      year: 'April 2025',
      link: 'https://learn.kodekloud.com/certificate/98b951ba-14c6-4761-813f-b1336f5134e6',
    },
    {
      name: 'Terraform Associate - Hands-On Labs',
      body: 'Udemy',
      year: 'December 2024',
      link: 'https://www.udemy.com/certificate/UC-f56fe648-1bd6-4765-a297-c45bd5b206a3',
    },
    {
      name: 'Docker & Kubernetes: The Practical Guide',
      body: 'Udemy',
      year: 'July 2024',
      link: 'https://www.udemy.com/certificate/UC-47250bb0-27e3-4e85-8f85-eb545c0b408c',
    },
  ],
  educations: [
    {
      institution: 'Silesian University of Technology',
      degree: 'Bachelor',
      from: '2022',
      to: '2026',
    },
  ],
  publications: [
    {
      title: 'Analysis the performance of Naive Bayes and K-Nearest Neighbor Classifiers',
      conferenceName: '',
      journalName: 'CEUR Workshop Proceedings',
      authors: 'Hubert Bojda, Dawid Gala',
      link: 'https://ceur-ws.org/Vol-3885/paper37.pdf',
      description:
        'Publication about AI-powered weather classification: API data is preprocessed, simplified, and split into training/testing sets before being analyzed by a KNN classifier.',
    },
  ],
  googleAnalytics: {
    id: '', // GA3 tracking id/GA4 tag id UA-XXXXXXXXX-X | G-XXXXXXXXXX
  },
  // Track visitor interaction and behavior. https://www.hotjar.com
  hotjar: { id: '', snippetVersion: 6 },
  themeConfig: {
    defaultTheme: 'dark',

    // Hides the switch in the navbar
    // Useful if you want to support a single color mode
    disableSwitch: false,

    // Should use the prefers-color-scheme media-query,
    // using user system preferences, instead of the hardcoded defaultTheme
    respectPrefersColorScheme: false,

    // Display the ring in Profile picture
    displayAvatarRing: true,

    // Available themes. To remove any theme, exclude from here.
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset',
      'caramellatte',
      'abyss',
      'silk',
      'procyon',
    ],
  },

  enablePWA: true,
};

export default CONFIG;
