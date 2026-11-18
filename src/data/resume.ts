// Single source of truth for site content, transcribed from the ML Engineer resume.
// Text wrapped in **double asterisks** is rendered bold.

export interface Link {
  label: string;
  href: string;
}

export interface Job {
  company: string;
  location: string;
  role: string;
  dates: string;
  bullets: string[];
  links?: Link[];
}

export interface School {
  name: string;
  location: string;
  degree: string;
  dates: string;
  note: string;
}

export interface Project {
  name: string;
  stack: string[];
  bullets: string[];
  link: Link;
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export const profile = {
  name: 'Stefanus Stanley Yoga Setiawan',
  shortName: 'Stanley',
  title: 'Machine Learning Engineer',
  location: 'Melbourne, Australia',
  email: 'yoga360227@gmail.com',
  linkedin: { label: 'linkedin.com/in/stanley-yoga', href: 'https://linkedin.com/in/stanley-yoga' },
  github: { label: 'github.com/stanleyyoga123', href: 'https://github.com/stanleyyoga123' },
};

export const summary: string[] = [
  'Machine Learning Engineer with three years of experience taking ML models from development to production, covering deployment automation, model serving, and cloud infrastructure.',
  '**Stack:** Python and FastAPI, ML frameworks (PyTorch, TensorFlow, XGBoost, CatBoost), MLOps and CI/CD (Kubeflow, Jenkins, GitHub Actions, Docker), and cloud (Kubernetes, Terraform, AWS, Google Cloud).',
  'Productionized search, recommendation, and computer vision models, reduced Kubeflow pipeline releases to one Jenkins action, and scaled asynchronous ML workloads on Kubernetes with KEDA and Google Pub/Sub.',
  'Technical owner of eight concurrent ML projects at tiket.com, working closely with DevOps engineers, data scientists, and product managers in Git-based, sprint-based teams.',
];

export const aiLevate: Job = {
  company: 'AI-Levate',
  location: 'Melbourne, Australia',
  role: 'AI Engineer (Part-time Freelance)',
  dates: 'Apr 2026 - Sep 2026',
  bullets: [
    '**Automated supervisor email routing** by deploying a Python workflow that extracts PDF details with Qwen vision-language models and forwards messages through AWS and Microsoft Entra integrations.',
    "**Integrated payroll and project-management data** from internal systems and SharePoint-hosted Excel files into Databricks, delivering a deployed integration across the client's existing business data sources.",
    '**Delivered an end-to-end digital credential management platform** with integrated Stripe payments by building and deploying FastAPI and React applications on AWS infrastructure provisioned through Terraform.',
    'Explained technical trade-offs to a business client and wrote supporting project documentation.',
  ],
};

export const tiket: Job = {
  company: 'tiket.com',
  location: 'Jakarta, Indonesia',
  role: 'Machine Learning Engineer',
  dates: 'Sep 2022 - Feb 2025',
  bullets: [
    'Held technical ownership of **eight concurrent ML projects**, designing and deploying Python and FastAPI backends that collectively handled **6,000+ requests per minute** under normal traffic.',
    '**Reduced Kubeflow releases to one Jenkins pipeline action** by automating Docker image builds, pipeline-manifest creation, and deployment, replacing manual packaging and upload steps for ML pipelines.',
    '**Reduced idle compute and processing costs** by scaling asynchronous image scoring, hotel-review sentiment analysis, and paraphrasing with queue backlog using Kubernetes, KEDA, and Google Pub/Sub.',
    '**Enabled query understanding and ranking** by building an ML search orchestration platform with FastAPI, Elasticsearch, XGBoost, and spaCy, combining named entity recognition and phrase-affinity classification.',
    '**Delivered personalized nearby-location results** by building a real-time, geo-aware recommendation system with CatBoost, Elasticsearch, Redis, BigQuery, and MongoDB for production recommendation workloads.',
    '**Helped process 100,000+ images weekly** at normal production volume by building TensorFlow and PyTorch image-scoring modules with the team for object detection, image similarity, blur detection, and OCR.',
    '**Built a React dashboard that surfaced production pipeline monitoring information**, giving teams without direct production access visibility into Kubeflow execution status, failures, and existing alerts.',
    '**Led the initial migration of vision inference workloads to NVIDIA TensorRT** and benchmarked YOLO and EfficientNet implementations in PyTorch to assess GPU inference throughput.',
  ],
  links: [
    {
      label: 'TensorRT article',
      href: 'https://medium.com/tiket-com/tensorrt-the-missing-piece-for-computer-vision-models-at-scale-f60987ea1b4d',
    },
  ],
};

export const tiketStats = [
  { value: '8', label: 'concurrent ML projects' },
  { value: '6,000+', label: 'requests / minute' },
  { value: '100k+', label: 'images / week' },
];

export const education: School[] = [
  {
    name: 'University of Melbourne',
    location: 'Melbourne, Australia',
    degree: 'Master of Computer Science',
    dates: 'Feb 2025 - Dec 2026 expected',
    note: 'Awarded the Engineering and IT Graduate Scholarship with a living allowance; completed Machine Learning Applications for Health (H1), Cluster and Cloud Computing (H1), and Research Methods.',
  },
  {
    name: 'Bandung Institute of Technology',
    location: 'West Java, Indonesia',
    degree: 'Computer Science',
    dates: 'Aug 2018 - Jul 2022',
    note: 'Graduated with honors; earned A grades in Artificial Intelligence, Machine Learning, Advanced Machine Learning, Natural Language Processing, Data Science and Data Mining, and Database Management.',
  },
];

export const skills: SkillGroup[] = [
  { name: 'MLOps', items: ['Kubernetes', 'Docker', 'Kubeflow', 'Jenkins', 'GitHub Actions', 'KEDA', 'Terraform', 'AWS', 'Google Cloud'] },
  { name: 'Serving', items: ['Python', 'SQL', 'FastAPI', 'REST APIs', 'vLLM', 'NVIDIA Triton', 'NVIDIA TensorRT', 'ONNX'] },
  { name: 'Machine Learning', items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'XGBoost', 'CatBoost', 'NLP', 'Computer Vision'] },
  { name: 'AI and Data', items: ['LLMs', 'RAG', 'MCP', 'Qwen', 'Gemini', 'Milvus', 'Elasticsearch', 'Redis', 'MongoDB', 'BigQuery'] },
  { name: 'Storage and Observability', items: ['PostgreSQL', 'Databricks', 'Google Pub/Sub', 'Prometheus', 'Jaeger', 'Loki'] },
];

