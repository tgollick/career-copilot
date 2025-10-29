from dataclasses import dataclass
from pathlib import Path
from typing import Optional

# Dataclass for configuration
@dataclass
class AppConfig:
    """Application configuration for CV analysis and job matching"""
    cv_path: str
    show_analysis_results: bool = False
    save_analysis_results: bool = False
    show_tfidf_results: bool = False
    output_file: str = "cv_analysis_results.json"
    
    # Future FastAPI configs can go here
    api_host: str = "localhost"
    api_port: int = 8000

# Storing all configuration variables for improved code re-useability, maintainability and modularity

# PROGRAMMING LANGUAGES
# Languages that are used to write code, including general-purpose, scripting, and domain-specific languages
# Note: SQL and GraphQL are included here as query languages, though they could arguably go elsewhere
programming_languages = {
    # Mainstream general-purpose languages
    'python', 'javascript', 'typescript', 'java', 'c#', 'c++', 'c',
    'go', 'golang', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala',
    
    # Data science and statistical languages
    'r', 'julia', 'matlab', 'octave',
    
    # Scripting and shell languages
    'bash', 'shell', 'powershell', 'perl', 'lua',
    
    # Legacy and specialized languages
    'cobol', 'fortran', 'pascal', 'visual basic', 'vb', 'vba',
    'objective-c', 'objective c',
    
    # Functional languages
    'haskell', 'elixir', 'erlang', 'clojure', 'lisp', 'scheme', 'f#',
    
    # Systems and low-level languages
    'assembly', 'asm',
    
    # Query languages (treated as languages since they have syntax and semantics)
    'sql', 'plsql', 'tsql', 'graphql',
    
    # Markup and data languages (often listed as language skills)
    'html', 'css', 'xml', 'yaml', 'json',
    
    # JVM languages
    'groovy', 'jython',
    
    # Mobile-specific languages
    'dart',
    
    # Emerging languages
    'zig', 'nim', 'crystal', 'webassembly', 'wasm'
}

frameworks_libraries = {
    'react', 'reactjs', 'angular', 'angularjs', 'vue', 'vuejs', 'svelte',
    'solid', 'solidjs', 'preact', 'ember', 'emberjs', 'backbone', 'backbonejs',
    'next', 'nextjs', 'next.js', 'nuxt', 'nuxtjs', 'gatsby', 'remix',
    
    'node', 'nodejs', 'node.js', 'express', 'expressjs', 'fastify', 'koa',
    'nestjs', 'nest', 'hapi', 'sails', 'meteor',
    
    'redux', 'mobx', 'recoil', 'zustand', 'jotai',
    
    'jest', 'mocha', 'jasmine', 'cypress', 'playwright', 'puppeteer',
    'enzyme', 'testing library', 'vitest',
    
    'webpack', 'vite', 'rollup', 'parcel', 'esbuild', 'turbopack',
    
    'tailwind', 'tailwindcss', 'bootstrap', 'material-ui', 'mui',
    'ant design', 'antd', 'chakra', 'semantic ui', 'bulma',
    'sass', 'scss', 'less', 'styled-components', 'emotion',
    
    'jquery',
    
    'django', 'flask', 'fastapi', 'tornado', 'pyramid', 'bottle',
    'streamlit', 'gradio', 'dash',
    
    'celery', 'asyncio', 'aiohttp',
    
    'numpy', 'pandas', 'scipy', 'matplotlib', 'seaborn', 'plotly',
    
    'scikit-learn', 'sklearn', 'scikit', 'tensorflow', 'pytorch', 'keras',
    'opencv', 'pil', 'pillow',
    
    'beautifulsoup', 'scrapy',
    
    'huggingface', 'transformers', 'langchain', 'spacy',
    'nltk', 'gensim', 'xgboost', 'lightgbm', 'catboost',
    
    'spring', 'spring boot', 'springboot', 'hibernate', 'struts',
    'jsf', 'jax-rs', 'jersey', 'micronaut', 'quarkus',
    
    '.net', 'dotnet', 'asp.net', 'aspnet', 'blazor', 'xamarin',
    'entity framework', 'ef core',
    
    'laravel', 'symfony', 'codeigniter', 'yii', 'cakephp', 'wordpress',
    
    'rails', 'ruby on rails', 'sinatra',
    
    'gin', 'echo', 'fiber', 'beego',
    
    'react native', 'flutter', 'ionic', 'cordova', 'capacitor',
    'swiftui', 'jetpack compose',
    
    'selenium', 'junit', 'testng', 'pytest', 'unittest', 'rspec',
    
    'sequelize', 'typeorm', 'prisma', 'mongoose', 'sqlalchemy',
    
    'socket.io', 'socketio', 'websockets', 'signalr'
}

