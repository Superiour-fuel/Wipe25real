import { ResumeData } from "../types";

export const DEMO_RESUMES: ResumeData[] = [
  {
    fullName: "Alex Chen",
    title: "Senior Full Stack Engineer",
    email: "alex.chen@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    summary: "Results-oriented Senior Full Stack Engineer with over 6 years of experience architecting scalable web solutions and leading agile teams. Proven track record of migrating legacy systems to microservices, optimizing performance by 40%, and driving user engagement through intuitive UI design. Expert in the MERN stack, cloud infrastructure (AWS), and CI/CD automation.",
    themeColor: "#2563EB", // Blue
    experience: [
      {
        id: "exp-1",
        title: "Senior Software Engineer",
        company: "TechFlow Solutions",
        dates: "2021 - Present",
        description: [
          "Spearheaded the migration of a legacy monolithic application to a microservices architecture using Node.js and Docker, reducing deployment time by 40% and improving system uptime to 99.99%.",
          "Architected and developed a real-time analytics dashboard using React and D3.js, processing over 1TB of data daily for 50,000+ active users.",
          "Led a team of 5 engineers through the full SDLC, implementing CI/CD pipelines via GitHub Actions that increased release frequency by 300%.",
          "Optimized database queries and indexing strategies in PostgreSQL, resulting in a 25% reduction in average API response time.",
          "Mentored 4 junior developers, establishing comprehensive code review standards and best practices that decreased post-release bugs by 15%."
        ]
      },
      {
        id: "exp-2",
        title: "Software Engineer",
        company: "Creative Web Co",
        dates: "2018 - 2021",
        description: [
          "Developed and maintained client-facing e-commerce platforms using the MERN stack, driving over $2M in combined revenue for clients.",
          "Implemented responsive design principles and accessibility (WCAG 2.1) improvements, increasing mobile conversion rates by 18%.",
          "Integrated third-party payment gateways (Stripe, PayPal) and RESTful APIs, ensuring secure and seamless transaction processing for 10k+ monthly transactions.",
          "Collaborated closely with UX designers to refactor the frontend codebase, reducing bundle size by 35% and improving core web vitals scores."
        ]
      },
      {
        id: "exp-3",
        title: "Junior Developer",
        company: "StartupHub",
        dates: "2016 - 2018",
        description: [
          "Assisted in the development of an MVP for a fintech startup, utilizing Python and Django to build secure backend services.",
          "Designed and implemented REST APIs for mobile application consumption, supporting an initial user base of 5,000.",
          "Automated daily reporting tasks using Python scripts, saving the operations team 10+ hours per week.",
          "Participated in daily stand-ups and sprint planning, gaining proficiency in Agile methodologies and version control (Git)."
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        school: "University of California, Berkeley",
        degree: "B.S. Computer Science",
        dates: "2014 - 2018",
        details: "Graduated Cum Laude. Relevant Coursework: Algorithms, Data Structures, Distributed Systems."
      },
      {
        id: "cert-1",
        school: "Amazon Web Services",
        degree: "AWS Certified Solutions Architect – Associate",
        dates: "2023",
        details: "Professional Certification"
      },
      {
        id: "cert-2",
        school: "Meta",
        degree: "Front-End Developer Professional Certificate",
        dates: "2022",
        details: "Advanced React & UI/UX"
      }
    ],
    skills: [
        "JavaScript (ES6+)", "TypeScript", "Python", "React", "Node.js", "Next.js", 
        "AWS (EC2, S3, Lambda)", "Docker", "Kubernetes", "PostgreSQL", "MongoDB", "Redis", 
        "Git", "CI/CD", "System Design"
    ]
  },
  {
    fullName: "Sarah Jenkins",
    title: "Product Manager",
    email: "sarah.j@example.com",
    phone: "(555) 987-6543",
    location: "New York, NY",
    summary: "Strategic Product Manager with a background in data analytics and a passion for user-centric design. Skilled in roadmap planning, cross-functional leadership, and driving product growth through data-driven decision making.",
    themeColor: "#D93058", // Red/Burgundy
    experience: [
      {
        id: "exp-1",
        title: "Product Manager",
        company: "InnovateFin",
        dates: "2020 - Present",
        description: [
          "Launched a new mobile banking feature that acquired 100k users in the first 3 months.",
          "Conducted A/B testing on onboarding flows, increasing conversion rates by 22%.",
          "Managed a cross-functional team of engineers and designers to deliver quarterly roadmap goals on time."
        ]
      },
      {
        id: "exp-2",
        title: "Associate Product Manager",
        company: "StartUp Lyfe",
        dates: "2018 - 2020",
        description: [
          "Assisted in the definition of product requirements and user stories for the MVP launch.",
          "Analyzed user feedback and usage metrics to prioritize backlog items.",
          "Coordinated go-to-market strategies with the marketing and sales teams."
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        school: "New York University",
        degree: "MBA, Tech Management",
        dates: "2021 - 2023",
        details: ""
      },
      {
        id: "edu-2",
        school: "Boston University",
        degree: "B.A. Economics",
        dates: "2014 - 2018",
        details: ""
      }
    ],
    skills: ["Product Strategy", "Agile/Scrum", "SQL", "Jira", "Figma", "Data Analysis", "User Research", "A/B Testing"]
  },
  {
    fullName: "Jordan Lee",
    title: "Digital Marketing Specialist",
    email: "jordan.lee@example.com",
    phone: "(555) 456-7890",
    location: "Austin, TX",
    summary: "Creative Digital Marketing Specialist with expertise in SEO, content strategy, and social media management. Adept at creating engaging campaigns that build brand awareness and drive lead generation.",
    themeColor: "#059669", // Green
    experience: [
      {
        id: "exp-1",
        title: "Marketing Specialist",
        company: "Growth Hype Agency",
        dates: "2019 - Present",
        description: [
          "Managed ad spend of $50k/month across Facebook and Google Ads, achieving a 3.5x ROAS.",
          "Developed a content strategy that increased organic blog traffic by 150% YoY.",
          "Orchestrated email marketing campaigns with an average open rate of 28% and click-through rate of 5%."
        ]
      },
      {
        id: "exp-2",
        title: "Social Media Coordinator",
        company: "BrandBuzz",
        dates: "2017 - 2019",
        description: [
          "Grew Instagram following from 5k to 50k through organic engagement and influencer partnerships.",
          "Designed visual assets for social media posts using Adobe Creative Suite.",
          "Monitored social trends to capitalize on real-time marketing opportunities."
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        school: "University of Texas at Austin",
        degree: "B.S. Marketing",
        dates: "2013 - 2017",
        details: ""
      }
    ],
    skills: ["SEO/SEM", "Google Analytics", "Content Marketing", "Social Media Management", "Copywriting", "Adobe Photoshop", "HubSpot"]
  }
];