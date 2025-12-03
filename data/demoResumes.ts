import { ResumeData } from "../types";

export const DEMO_RESUMES: ResumeData[] = [
  {
    fullName: "Alex Chen",
    title: "Senior Full Stack Engineer",
    email: "alex.chen@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    summary: "Results-driven Senior Full Stack Engineer with 6+ years of experience in building scalable web applications using React, Node.js, and Cloud technologies. Proven track record of optimizing performance and leading agile teams to deliver high-impact products.",
    experience: [
      {
        id: "exp-1",
        title: "Senior Software Engineer",
        company: "TechFlow Solutions",
        dates: "2021 - Present",
        description: [
          "Led the migration of a legacy monolith to a microservices architecture, reducing deployment time by 40%.",
          "Architected and built a high-traffic analytics dashboard using React and D3.js, serving 50k+ daily users.",
          "Mentored 4 junior developers and established code quality standards across the engineering team."
        ]
      },
      {
        id: "exp-2",
        title: "Software Engineer",
        company: "Creative Web Co",
        dates: "2018 - 2021",
        description: [
          "Developed and maintained client-facing e-commerce platforms using the MERN stack.",
          "Implemented CI/CD pipelines using GitHub Actions, increasing release frequency by 300%.",
          "Collaborated with UX designers to improve accessibility, resulting in a 15% increase in user engagement."
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        school: "University of California, Berkeley",
        degree: "B.S. Computer Science",
        dates: "2014 - 2018",
        details: "Graduated with Honors, GPA 3.8"
      }
    ],
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "GraphQL", "PostgreSQL", "System Design"]
  },
  {
    fullName: "Sarah Jenkins",
    title: "Product Manager",
    email: "sarah.j@example.com",
    phone: "(555) 987-6543",
    location: "New York, NY",
    summary: "Strategic Product Manager with a background in data analytics and a passion for user-centric design. Skilled in roadmap planning, cross-functional leadership, and driving product growth through data-driven decision making.",
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