databases = {
    'mysql', 'postgresql', 'postgres', 'sqlite', 'oracle',
    'sql server', 'mssql', 'mariadb', 'db2', 'sybase',
    
    'mongodb', 'mongo', 'couchdb', 'couchbase',
    
    'redis', 'memcached', 'etcd',
    
    'cassandra', 'hbase', 'scylla',
    
    'neo4j', 'arangodb', 'dgraph',
    
    'elasticsearch', 'elastic', 'solr', 'algolia', 'meilisearch',
    
    'influxdb', 'timescaledb', 'prometheus',
    
    'pinecone', 'weaviate', 'qdrant', 'milvus', 'chroma',
    
    'dynamodb', 'cosmosdb', 'firestore', 'fauna',
    
    'snowflake', 'redshift', 'bigquery', 'databricks'
}


cloud_tools = {
    'aws', 'amazon web services', 'azure', 'microsoft azure',
    'gcp', 'google cloud', 'google cloud platform',
    
    'ec2', 's3', 'lambda', 'rds', 'cloudformation', 'cloudwatch',
    'sqs', 'sns', 'api gateway', 'cognito', 'ecs', 'eks',
    
    'azure functions', 'azure devops', 'azure sql',
    
    'compute engine', 'cloud functions', 'cloud run',
    
    'docker', 'podman', 'containerd',
    
    'kubernetes', 'k8s', 'openshift', 'rancher', 'nomad',
    'docker swarm', 'docker compose',
    
    'jenkins', 'github actions', 'gitlab ci', 'circleci', 'travis ci',
    'teamcity', 'bamboo', 'azure pipelines', 'codepipeline',
    'drone', 'spinnaker', 'argo', 'argocd',
    
    'terraform', 'ansible', 'puppet', 'chef', 'saltstack',
    'pulumi', 'cdk',
    
    'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial',
    
    'grafana', 'datadog', 'new relic', 'splunk',
    'logstash', 'kibana', 'fluentd',
    'sentry', 'pagerduty', 'dynatrace',
    
    'nginx', 'apache', 'haproxy', 'traefik',
    
    'istio', 'linkerd', 'consul', 'envoy',
    
    'heroku', 'vercel', 'netlify', 'render', 'railway',
    'fly.io', 'digitalocean', 'linode',
    
    'serverless', 'sam', 'amplify',
    
    'vault',
    
    'kong', 'apigee', 'tyk',
    
    'kafka', 'rabbitmq', 'activemq', 'nats', 'pulsar',
    'kinesis', 'event bridge',
    
    'firebase', 'firebase auth',
    
    'postman', 'insomnia', 'swagger', 'jira', 'confluence',
    'slack', 'notion'
}

# Combining all sub-skills into a single set for use in the TFIDF module
all_technical_skills = {
    *programming_languages,
    *frameworks_libraries,
    *databases,
    *cloud_tools
}

experience_indicators = {
    'lead', 'led', 'leading', 'leadership', 'mentor', 'mentored', 'mentoring',
    'manage', 'managed', 'managing', 'management', 'supervise', 'supervised',
    'train', 'trained', 'training', 'coach', 'coached', 'coaching',
    'architect', 'architecture', 'design', 'designed', 'designing',
    'build', 'built', 'building', 'create', 'created', 'creating',
    'develop', 'developed', 'developing', 'implement', 'implemented', 'implementing',
    'scale', 'scaled', 'scaling', 'optimize', 'optimized', 'optimizing',
    'performance', 'production', 'deploy', 'deployed', 'deployment',
    'maintain', 'maintained', 'maintenance', 'support', 'supported',
    'deliver', 'delivered', 'delivering', 'ship', 'shipped', 'shipping',
    'launch', 'launched', 'launching', 'release', 'released', 'releasing',
    'complete', 'completed', 'completing', 'finish', 'finished',
    'collaborate', 'collaborated', 'collaboration', 'coordinate', 'coordinated',
    'integrate', 'integrated', 'integration', 'migrate', 'migrated', 'migration',
    'senior', 'junior', 'principal', 'staff', 'lead',
    'improve', 'improved', 'increase', 'increased', 'reduce', 'reduced',
    'enhance', 'enhanced', 'solve', 'solved', 'fix', 'fixed'
}

job_terms = {
    'developer', 'engineer', 'scientist', 'analyst', 'manager',
    'senior', 'junior', 'lead', 'full', 'stack', 'frontend', 'backend',
    'fullstack', 'web', 'mobile', 'data', 'machine', 'learning',
    'artificial', 'intelligence', 'software', 'computer', 'science'
}

stop_words = {
    'experience', 'years', 'required', 'preferred', 'knowledge',
    'skills', 'looking', 'needed', 'position', 'role', 'company',
    'team', 'work', 'working', 'must', 'have', 'essential', 
    'technologies', 'startup', 'environment', 'modern', 'development'
}

