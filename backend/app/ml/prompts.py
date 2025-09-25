system_prompt = """You are an expert career consultant and professional writer specializing in creating compelling cover letters for software engineering and technology roles. You have access to comprehensive CV analysis data including skills, experience, education, and personal details."""

def get_user_prompt(cv_analysis_results, job_description):
    user_prompt = f"""Generate a professional cover letter using this comprehensive candidate analysis:

**CANDIDATE PROFILE:**
Contact: {cv_analysis_results.get('contact_info', {})}
Location: {cv_analysis_results.get('entities', {}).get('locations', [''])[0] if cv_analysis_results.get('entities', {}).get('locations') else 'UK'}

**TECHNICAL SKILLS:**
Programming Languages: {', '.join(cv_analysis_results.get('skills', {}).get('programming_languages', []))}
Frameworks & Libraries: {', '.join(cv_analysis_results.get('skills', {}).get('frameworks_libraries', []))}
Databases: {', '.join(cv_analysis_results.get('skills', {}).get('databases', []))}
Cloud & Tools: {', '.join(cv_analysis_results.get('skills', {}).get('cloud_tools', []))}
Other Skills: {', '.join(cv_analysis_results.get('skills', {}).get('other_skills', []))}

**EDUCATION:**
{chr(10).join(cv_analysis_results.get('education_info', []))}

**EXPERIENCE INDICATORS:**
{chr(10).join(cv_analysis_results.get('experience_indicators', []))}

**ORGANIZATIONS ASSOCIATED WITH:**
{', '.join(cv_analysis_results.get('entities', {}).get('organizations', []))}

**JOB DESCRIPTION:**
{job_description}

Create a tailored cover letter that demonstrates clear connections between the candidate's background and the job requirements. Use specific skills and experiences mentioned above."""

    return user_prompt

results = {
    'contact_info': {
        'email': 'thomas.gollick@example.com',
        'phone': '+44 7123 456789',
        'linkedin': 'linkedin.com/in/thomasgollick',
        'github': 'github.com/tgollick',
        'location': 'Manchester, UK'
    },
    'sections': {
        'personal_statement': 'Recent Computer Science graduate with First Class Honours from Manchester Metropolitan University...',
        'education': 'BSc Computer Science (First Class Honours) - Manchester Metropolitan University (2021-2024)...',
        'experience': 'Full Stack Developer - Freelance (2024) • Built responsive website for DSG Mortgages using React and Node.js...',
        'skills': 'Programming Languages: Python, JavaScript, TypeScript, Java, C#, HTML, CSS...',
        'projects': 'Career Copilot - AI-powered job application assistant built with Python, FastAPI, and OpenAI...'
    },
    'skills': {
        'programming_languages': [
            'Python', 'JavaScript', 'TypeScript', 'Java', 'C#', 
            'HTML', 'CSS', 'SQL', 'C++', 'Bash'
        ],
        'frameworks_libraries': [
            'React', 'Node.js', 'Express.js', 'FastAPI', 'Flask', 
            'Django', 'Next.js', 'Redux', 'jQuery', 'Bootstrap',
            'Tailwind CSS', 'Jest', 'Pytest', 'Pandas', 'NumPy',
            'Scikit-learn', 'Matplotlib', 'Seaborn'
        ],
        'databases': [
            'PostgreSQL', 'MongoDB', 'MySQL', 'SQLite', 'Redis'
        ],
        'cloud_tools': [
            'AWS', 'Docker', 'Git', 'GitHub', 'GitLab', 'Heroku',
            'Netlify', 'Vercel', 'Linux', 'Ubuntu', 'Nginx'
        ],
        'other_skills': [
            'RESTful APIs', 'GraphQL', 'Microservices', 'Agile', 'Scrum',
            'Test Driven Development', 'CI/CD', 'Machine Learning',
            'Data Analysis', 'Problem Solving', 'Team Collaboration',
            'Code Review', 'System Design', 'Object-Oriented Programming'
        ]
    },
    'entities': {
        'names': ['Thomas Gollick', 'Tom'],
        'organizations': [
            'Manchester Metropolitan University', 'DSG Mortgages', 
            'TechFlow Solutions', 'GitHub', 'LinkedIn', 'AWS',
            'Google', 'Microsoft', 'Meta'
        ],
        'dates': [
            '2024', '2021-2024', 'June 2024', 'September 2023',
            'January 2024', 'Summer 2024', '2023', '2022'
        ],
        'locations': [
            'Manchester', 'UK', 'United Kingdom', 'London',
            'Birmingham', 'Leeds', 'Remote'
        ]
    },
    'experience_indicators': [
        'Recent Computer Science graduate',
        '3+ years of programming experience',
        'Built full-stack web applications',
        'Experience with modern development practices',
        'Freelance web development projects',
        'University project team leadership',
        'Open source contributions',
        'Internship experience',
        'Commercial project delivery'
    ],
    'education_info': [
        'BSc Computer Science - First Class Honours',
        'Manchester Metropolitan University (2021-2024)',
        'Relevant modules: Software Engineering, Database Systems, Web Development',
        'Machine Learning and Artificial Intelligence',
        'Data Structures and Algorithms',
        'Computer Networks and Security',
        'Final year project: Career Copilot - AI Job Application Assistant',
        'A-Levels: Mathematics (A), Computer Science (A), Physics (B)'
    ]
}

