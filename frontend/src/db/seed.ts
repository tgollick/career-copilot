import { db } from "../lib/index";
import { companies, jobs } from "./schema";

const companiesData = [
  {
    name: "TechForward Labs",
    description: "AI-driven solutions for modern businesses",
    industry: "Technology",
    size: "startup" as const,
    location: "London, UK",
    website: "https://techforward.com",
  },
  {
    name: "DataStream Solutions",
    description: "Big data analytics and cloud infrastructure",
    industry: "Technology",
    size: "medium" as const,
    location: "Manchester, UK",
    website: "https://datastream.co.uk",
  },
  {
    name: "GreenTech Innovations",
    description: "Sustainable technology for a better future",
    industry: "CleanTech",
    size: "small" as const,
    location: "Bristol, UK",
    website: "https://greentech-innovations.com",
  },
  {
    name: "CyberShield Security",
    description: "Enterprise cybersecurity solutions",
    industry: "Cybersecurity",
    size: "medium" as const,
    location: "Edinburgh, UK",
    website: "https://cybershield.security",
  },
  {
    name: "CloudFirst Systems",
    description: "Cloud infrastructure and DevOps services",
    industry: "Cloud Computing",
    size: "large" as const,
    location: "London, UK",
    website: "https://cloudfirst.systems",
  },
  {
    name: "PayFlow Financial",
    description: "Next-generation fintech solutions for digital payments",
    industry: "FinTech",
    size: "startup" as const,
    location: "London, UK",
    website: "https://payflow.finance",
  },
  {
    name: "HealthTech Solutions",
    description: "Digital healthcare platforms improving patient outcomes",
    industry: "HealthTech",
    size: "medium" as const,
    location: "Cambridge, UK",
    website: "https://healthtech-solutions.com",
  },
  {
    name: "GameForge Studios",
    description: "Indie game development studio creating immersive experiences",
    industry: "Gaming",
    size: "small" as const,
    location: "Brighton, UK",
    website: "https://gameforge.studio",
  },
  {
    name: "ShopSmart Global",
    description: "Leading e-commerce platform serving millions worldwide",
    industry: "E-commerce",
    size: "large" as const,
    location: "London, UK",
    website: "https://shopsmart.global",
  },
  {
    name: "Innovation Consulting Group",
    description:
      "Strategic technology consulting for enterprise transformation",
    industry: "Consulting",
    size: "large" as const,
    location: "London, UK",
    website: "https://innovation-consulting.co.uk",
  },
];

