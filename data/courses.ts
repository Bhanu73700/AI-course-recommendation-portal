
export type Course = {
  id: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  skills: string[];
  duration: number;
  price: number;
  rating: number;
  learners: number;
  description: string;
  career_paths: string[];
};

export const courses: Course[] = [
  {
    id: "full-stack-development",
    title: "Full Stack Web Development",
    category: "Web Development",
    level: "Intermediate",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Git"
    ],
    duration: 60,
    price: 0,
    rating: 4.8,
    learners: 28500,
    description:
      "Build modern full-stack web applications using React, Node.js, Express and MongoDB.",
    career_paths: [
      "Full Stack Developer",
      "Frontend Developer",
      "Backend Developer"
    ]
  },

  {
    id: "react-development",
    title: "Modern React Development",
    category: "Web Development",
    level: "Intermediate",
    skills: [
      "JavaScript",
      "React",
      "HTML",
      "CSS",
      "Git"
    ],
    duration: 35,
    price: 499,
    rating: 4.7,
    learners: 19200,
    description:
      "Learn React from fundamentals to advanced concepts and build production-ready interfaces.",
    career_paths: [
      "Frontend Developer",
      "React Developer",
      "Full Stack Developer"
    ]
  },

  {
    id: "nodejs-backend",
    title: "Node.js Backend Development",
    category: "Backend",
    level: "Intermediate",
    skills: [
      "JavaScript",
      "Node.js",
      "Express",
      "REST API",
      "MongoDB",
      "Git"
    ],
    duration: 40,
    price: 399,
    rating: 4.7,
    learners: 15400,
    description:
      "Learn backend development, REST APIs, authentication and database integration with Node.js.",
    career_paths: [
      "Backend Developer",
      "Node.js Developer",
      "Full Stack Developer"
    ]
  },

  {
    id: "python-programming",
    title: "Python Programming",
    category: "Programming",
    level: "Beginner",
    skills: [
      "Python",
      "Programming",
      "OOP",
      "Data Structures"
    ],
    duration: 30,
    price: 0,
    rating: 4.9,
    learners: 42000,
    description:
      "Learn Python programming from basics to object-oriented programming and problem solving.",
    career_paths: [
      "Python Developer",
      "Backend Developer",
      "Data Scientist"
    ]
  },

  {
    id: "data-science",
    title: "Data Science with Python",
    category: "Data Science",
    level: "Intermediate",
    skills: [
      "Python",
      "Pandas",
      "NumPy",
      "Statistics",
      "SQL",
      "Data Visualization"
    ],
    duration: 55,
    price: 799,
    rating: 4.8,
    learners: 21300,
    description:
      "Analyze real-world datasets and learn Python, statistics, visualization and data analysis.",
    career_paths: [
      "Data Scientist",
      "Data Analyst",
      "ML Engineer"
    ]
  },

  {
    id: "machine-learning",
    title: "Machine Learning Fundamentals",
    category: "AI & Machine Learning",
    level: "Advanced",
    skills: [
      "Python",
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "Machine Learning",
      "Statistics"
    ],
    duration: 65,
    price: 999,
    rating: 4.8,
    learners: 18700,
    description:
      "Understand machine learning algorithms and build practical predictive models using Python.",
    career_paths: [
      "Machine Learning Engineer",
      "Data Scientist",
      "AI Engineer"
    ]
  },

  {
    id: "deep-learning",
    title: "Deep Learning & Neural Networks",
    category: "AI & Machine Learning",
    level: "Advanced",
    skills: [
      "Python",
      "Deep Learning",
      "Neural Networks",
      "TensorFlow",
      "PyTorch"
    ],
    duration: 70,
    price: 1199,
    rating: 4.7,
    learners: 12600,
    description:
      "Learn neural networks, deep learning architectures and practical AI applications.",
    career_paths: [
      "AI Engineer",
      "Machine Learning Engineer",
      "Deep Learning Engineer"
    ]
  },

  {
    id: "sql-database",
    title: "SQL & Database Management",
    category: "Database",
    level: "Beginner",
    skills: [
      "SQL",
      "MySQL",
      "PostgreSQL",
      "Database",
      "Queries"
    ],
    duration: 25,
    price: 0,
    rating: 4.8,
    learners: 32100,
    description:
      "Master SQL queries, relational databases, joins, aggregation and database design.",
    career_paths: [
      "Backend Developer",
      "Data Analyst",
      "Database Administrator"
    ]
  },

  {
    id: "aws-cloud",
    title: "AWS Cloud Engineering",
    category: "Cloud",
    level: "Intermediate",
    skills: [
      "AWS",
      "Cloud Computing",
      "Linux",
      "Networking",
      "Docker",
      "Git"
    ],
    duration: 50,
    price: 899,
    rating: 4.7,
    learners: 14900,
    description:
      "Learn cloud infrastructure, AWS services, deployment and cloud engineering fundamentals.",
    career_paths: [
      "Cloud Engineer",
      "DevOps Engineer",
      "Cloud Architect"
    ]
  },

  {
    id: "devops",
    title: "DevOps & CI/CD",
    category: "DevOps",
    level: "Advanced",
    skills: [
      "Linux",
      "Docker",
      "Kubernetes",
      "Git",
      "CI/CD",
      "AWS"
    ],
    duration: 45,
    price: 799,
    rating: 4.6,
    learners: 11300,
    description:
      "Learn DevOps practices, containers, CI/CD pipelines and modern deployment workflows.",
    career_paths: [
      "DevOps Engineer",
      "Cloud Engineer",
      "Site Reliability Engineer"
    ]
  },

  {
    id: "dsa-cpp",
    title: "Data Structures & Algorithms in C++",
    category: "DSA",
    level: "Intermediate",
    skills: [
      "C++",
      "Data Structures",
      "Algorithms",
      "Problem Solving",
      "Competitive Programming"
    ],
    duration: 75,
    price: 0,
    rating: 4.9,
    learners: 51000,
    description:
      "Master DSA using C++ and prepare for technical interviews and competitive programming.",
    career_paths: [
      "Software Engineer",
      "Backend Developer",
      "Competitive Programmer"
    ]
  },

  {
    id: "cybersecurity",
    title: "Cybersecurity Fundamentals",
    category: "Cybersecurity",
    level: "Beginner",
    skills: [
      "Networking",
      "Linux",
      "Cybersecurity",
      "Authentication",
      "Security"
    ],
    duration: 40,
    price: 599,
    rating: 4.6,
    learners: 9800,
    description:
      "Understand cybersecurity fundamentals, networking security and common security concepts.",
    career_paths: [
      "Cybersecurity Analyst",
      "Security Engineer",
      "SOC Analyst"
    ]
  }
];