mock_description = """
Junior Full Stack Developer
InnovateFintech | Manchester, UK | £28,000 - £35,000

About InnovateFintech:
We're a fast-growing fintech startup based in Manchester, revolutionizing how small businesses manage their finances. Our platform serves over 15,000 businesses across the UK and processes £200M+ in transactions annually. We're backed by leading VCs and recently completed our Series A funding.

The Role:
We're seeking a talented Junior Full Stack Developer to join our 8-person engineering team. You'll work on both our customer-facing React application and our Node.js/Python backend services. This is a fantastic opportunity for a recent graduate to grow their skills in a supportive, fast-paced environment.

What You'll Do:
- Build and maintain responsive web applications using React and TypeScript
- Develop robust backend APIs using Node.js, Express, and Python FastAPI
- Work with PostgreSQL databases to design efficient schemas and optimize queries
- Implement automated testing using Jest and Pytest
- Collaborate with our product team in 2-week Agile sprints
- Deploy applications using Docker containers on AWS infrastructure
- Participate in code reviews and pair programming sessions
- Debug production issues and monitor application performance
- Contribute to technical documentation and best practices

Required Skills:
- Computer Science degree or equivalent practical experience
- Strong foundation in JavaScript/TypeScript and React
- Experience with backend development (Node.js, Python, or similar)
- Understanding of relational databases (PostgreSQL, MySQL)
- Familiarity with Git version control and collaborative development
- Knowledge of RESTful API design principles
- Experience with testing frameworks (Jest, Pytest, or similar)
- Understanding of HTML, CSS, and responsive web design

Nice to Have:
- Experience with AWS services (EC2, RDS, Lambda)
- Knowledge of Docker and containerization
- Familiarity with CI/CD pipelines (GitHub Actions, GitLab CI)
- Understanding of microservices architecture
- Experience with Redis for caching and session management
- Knowledge of GraphQL APIs
- Previous fintech or financial services experience
- Contribution to open source projects

What We Offer:
- Competitive salary: £28,000 - £35,000 based on experience
- Annual bonus based on company performance
- 25 days holiday + bank holidays
- Flexible working hours (core hours 10am-3pm)
- Hybrid working (2-3 days in Manchester office)
- £1,500 annual learning & development budget
- Latest MacBook Pro and equipment of your choice
- Private healthcare and dental coverage
- Company pension with 4% employer contribution
- Regular team events and quarterly company retreats
- Stock options in a high-growth company
- Mentorship program with senior developers

Our Tech Stack:
Frontend: React, TypeScript, Next.js, Tailwind CSS, Redux Toolkit
Backend: Node.js, Express, Python, FastAPI, Django
Databases: PostgreSQL, Redis, MongoDB
Infrastructure: AWS (EC2, RDS, Lambda, S3), Docker, Kubernetes
Tools: Git, GitHub, Jira, Slack, Figma, DataDog

Company Culture:
We believe in work-life balance, continuous learning, and building great products that make a real difference to small businesses. Our team includes graduates from Manchester Metropolitan, University of Manchester, and other top UK universities. We're committed to diversity and welcome applications from all backgrounds.

Next Steps:
Send us your CV along with a brief cover letter explaining why you're interested in fintech and what you'd bring to our team. We'll get back to you within 48 hours and aim to complete our interview process within one week.

Apply now to join us in building the future of small business finance!

Contact: careers@innovatefintech.com
Website: www.innovatefintech.com
LinkedIn: /company/innovate-fintech
"""

user_prompt = get_user_prompt(results, mock_description)