const jobsData = [
  // TechForward Labs Jobs (5 jobs)
  {
    companyId: 1,
    title: "Senior Full Stack Developer",
    description:
      "Join our AI-driven team to build cutting-edge web applications using React, Node.js, and Python. Work on exciting projects that shape the future of business automation.",
    requirements: [
      "5+ years full-stack experience",
      "Strong React/Node.js skills",
      "Python knowledge",
      "Git proficiency",
    ],
    skills: ["React", "Node.js", "Python", "TypeScript", "PostgreSQL"],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 55000,
    salaryMax: 75000,
    employmentType: "full-time" as const,
    experienceLevel: "senior" as const,
  },
  {
    companyId: 1,
    title: "Machine Learning Engineer",
    description:
      "Develop and deploy ML models for our AI platform. Work with cutting-edge technologies including TensorFlow, PyTorch, and cloud MLOps pipelines.",
    requirements: [
      "3+ years ML experience",
      "Python expertise",
      "TensorFlow/PyTorch knowledge",
      "Cloud platform experience",
    ],
    skills: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "AWS",
      "Docker",
      "scikit-learn",
    ],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 65000,
    salaryMax: 85000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 1,
    title: "Frontend Developer",
    description:
      "Build beautiful, responsive user interfaces for our AI products. Work with React, TypeScript, and modern design systems.",
    requirements: [
      "2+ years frontend experience",
      "Strong React skills",
      "TypeScript proficiency",
      "CSS/HTML expertise",
    ],
    skills: ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Tailwind"],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 40000,
    salaryMax: 55000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 1,
    title: "Junior Software Developer",
    description:
      "Start your career with us! Learn from experienced developers while contributing to real-world AI projects. Perfect for recent graduates.",
    requirements: [
      "Computer Science degree or equivalent",
      "Basic programming knowledge",
      "Enthusiasm for learning",
      "Problem-solving skills",
    ],
    skills: ["JavaScript", "Python", "Git", "SQL"],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 25000,
    salaryMax: 35000,
    employmentType: "full-time" as const,
    experienceLevel: "entry" as const,
  },
  {
    companyId: 1,
    title: "DevOps Engineer",
    description:
      "Manage our cloud infrastructure and CI/CD pipelines. Work with AWS, Kubernetes, and modern deployment practices.",
    requirements: [
      "3+ years DevOps experience",
      "AWS/cloud expertise",
      "Kubernetes knowledge",
      "CI/CD pipeline experience",
    ],
    skills: ["AWS", "Kubernetes", "Docker", "Jenkins", "Terraform", "Python"],
    location: "London, UK",
    remoteType: "remote" as const,
    salaryMin: 50000,
    salaryMax: 70000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },

  // DataStream Solutions Jobs (5 jobs)
  {
    companyId: 2,
    title: "Data Engineer",
    description:
      "Design and maintain large-scale data pipelines for our analytics platform. Experience with cloud services and big data technologies essential.",
    requirements: [
      "3+ years data engineering experience",
      "AWS/Azure knowledge",
      "Python/Scala proficiency",
      "SQL expertise",
    ],
    skills: ["Python", "AWS", "Apache Spark", "SQL", "Docker", "Kafka"],
    location: "Manchester, UK",
    remoteType: "remote" as const,
    salaryMin: 45000,
    salaryMax: 65000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 2,
    title: "Senior Data Scientist",
    description:
      "Lead data science initiatives and build predictive models. Work with large datasets to derive actionable business insights.",
    requirements: [
      "5+ years data science experience",
      "PhD/Masters in relevant field",
      "Python/R expertise",
      "Machine learning knowledge",
    ],
    skills: ["Python", "R", "scikit-learn", "pandas", "TensorFlow", "SQL"],
    location: "Manchester, UK",
    remoteType: "hybrid" as const,
    salaryMin: 70000,
    salaryMax: 90000,
    employmentType: "full-time" as const,
    experienceLevel: "senior" as const,
  },
  {
    companyId: 2,
    title: "Backend Developer",
    description:
      "Build scalable APIs and microservices for our data platform. Work with Node.js, Python, and cloud databases.",
    requirements: [
      "3+ years backend experience",
      "API development skills",
      "Database knowledge",
      "Cloud platform experience",
    ],
    skills: ["Node.js", "Python", "PostgreSQL", "Redis", "AWS", "Docker"],
    location: "Manchester, UK",
    remoteType: "remote" as const,
    salaryMin: 42000,
    salaryMax: 58000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 2,
    title: "Cloud Architect",
    description:
      "Design and implement cloud infrastructure for our data solutions. Lead architectural decisions for scalable systems.",
    requirements: [
      "7+ years cloud experience",
      "AWS/Azure certifications",
      "Infrastructure as code",
      "Leadership experience",
    ],
    skills: ["AWS", "Terraform", "Kubernetes", "Python", "Docker", "Jenkins"],
    location: "Manchester, UK",
    remoteType: "hybrid" as const,
    salaryMin: 80000,
    salaryMax: 100000,
    employmentType: "full-time" as const,
    experienceLevel: "senior" as const,
  },
  {
    companyId: 2,
    title: "Data Analyst",
    description:
      "Analyze business data and create reports for stakeholders. Work with SQL, Python, and visualization tools.",
    requirements: [
      "2+ years analysis experience",
      "Strong SQL skills",
      "Python/R knowledge",
      "Visualization expertise",
    ],
    skills: ["SQL", "Python", "Tableau", "Excel", "pandas", "numpy"],
    location: "Manchester, UK",
    remoteType: "hybrid" as const,
    salaryMin: 32000,
    salaryMax: 45000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },

  // GreenTech Innovations Jobs (5 jobs)
  {
    companyId: 3,
    title: "Full Stack Developer",
    description:
      "Build web applications for sustainable energy management. Work with React, Node.js, and IoT integrations.",
    requirements: [
      "3+ years full-stack experience",
      "React/Node.js skills",
      "API development",
      "Database knowledge",
    ],
    skills: ["React", "Node.js", "JavaScript", "MongoDB", "Express", "CSS"],
    location: "Bristol, UK",
    remoteType: "hybrid" as const,
    salaryMin: 38000,
    salaryMax: 52000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 3,
    title: "IoT Software Engineer",
    description:
      "Develop software for smart energy devices. Work with embedded systems, sensors, and real-time data processing.",
    requirements: [
      "3+ years embedded experience",
      "C/C++ proficiency",
      "IoT protocols knowledge",
      "Hardware integration skills",
    ],
    skills: ["C++", "Python", "MQTT", "Arduino", "Raspberry Pi", "Linux"],
    location: "Bristol, UK",
    remoteType: "on-site" as const,
    salaryMin: 40000,
    salaryMax: 55000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 3,
    title: "Mobile App Developer",
    description:
      "Create mobile apps for energy monitoring and control. Work with React Native and native iOS/Android development.",
    requirements: [
      "2+ years mobile experience",
      "React Native skills",
      "iOS/Android knowledge",
      "API integration",
    ],
    skills: ["React Native", "JavaScript", "iOS", "Android", "Firebase"],
    location: "Bristol, UK",
    remoteType: "hybrid" as const,
    salaryMin: 35000,
    salaryMax: 50000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 3,
    title: "Junior Python Developer",
    description:
      "Join our team to develop data processing applications for renewable energy systems. Great opportunity for new graduates.",
    requirements: [
      "Python knowledge",
      "Basic web development",
      "Problem-solving skills",
      "Environmental passion",
    ],
    skills: ["Python", "Django", "PostgreSQL", "Git", "HTML", "CSS"],
    location: "Bristol, UK",
    remoteType: "hybrid" as const,
    salaryMin: 24000,
    salaryMax: 32000,
    employmentType: "full-time" as const,
    experienceLevel: "entry" as const,
  },
  {
    companyId: 3,
    title: "Product Manager",
    description:
      "Lead product strategy for our clean energy software solutions. Work with engineering and business teams.",
    requirements: [
      "4+ years product experience",
      "Technical background",
      "Stakeholder management",
      "Analytics skills",
    ],
    skills: ["Product Management", "Analytics", "SQL", "Figma", "Jira"],
    location: "Bristol, UK",
    remoteType: "hybrid" as const,
    salaryMin: 50000,
    salaryMax: 65000,
    employmentType: "full-time" as const,
    experienceLevel: "senior" as const,
  },

  // CyberShield Security Jobs (5 jobs)
  {
    companyId: 4,
    title: "Cybersecurity Engineer",
    description:
      "Develop security solutions to protect enterprise systems. Work with threat detection, vulnerability assessment, and incident response.",
    requirements: [
      "3+ years security experience",
      "Security certifications (CISSP/CEH)",
      "Programming skills",
      "Network security knowledge",
    ],
    skills: ["Python", "Java", "Linux", "Networking", "Security Tools"],
    location: "Edinburgh, UK",
    remoteType: "hybrid" as const,
    salaryMin: 48000,
    salaryMax: 68000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 4,
    title: "Security Software Developer",
    description:
      "Build security applications and tools. Work with encryption, authentication systems, and secure coding practices.",
    requirements: [
      "4+ years development experience",
      "Security knowledge",
      "Java/C++ skills",
      "Cryptography understanding",
    ],
    skills: ["Java", "C++", "Python", "Cryptography", "Spring Boot", "MySQL"],
    location: "Edinburgh, UK",
    remoteType: "hybrid" as const,
    salaryMin: 45000,
    salaryMax: 62000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 4,
    title: "Senior Security Consultant",
    description:
      "Lead client security assessments and provide strategic security guidance. Work with enterprise clients on security transformations.",
    requirements: [
      "6+ years security consulting",
      "Client-facing experience",
      "Multiple security certifications",
      "Leadership skills",
    ],
    skills: ["Security Assessment", "Risk Management", "Compliance", "Python"],
    location: "Edinburgh, UK",
    remoteType: "hybrid" as const,
    salaryMin: 65000,
    salaryMax: 85000,
    employmentType: "full-time" as const,
    experienceLevel: "senior" as const,
  },
  {
    companyId: 4,
    title: "Penetration Tester",
    description:
      "Perform ethical hacking and security testing on client systems. Identify vulnerabilities and provide remediation guidance.",
    requirements: [
      "3+ years pentesting experience",
      "Ethical hacking certifications",
      "Scripting skills",
      "Report writing abilities",
    ],
    skills: ["Penetration Testing", "Python", "Bash", "Networking", "Linux"],
    location: "Edinburgh, UK",
    remoteType: "remote" as const,
    salaryMin: 42000,
    salaryMax: 60000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 4,
    title: "Frontend Security Developer",
    description:
      "Build secure web interfaces for our security platforms. Focus on frontend security best practices and user authentication.",
    requirements: [
      "3+ years frontend experience",
      "Security-focused development",
      "React/Angular skills",
      "Authentication systems",
    ],
    skills: ["React", "JavaScript", "TypeScript", "OAuth", "JWT", "CSS"],
    location: "Edinburgh, UK",
    remoteType: "hybrid" as const,
    salaryMin: 40000,
    salaryMax: 55000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },

  // CloudFirst Systems Jobs (6 jobs)
  {
    companyId: 5,
    title: "Senior DevOps Engineer",
    description:
      "Lead cloud infrastructure and DevOps initiatives. Work with AWS, Kubernetes, and enterprise-scale deployments.",
    requirements: [
      "5+ years DevOps experience",
      "AWS certifications",
      "Kubernetes expertise",
      "Leadership skills",
    ],
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins", "Python"],
    location: "London, UK",
    remoteType: "remote" as const,
    salaryMin: 65000,
    salaryMax: 85000,
    employmentType: "full-time" as const,
    experienceLevel: "senior" as const,
  },
  {
    companyId: 5,
    title: "Cloud Solutions Architect",
    description:
      "Design cloud architectures for enterprise clients. Work with AWS, Azure, and hybrid cloud solutions.",
    requirements: [
      "7+ years architecture experience",
      "Multiple cloud certifications",
      "Client consulting experience",
      "Technical leadership",
    ],
    skills: ["AWS", "Azure", "Architecture", "Terraform", "Kubernetes"],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 85000,
    salaryMax: 110000,
    employmentType: "full-time" as const,
    experienceLevel: "senior" as const,
  },
  {
    companyId: 5,
    title: "Site Reliability Engineer",
    description:
      "Ensure high availability and performance of cloud systems. Work with monitoring, automation, and incident response.",
    requirements: [
      "4+ years SRE experience",
      "Programming skills",
      "Monitoring tools knowledge",
      "Automation expertise",
    ],
    skills: ["Python", "Go", "Kubernetes", "Prometheus", "Grafana", "AWS"],
    location: "London, UK",
    remoteType: "remote" as const,
    salaryMin: 55000,
    salaryMax: 75000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 5,
    title: "Platform Engineer",
    description:
      "Build and maintain internal developer platforms. Focus on developer experience and platform automation.",
    requirements: [
      "3+ years platform experience",
      "Container orchestration",
      "CI/CD expertise",
      "Developer tools knowledge",
    ],
    skills: ["Kubernetes", "Docker", "Python", "Go", "Jenkins", "Terraform"],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 50000,
    salaryMax: 68000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 5,
    title: "Cloud Security Engineer",
    description:
      "Implement security best practices for cloud infrastructure. Work with compliance, access management, and security monitoring.",
    requirements: [
      "4+ years cloud security experience",
      "Security certifications",
      "AWS/Azure knowledge",
      "Compliance understanding",
    ],
    skills: ["AWS", "Security", "Terraform", "Python", "Compliance"],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 58000,
    salaryMax: 78000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 5,
    title: "Infrastructure Automation Engineer",
    description:
      "Automate infrastructure provisioning and management. Work with Infrastructure as Code and automation tools.",
    requirements: [
      "3+ years automation experience",
      "IaC expertise",
      "Scripting skills",
      "Cloud platforms knowledge",
    ],
    skills: ["Terraform", "Ansible", "Python", "AWS", "Bash", "Docker"],
    location: "London, UK",
    remoteType: "remote" as const,
    salaryMin: 45000,
    salaryMax: 62000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },

  // PayFlow Financial Jobs (5 jobs)
  {
    companyId: 6,
    title: "Fintech Backend Developer",
    description:
      "Build secure payment processing systems and financial APIs. Work with high-transaction volumes and regulatory compliance.",
    requirements: [
      "4+ years backend experience",
      "Financial services knowledge",
      "API security expertise",
      "Database optimization skills",
    ],
    skills: ["Java", "Spring Boot", "PostgreSQL", "Redis", "AWS", "Docker"],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 55000,
    salaryMax: 75000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 6,
    title: "React Developer",
    description:
      "Create intuitive payment interfaces and financial dashboards. Work with React, TypeScript, and modern frontend tools.",
    requirements: [
      "3+ years React experience",
      "TypeScript proficiency",
      "Financial UI experience",
      "Testing knowledge",
    ],
    skills: ["React", "TypeScript", "JavaScript", "Redux", "CSS", "Jest"],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 45000,
    salaryMax: 60000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 6,
    title: "Data Engineer - Payments",
    description:
      "Build data pipelines for payment analytics and fraud detection. Work with real-time streaming and machine learning.",
    requirements: [
      "3+ years data engineering",
      "Streaming technologies",
      "Python expertise",
      "Financial data experience",
    ],
    skills: ["Python", "Kafka", "Spark", "AWS", "PostgreSQL", "Docker"],
    location: "London, UK",
    remoteType: "remote" as const,
    salaryMin: 50000,
    salaryMax: 70000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 6,
    title: "Mobile Engineer - iOS",
    description:
      "Develop our iOS payment app. Work with Swift, financial integrations, and security best practices.",
    requirements: [
      "3+ years iOS development",
      "Swift expertise",
      "Financial app experience",
      "Security knowledge",
    ],
    skills: ["Swift", "iOS", "Xcode", "Core Data", "Security", "APIs"],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 48000,
    salaryMax: 65000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 6,
    title: "Fraud Detection Analyst",
    description:
      "Analyze payment patterns and develop fraud detection algorithms. Work with machine learning and real-time monitoring.",
    requirements: [
      "2+ years analytics experience",
      "Machine learning knowledge",
      "SQL proficiency",
      "Financial crime understanding",
    ],
    skills: ["Python", "SQL", "Machine Learning", "Tableau", "Statistics"],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 38000,
    salaryMax: 52000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },

  // HealthTech Solutions Jobs (5 jobs)
  {
    companyId: 7,
    title: "Healthcare Software Developer",
    description:
      "Develop patient management systems and healthcare applications. Work with sensitive data and regulatory compliance.",
    requirements: [
      "3+ years healthcare software",
      "HIPAA compliance knowledge",
      "Database skills",
      "API development",
    ],
    skills: ["C#", ".NET", "SQL Server", "Azure", "APIs", "Healthcare"],
    location: "Cambridge, UK",
    remoteType: "hybrid" as const,
    salaryMin: 42000,
    salaryMax: 58000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 7,
    title: "Frontend Developer - React",
    description:
      "Build user interfaces for healthcare professionals and patients. Focus on accessibility and usability.",
    requirements: [
      "2+ years React experience",
      "Healthcare UI experience",
      "Accessibility knowledge",
      "User-centered design",
    ],
    skills: ["React", "JavaScript", "TypeScript", "CSS", "Accessibility"],
    location: "Cambridge, UK",
    remoteType: "hybrid" as const,
    salaryMin: 35000,
    salaryMax: 48000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 7,
    title: "Data Scientist - Healthcare",
    description:
      "Analyze healthcare data to improve patient outcomes. Work with clinical data, predictive modeling, and research.",
    requirements: [
      "PhD in relevant field",
      "Healthcare analytics experience",
      "Statistical modeling skills",
      "Research background",
    ],
    skills: [
      "Python",
      "R",
      "Statistics",
      "Machine Learning",
      "SQL",
      "Healthcare",
    ],
    location: "Cambridge, UK",
    remoteType: "hybrid" as const,
    salaryMin: 55000,
    salaryMax: 75000,
    employmentType: "full-time" as const,
    experienceLevel: "senior" as const,
  },
  {
    companyId: 7,
    title: "DevOps Engineer - Healthcare",
    description:
      "Manage secure healthcare infrastructure and deployments. Work with compliance and high-availability systems.",
    requirements: [
      "3+ years DevOps experience",
      "Healthcare compliance",
      "Azure/AWS knowledge",
      "Security focus",
    ],
    skills: [
      "Azure",
      "Docker",
      "Kubernetes",
      "Python",
      "Security",
      "Compliance",
    ],
    location: "Cambridge, UK",
    remoteType: "remote" as const,
    salaryMin: 48000,
    salaryMax: 65000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 7,
    title: "QA Engineer - Medical Software",
    description:
      "Ensure quality and compliance of medical software systems. Work with regulatory testing and validation processes.",
    requirements: [
      "3+ years QA experience",
      "Medical device testing",
      "Regulatory knowledge",
      "Automation skills",
    ],
    skills: [
      "Test Automation",
      "Python",
      "Selenium",
      "Healthcare",
      "Compliance",
    ],
    location: "Cambridge, UK",
    remoteType: "hybrid" as const,
    salaryMin: 38000,
    salaryMax: 52000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },

  // GameForge Studios Jobs (5 jobs)
  {
    companyId: 8,
    title: "Game Developer - Unity",
    description:
      "Create engaging indie games using Unity. Work on gameplay mechanics, graphics, and player experience.",
    requirements: [
      "2+ years Unity experience",
      "C# programming skills",
      "Game development passion",
      "Creative problem solving",
    ],
    skills: ["Unity", "C#", "Game Development", "3D Graphics", "Animation"],
    location: "Brighton, UK",
    remoteType: "hybrid" as const,
    salaryMin: 32000,
    salaryMax: 45000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 8,
    title: "Frontend Web Developer",
    description:
      "Build web platforms for game distribution and player communities. Work with React and gaming APIs.",
    requirements: [
      "2+ years web development",
      "React skills",
      "Gaming industry interest",
      "API integration",
    ],
    skills: ["React", "JavaScript", "Node.js", "CSS", "APIs", "Gaming"],
    location: "Brighton, UK",
    remoteType: "hybrid" as const,
    salaryMin: 28000,
    salaryMax: 40000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 8,
    title: "Game Designer & Developer",
    description:
      "Design and implement game mechanics, levels, and player progression systems. Work closely with artists and programmers.",
    requirements: [
      "3+ years game design",
      "Scripting abilities",
      "Creative vision",
      "Team collaboration",
    ],
    skills: ["Game Design", "Unity", "C#", "Level Design", "Scripting"],
    location: "Brighton, UK",
    remoteType: "on-site" as const,
    salaryMin: 35000,
    salaryMax: 50000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 8,
    title: "Junior Gameplay Programmer",
    description:
      "Implement gameplay features and mechanics. Perfect for new graduates interested in game development.",
    requirements: [
      "Programming degree or equivalent",
      "Basic C# knowledge",
      "Gaming passion",
      "Learning mindset",
    ],
    skills: ["C#", "Unity", "Programming", "Game Development", "Git"],
    location: "Brighton, UK",
    remoteType: "hybrid" as const,
    salaryMin: 22000,
    salaryMax: 30000,
    employmentType: "full-time" as const,
    experienceLevel: "entry" as const,
  },
  {
    companyId: 8,
    title: "Technical Artist",
    description:
      "Bridge art and programming to create stunning game visuals. Work with shaders, tools, and optimization.",
    requirements: [
      "3+ years technical art",
      "Shader programming",
      "Unity expertise",
      "Art background",
    ],
    skills: ["Unity", "Shaders", "C#", "3D Graphics", "Art", "Optimization"],
    location: "Brighton, UK",
    remoteType: "on-site" as const,
    salaryMin: 38000,
    salaryMax: 52000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },

  // ShopSmart Global Jobs (6 jobs)
  {
    companyId: 9,
    title: "Senior Software Engineer",
    description:
      "Lead development of our e-commerce platform serving millions of users. Work with microservices and high-scale systems.",
    requirements: [
      "6+ years software development",
      "Microservices architecture",
      "High-scale systems",
      "Leadership skills",
    ],
    skills: ["Java", "Spring Boot", "Kubernetes", "PostgreSQL", "Redis", "AWS"],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 70000,
    salaryMax: 95000,
    employmentType: "full-time" as const,
    experienceLevel: "senior" as const,
  },
  {
    companyId: 9,
    title: "Frontend Engineer - React",
    description:
      "Build world-class shopping experiences with React. Work on performance optimization and user experience.",
    requirements: [
      "4+ years React development",
      "Performance optimization",
      "E-commerce experience",
      "Testing expertise",
    ],
    skills: ["React", "TypeScript", "Next.js", "CSS", "Testing", "Performance"],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 50000,
    salaryMax: 68000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 9,
    title: "Data Engineer - Analytics",
    description:
      "Build data infrastructure for customer analytics and business intelligence. Work with big data and real-time processing.",
    requirements: [
      "4+ years data engineering",
      "Big data technologies",
      "Real-time processing",
      "Analytics experience",
    ],
    skills: ["Python", "Spark", "Kafka", "AWS", "SQL", "Airflow"],
    location: "London, UK",
    remoteType: "remote" as const,
    salaryMin: 55000,
    salaryMax: 75000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 9,
    title: "Mobile Engineer - Android",
    description:
      "Develop our Android shopping app used by millions. Work with modern Android development and e-commerce features.",
    requirements: [
      "3+ years Android development",
      "Kotlin expertise",
      "E-commerce app experience",
      "Performance optimization",
    ],
    skills: ["Kotlin", "Android", "Java", "APIs", "Performance", "Testing"],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 48000,
    salaryMax: 65000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 9,
    title: "Product Manager - Search",
    description:
      "Lead product strategy for our search and recommendation systems. Work with ML teams and user research.",
    requirements: [
      "5+ years product management",
      "E-commerce experience",
      "Analytics skills",
      "ML/search knowledge",
    ],
    skills: [
      "Product Management",
      "Analytics",
      "SQL",
      "Machine Learning",
      "A/B Testing",
    ],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 65000,
    salaryMax: 85000,
    employmentType: "full-time" as const,
    experienceLevel: "senior" as const,
  },
  {
    companyId: 9,
    title: "UX Designer",
    description:
      "Design user experiences for our shopping platform. Work on user research, prototyping, and design systems.",
    requirements: [
      "3+ years UX design",
      "E-commerce experience",
      "User research skills",
      "Design systems knowledge",
    ],
    skills: [
      "UX Design",
      "Figma",
      "User Research",
      "Prototyping",
      "Design Systems",
    ],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 42000,
    salaryMax: 58000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },

  // Innovation Consulting Group Jobs (6 jobs)
  {
    companyId: 10,
    title: "Technical Consultant",
    description:
      "Provide technology consulting to enterprise clients. Work on digital transformation and architecture recommendations.",
    requirements: [
      "5+ years consulting experience",
      "Enterprise architecture",
      "Client management",
      "Technical leadership",
    ],
    skills: [
      "Consulting",
      "Architecture",
      "Cloud",
      "Java",
      "Python",
      "Leadership",
    ],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 65000,
    salaryMax: 85000,
    employmentType: "full-time" as const,
    experienceLevel: "senior" as const,
  },
  {
    companyId: 10,
    title: "Solutions Architect",
    description:
      "Design technical solutions for client engagements. Work with cloud platforms and enterprise integrations.",
    requirements: [
      "6+ years architecture experience",
      "Client-facing skills",
      "Multiple cloud platforms",
      "Integration expertise",
    ],
    skills: [
      "Architecture",
      "AWS",
      "Azure",
      "Integration",
      "APIs",
      "Consulting",
    ],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 75000,
    salaryMax: 100000,
    employmentType: "full-time" as const,
    experienceLevel: "senior" as const,
  },
  {
    companyId: 10,
    title: "Senior Developer",
    description:
      "Lead development teams on client projects. Work with various technologies and mentor junior developers.",
    requirements: [
      "5+ years development experience",
      "Multiple programming languages",
      "Team leadership",
      "Client interaction",
    ],
    skills: ["Java", "Python", "JavaScript", "Leadership", "Consulting", "AWS"],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 60000,
    salaryMax: 80000,
    employmentType: "full-time" as const,
    experienceLevel: "senior" as const,
  },
  {
    companyId: 10,
    title: "Data Consultant",
    description:
      "Help clients with data strategy and analytics implementations. Work with data platforms and business intelligence.",
    requirements: [
      "4+ years data consulting",
      "BI platform experience",
      "Client management",
      "Analytics expertise",
    ],
    skills: ["SQL", "Python", "Tableau", "PowerBI", "AWS", "Consulting"],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 55000,
    salaryMax: 75000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 10,
    title: "Cloud Migration Specialist",
    description:
      "Lead cloud migration projects for enterprise clients. Work with legacy systems and modern cloud platforms.",
    requirements: [
      "4+ years cloud experience",
      "Migration expertise",
      "Enterprise systems",
      "Project management",
    ],
    skills: ["AWS", "Azure", "Migration", "Docker", "Kubernetes", "Consulting"],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 58000,
    salaryMax: 78000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
  {
    companyId: 10,
    title: "Digital Transformation Analyst",
    description:
      "Analyze client needs and recommend digital solutions. Work with business stakeholders and technical teams.",
    requirements: [
      "3+ years business analysis",
      "Digital transformation",
      "Stakeholder management",
      "Technical aptitude",
    ],
    skills: [
      "Business Analysis",
      "Digital Strategy",
      "SQL",
      "Process Improvement",
    ],
    location: "London, UK",
    remoteType: "hybrid" as const,
    salaryMin: 45000,
    salaryMax: 62000,
    employmentType: "full-time" as const,
    experienceLevel: "mid" as const,
  },
];

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Insert companies
    const insertedCompanies = await db
      .insert(companies)
      .values(companiesData)
      .returning();

    console.log(`✅ Inserted ${insertedCompanies.length} companies`);

    // Insert jobs
    const insertedJobs = await db.insert(jobs).values(jobsData).returning();

    console.log(`✅ Inserted ${insertedJobs.length} jobs`);
    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seed };