export const projects: Project[] = [
  {
    name: 'ESCI Search',
    stack: ['Python', 'FastAPI', 'Elasticsearch', 'NVIDIA Triton', 'ONNX', 'Docker'],
    bullets: [
      '**Built a two-stage product search service** on the Amazon ESCI dataset, where a FastAPI gateway retrieves BM25 candidates from Elasticsearch and reranks them with a cross-encoder served on NVIDIA Triton.',
      '**Served the cross-encoder as an int8 ONNX model** through a Triton ensemble with server-side tokenization and dynamic batching, and grouped titles by length to reduce padding in rerank requests.',
    ],
    link: { label: 'GitHub', href: 'https://github.com/stanleyyoga123/simple-triton-showcase' },
  },
  {
    name: 'IncidentBench',
    stack: ['Python', 'FastAPI', 'Kubernetes', 'MCP', 'Prometheus', 'PostgreSQL'],
    bullets: [
      "**Built a multi-agent system** for my master's thesis that responds to Kubernetes incidents, triggering three LLM agents from Prometheus anomalies to find the root cause, apply a fix, and record lessons learned.",
      '**Made evaluation repeatable with 69 configured scenarios** across three microservice applications, capturing telemetry, agent sessions, and tool-call audits for offline review.',
    ],
    link: { label: 'GitHub', href: 'https://github.com/stanleyyoga123/IncidentBench' },
  },
  {
    name: 'Jev Resume Screening',
    stack: ['Python', 'FastAPI', 'React', 'OpenRouter', 'GitHub Actions', 'Vercel'],
    bullets: [
      '**Built a full-stack web app** that compares a resume with a job description and explains each gap, using a Python and FastAPI backend, a React frontend, and LLMs accessed through OpenRouter.',
      '**Designed a two-step LLM workflow** in which one model turns the job description into editable screening questions and TypeSafe Jev answers each one, separating unmet requirements from missing evidence.',
    ],
    link: { label: 'GitHub', href: 'https://github.com/stanleyyoga123/jev-screening' },
  },
  {
    name: 'TikTekTo',
    stack: ['Python', 'Milvus', 'Google Gemini', 'RAG'],
    bullets: [
      "**Placed third of 60+ teams** at the University of Melbourne's FEIT Hackathon 2025, building the backend.",
      "**Generated learning pathways** from uploaded documents or structured profiles by combining Milvus vector retrieval with Google Gemini, tailoring each pathway to the user's background and career goals.",
    ],
    link: { label: 'GitHub', href: 'https://github.com/stanleyyoga123/TikTekTo' },
  },
];

export const publication = {
  title: 'Lexical Complexity Prediction using Deep Learning with Sentence and Word Features',
  venue: 'ICAICTA, 2022',
  note: 'First author of a lexical complexity study using BERT, RoBERTa, XLNet, Word2vec, and FastText.',
  links: [
    { label: 'Paper', href: 'https://doi.org/10.1109/ICAICTA56449.2022.9932964' },
    { label: 'Code', href: 'https://github.com/stanleyyoga123/Complexity-Prediction-SemEval2021' },
  ] as Link[],
};
