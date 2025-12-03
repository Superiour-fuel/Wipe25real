import React, { useState, useRef } from 'react';
import { generateCoverLetter } from '../services/geminiService';

interface OpportunitiesPageProps {
  major: string;
  onBack: () => void;
}

interface Opportunity {
  id: string;
  type: 'INTERNSHIP' | 'COMPETITION' | 'FULL-TIME' | 'EVENT' | 'VOLUNTEER';
  title: string;
  company: string;
  location: string;
  time: string;
  icon: string;
}

interface Peer {
  id: string;
  name: string;
  role: string;
  school: string;
  image: string;
  common: string;
}

const OpportunitiesPage: React.FC<OpportunitiesPageProps> = ({ major, onBack }) => {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'network'>('opportunities');
  
  // Smart Apply State
  const [showSmartApplyModal, setShowSmartApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Opportunity | null>(null);
  const [applyStep, setApplyStep] = useState<'upload' | 'generating' | 'review' | 'success'>('upload');
  const [coverLetterText, setCoverLetterText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getOpportunities = (majorInput: string): Opportunity[] => {
    const m = majorInput.toLowerCase();
    
    // Helper to create opportunities easily
    const createOpp = (id: string, type: Opportunity['type'], title: string, company: string, location: string, icon: string, time: string = 'Flexible') => 
      ({ id, type, title, company, location, icon, time });

    let specific: Opportunity[] = [];

    // 1. LEGAL / LAW
    if (m.includes('law') || m.includes('legal') || m.includes('attorney') || m.includes('justice') || m.includes('policy') || m.includes('paralegal') || m.includes('crimin')) {
         specific = [
            createOpp('law-1', 'INTERNSHIP', 'Legal Intern', 'ACLU', 'New York, NY', '⚖️', 'Summer 2024'),
            createOpp('law-2', 'FULL-TIME', 'Junior Associate', 'Baker McKenzie', 'Chicago, IL', '💼', 'Starts Sep 2025'),
            createOpp('law-3', 'VOLUNTEER', 'Legal Aid Assistant', 'Community Justice Center', 'Local', '🤝', 'Flexible'),
            createOpp('law-4', 'COMPETITION', 'National Moot Court', 'American Bar Association', 'Washington DC', '🏛️', 'Nov 2024'),
            createOpp('law-5', 'INTERNSHIP', 'Summer Associate', 'Skadden', 'New York, NY', '🏙️', 'Summer 2024'),
            createOpp('law-6', 'FULL-TIME', 'Paralegal', 'Latham & Watkins', 'Los Angeles, CA', '📝', 'Immediate'),
            createOpp('law-7', 'INTERNSHIP', 'Judicial Intern', 'US District Court', 'Boston, MA', '⚖️', 'Summer 2024'),
            createOpp('law-8', 'EVENT', 'Future of Law Summit', 'LegalTech', 'San Francisco, CA', '🤖', 'Oct 2024'),
            createOpp('law-9', 'FULL-TIME', 'Policy Analyst', 'Brookings Institution', 'Washington DC', '📜', 'Starts Jul 2025'),
            createOpp('law-10', 'VOLUNTEER', 'Human Rights Watch', 'Remote', 'Global', '🌍', 'Weekly'),
            createOpp('law-11', 'INTERNSHIP', 'Corporate Law Intern', 'Google Legal Dept', 'Mountain View, CA', '🏢', 'Summer 2024'),
            createOpp('law-12', 'FULL-TIME', 'Compliance Officer', 'JP Morgan', 'New York, NY', '✅', 'Starts Jan 2025'),
            createOpp('law-13', 'COMPETITION', 'International Debate', 'Oxford Union', 'UK', '🎙️', 'Dec 2024'),
            createOpp('law-14', 'INTERNSHIP', 'Public Defender Intern', 'Public Defender Office', 'Seattle, WA', '🛡️', 'Summer 2024'),
            createOpp('law-15', 'FULL-TIME', 'Patent Agent', 'Tech Law Firm', 'Austin, TX', '💡', 'Immediate'),
            createOpp('law-16', 'VOLUNTEER', 'Tenant Advocacy', 'Housing Justice', 'Local', '🏠', 'Weekends'),
            createOpp('law-17', 'INTERNSHIP', 'Environmental Law', 'Sierra Club', 'San Francisco, CA', '🌲', 'Summer 2024'),
            createOpp('law-18', 'FULL-TIME', 'Clerkship', 'State Supreme Court', 'Sacramento, CA', '👨‍⚖️', 'Starts Aug 2025'),
            createOpp('law-19', 'EVENT', 'Bar Assoc. Networking', 'Local Chapter', 'City Center', '🥂', 'Monthly'),
            createOpp('law-20', 'INTERNSHIP', 'Immigration Law', 'IRC', 'New York, NY', '🛂', 'Summer 2024'),
         ];
    }
    // 2. CULINARY / FOOD
    else if (m.includes('cook') || m.includes('chef') || m.includes('culinary') || m.includes('food') || m.includes('baking') || m.includes('restaurant') || m.includes('hospitality')) {
        specific = [
            createOpp('food-1', 'INTERNSHIP', 'Culinary Intern', 'Eleven Madison Park', 'New York, NY', '👨‍🍳', 'Summer 2024'),
            createOpp('food-2', 'FULL-TIME', 'Sous Chef', 'Gordon Ramsay Steak', 'Las Vegas, NV', '🥩', 'Immediate'),
            createOpp('food-3', 'COMPETITION', 'Young Chef Olympiad', 'IIHM', 'India', '🏆', 'Jan 2025'),
            createOpp('food-4', 'VOLUNTEER', 'Community Kitchen', 'World Central Kitchen', 'Global', '🥘', 'Flexible'),
            createOpp('food-5', 'INTERNSHIP', 'Pastry Intern', 'Dominique Ansel Bakery', 'New York, NY', '🥐', 'Summer 2024'),
            createOpp('food-6', 'EVENT', 'Food & Wine Festival', 'Aspen', 'Colorado', '🍷', 'Jun 2025'),
            createOpp('food-7', 'FULL-TIME', 'Restaurant Manager', 'Chipotle Corporate', 'Newport Beach, CA', '🌯', 'Starts Feb 2025'),
            createOpp('food-8', 'INTERNSHIP', 'Food Science R&D', 'Impossible Foods', 'Redwood City, CA', '🔬', 'Summer 2024'),
            createOpp('food-9', 'FULL-TIME', 'Head Baker', 'Tartine', 'San Francisco, CA', '🍞', 'Immediate'),
            createOpp('food-10', 'VOLUNTEER', 'Food Bank Coordinator', 'Feeding America', 'Local', '🥫', 'Weekly'),
            createOpp('food-11', 'INTERNSHIP', 'Test Kitchen Assistant', 'Bon Appétit', 'New York, NY', '📹', 'Spring 2024'),
            createOpp('food-12', 'COMPETITION', 'Bocuse d\'Or Selection', 'Lyon, France', '🇫🇷', 'Sep 2024'),
            createOpp('food-13', 'FULL-TIME', 'Sommelier', 'The French Laundry', 'Yountville, CA', '🍾', 'Starts Mar 2025'),
            createOpp('food-14', 'INTERNSHIP', 'Farm-to-Table', 'Blue Hill at Stone Barns', 'Pocantico Hills, NY', '🌱', 'Summer 2024'),
            createOpp('food-15', 'FULL-TIME', 'Food Critic / Writer', 'Eater', 'Remote', '✍️', 'Flexible'),
            createOpp('food-16', 'EVENT', 'Michelin Guide Gala', 'Michelin', 'Paris', '⭐', 'Oct 2024'),
            createOpp('food-17', 'INTERNSHIP', 'Hospitality Management', 'Marriott International', 'Bethesda, MD', '🏨', 'Summer 2024'),
            createOpp('food-18', 'FULL-TIME', 'Private Chef', 'High Net Worth Client', 'Hamptons, NY', '🛥️', 'Summer Season'),
            createOpp('food-19', 'VOLUNTEER', 'Nutrition Education', 'Public Schools', 'Local', '🍎', 'Weekdays'),
            createOpp('food-20', 'FULL-TIME', 'Product Developer', 'Ben & Jerry\'s', 'Burlington, VT', '🍦', 'Starts Jan 2025'),
        ];
    }
    // 3. CS / Tech
    else if (m.includes('computer') || m.includes('tech') || m.includes('data') || m.includes('software') || m.includes('cyber') || m.includes('engineer') || m.includes('it')) {
        specific = [
            createOpp('cs-1', 'INTERNSHIP', 'Software Engineer Intern', 'Google', 'Mountain View, CA', '💻', 'Summer 2024'),
            createOpp('cs-2', 'COMPETITION', 'Global AI Hackathon', 'OpenAI', 'Remote', '🤖', 'Oct 15, 2024'),
            createOpp('cs-3', 'FULL-TIME', 'Junior DevOps Engineer', 'Netflix', 'Los Gatos, CA', '☁️', 'Starts Jan 2025'),
            createOpp('cs-4', 'INTERNSHIP', 'Cybersecurity Analyst', 'CrowdStrike', 'Austin, TX', '🔒', 'Summer 2024'),
            createOpp('cs-5', 'EVENT', 'TechCrunch Disrupt', 'TechCrunch', 'San Francisco, CA', '🎟️', 'Sep 2024'),
            createOpp('cs-6', 'VOLUNTEER', 'Code for America Fellow', 'Code for America', 'Remote', '🇺🇸', 'Flexible'),
            createOpp('cs-7', 'INTERNSHIP', 'Data Science Intern', 'Spotify', 'New York, NY', '📊', 'Summer 2024'),
            createOpp('cs-8', 'COMPETITION', 'Google Code Jam', 'Google', 'Online', '🏆', 'Nov 2024'),
            createOpp('cs-9', 'FULL-TIME', 'Frontend Developer', 'Vercel', 'Remote', '▲', 'Immediate'),
            createOpp('cs-10', 'INTERNSHIP', 'Product Manager Intern', 'Uber', 'San Francisco, CA', '🚗', 'Summer 2024'),
            createOpp('cs-11', 'FULL-TIME', 'Data Engineer', 'Meta', 'Menlo Park, CA', '💾', 'Starts Feb 2025'),
            createOpp('cs-12', 'INTERNSHIP', 'AI Research Intern', 'DeepMind', 'London, UK', '🧠', 'Summer 2024'),
            createOpp('cs-13', 'FULL-TIME', 'Cloud Architect', 'AWS', 'Seattle, WA', '☁️', 'Starts Mar 2025'),
            createOpp('cs-14', 'INTERNSHIP', 'Game Developer Intern', 'Rockstar Games', 'San Diego, CA', '🎮', 'Summer 2024'),
            createOpp('cs-15', 'FULL-TIME', 'Mobile Developer', 'Snap Inc.', 'Los Angeles, CA', '👻', 'Immediate'),
            createOpp('cs-16', 'INTERNSHIP', 'Systems Analyst', 'Oracle', 'Redwood City, CA', '📉', 'Spring 2024'),
            createOpp('cs-17', 'FULL-TIME', 'QA Automation Engineer', 'Electronic Arts', 'Vancouver, BC', '🐞', 'Starts Jan 2025'),
            createOpp('cs-18', 'INTERNSHIP', 'Blockchain Developer', 'Coinbase', 'Remote', '⛓️', 'Summer 2024'),
            createOpp('cs-19', 'VOLUNTEER', 'IT Support Volunteer', 'Local University', 'Boston, MA', '🎓', 'Weekends'),
            createOpp('cs-20', 'FULL-TIME', 'Network Engineer', 'Cisco', 'San Jose, CA', '🌐', 'Immediate'),
        ];
    } 
    // 4. Business / Finance
    else if (m.includes('business') || m.includes('finance') || m.includes('market') || m.includes('econ') || m.includes('account') || m.includes('management')) {
        specific = [
            createOpp('biz-1', 'INTERNSHIP', 'Investment Banking Analyst', 'Goldman Sachs', 'New York, NY', '💰', 'Summer 2024'),
            createOpp('biz-2', 'COMPETITION', 'Business Case Competition', 'Harvard Business School', 'Boston, MA', '📉', 'Nov 2024'),
            createOpp('biz-3', 'FULL-TIME', 'Marketing Associate', 'Procter & Gamble', 'Cincinnati, OH', '🧼', 'Jun 2025'),
            createOpp('biz-4', 'INTERNSHIP', 'Supply Chain Intern', 'Amazon', 'Seattle, WA', '📦', 'Summer 2024'),
            createOpp('biz-5', 'EVENT', 'Forbes Under 30 Summit', 'Forbes', 'Detroit, MI', '🎤', 'Oct 2024'),
            createOpp('biz-6', 'VOLUNTEER', 'Non-Profit Treasurer', 'Local Charity', 'Remote', '🤝', 'Weekly'),
            createOpp('biz-7', 'INTERNSHIP', 'Digital Marketing Intern', 'Nike', 'Beaverton, OR', '👟', 'Summer 2024'),
            createOpp('biz-8', 'FULL-TIME', 'Consultant', 'McKinsey & Company', 'Chicago, IL', '📊', 'Starts Aug 2025'),
            createOpp('biz-9', 'COMPETITION', 'Stock Pitch Challenge', 'Wall St Club', 'New York, NY', '📈', 'Dec 2024'),
            createOpp('biz-10', 'INTERNSHIP', 'HR Generalist', 'LinkedIn', 'Sunnyvale, CA', '👥', 'Summer 2024'),
            createOpp('biz-11', 'FULL-TIME', 'Business Analyst', 'Deloitte', 'New York, NY', '💼', 'Starts Jan 2025'),
            createOpp('biz-12', 'INTERNSHIP', 'Sales Representative', 'Salesforce', 'San Francisco, CA', '🤝', 'Summer 2024'),
            createOpp('biz-13', 'FULL-TIME', 'Brand Manager', 'Coca-Cola', 'Atlanta, GA', '🥤', 'Starts Feb 2025'),
            createOpp('biz-14', 'INTERNSHIP', 'Audit Intern', 'PwC', 'Chicago, IL', '📝', 'Winter 2024'),
            createOpp('biz-15', 'FULL-TIME', 'Operations Manager', 'Target HQ', 'Minneapolis, MN', '🎯', 'Immediate'),
            createOpp('biz-16', 'FULL-TIME', 'Financial Advisor', 'Merrill Lynch', 'Charlotte, NC', '💵', 'Starts Mar 2025'),
            createOpp('biz-17', 'EVENT', 'Global Entrepreneurship Summit', 'GES', 'Dubai, UAE', '🌍', 'Dec 2024'),
            createOpp('biz-18', 'FULL-TIME', 'Project Manager', 'Visa', 'Foster City, CA', '💳', 'Immediate'),
            createOpp('biz-19', 'INTERNSHIP', 'Real Estate Analyst', 'CBRE', 'Los Angeles, CA', '🏢', 'Summer 2024'),
            createOpp('biz-20', 'FULL-TIME', 'Customer Success Manager', 'HubSpot', 'Cambridge, MA', '🧡', 'Starts Jan 2025'),
        ];
    }
    // 5. Arts / Design
    else if (m.includes('art') || m.includes('design') || m.includes('music') || m.includes('film') || m.includes('creative') || m.includes('architect')) {
         specific = [
            createOpp('art-1', 'INTERNSHIP', 'Graphic Design Intern', 'Pentagram', 'New York, NY', '🎨', 'Summer 2024'),
            createOpp('art-2', 'COMPETITION', 'Adobe Creative Jam', 'Adobe', 'Virtual', '🖌️', 'Oct 2024'),
            createOpp('art-3', 'FULL-TIME', 'UX Designer', 'Airbnb', 'San Francisco, CA', '📱', 'Starts Jan 2025'),
            createOpp('art-4', 'EVENT', 'Sundance Film Festival', 'Sundance Institute', 'Park City, UT', '🎬', 'Jan 2025'),
            createOpp('art-5', 'VOLUNTEER', 'Community Art Teacher', 'City Arts', 'Local', '🖍️', 'Weekends'),
            createOpp('art-6', 'INTERNSHIP', 'Fashion Merchandising', 'Vogue', 'New York, NY', '👗', 'Summer 2024'),
            createOpp('art-7', 'COMPETITION', 'Short Film Contest', 'Cannes', 'France (Remote)', '🎥', 'Dec 2024'),
            createOpp('art-8', 'FULL-TIME', 'Junior Architect', 'Gensler', 'Los Angeles, CA', '🏗️', 'Jun 2025'),
            createOpp('art-9', 'INTERNSHIP', 'Animation Intern', 'Pixar', 'Emeryville, CA', '💡', 'Summer 2024'),
            createOpp('art-10', 'EVENT', 'Design Week', 'AIGA', 'Austin, TX', '🎫', 'Nov 2024'),
            createOpp('art-11', 'FULL-TIME', 'Art Director', 'Ogilvy', 'Chicago, IL', '🖼️', 'Starts Feb 2025'),
            createOpp('art-12', 'INTERNSHIP', 'Photojournalism Intern', 'National Geographic', 'Washington DC', '📸', 'Summer 2024'),
            createOpp('art-13', 'FULL-TIME', 'Video Editor', 'YouTube Studios', 'Los Angeles, CA', '📼', 'Immediate'),
            createOpp('art-14', 'INTERNSHIP', '3D Modeler', 'DreamWorks', 'Glendale, CA', '🐉', 'Summer 2024'),
            createOpp('art-15', 'FULL-TIME', 'Interior Designer', 'IKEA', 'Conshohocken, PA', '🛋️', 'Starts Mar 2025'),
            createOpp('art-16', 'INTERNSHIP', 'Fashion Stylist Asst', 'Zara', 'New York, NY', '👚', 'Spring 2024'),
            createOpp('art-17', 'FULL-TIME', 'Museum Curator', 'MoMA', 'New York, NY', '🏛️', 'Starts Jan 2025'),
            createOpp('art-18', 'FULL-TIME', 'Senior Copywriter', 'Leo Burnett', 'Chicago, IL', '✍️', 'Immediate'),
            createOpp('art-19', 'INTERNSHIP', 'Sound Engineer', 'Sony Music', 'Nashville, TN', '🎵', 'Summer 2024'),
            createOpp('art-20', 'FULL-TIME', 'Freelance Illustrator', 'Remote', 'Global', '✏️', 'Flexible'),
         ];
    }
    // 6. Science / Health
    else if (m.includes('bio') || m.includes('chem') || m.includes('health') || m.includes('nurs') || m.includes('psych') || m.includes('doctor') || m.includes('med')) {
        specific = [
            createOpp('sci-1', 'INTERNSHIP', 'R&D Intern', 'Pfizer', 'Groton, CT', '🧪', 'Summer 2024'),
            createOpp('sci-2', 'VOLUNTEER', 'Clinical Shadowing', 'Mayo Clinic', 'Rochester, MN', '🏥', 'Flexible'),
            createOpp('sci-3', 'FULL-TIME', 'Research Associate', 'Broad Institute', 'Cambridge, MA', '🧬', 'Starts Jun 2025'),
            createOpp('sci-4', 'EVENT', 'Global Health Conference', 'WHO', 'Geneva (Virtual)', '🌍', 'Nov 2024'),
            createOpp('sci-5', 'INTERNSHIP', 'Public Health Intern', 'CDC', 'Atlanta, GA', '🦠', 'Summer 2024'),
            createOpp('sci-6', 'COMPETITION', 'iGEM Competition', 'iGEM Foundation', 'Paris, France', '🔬', 'Oct 2024'),
            createOpp('sci-7', 'FULL-TIME', 'Registered Nurse', 'Kaiser Permanente', 'Oakland, CA', '🩺', 'Immediate'),
            createOpp('sci-8', 'VOLUNTEER', 'Crisis Counselor', 'Crisis Text Line', 'Remote', '💬', 'Weekly'),
            createOpp('sci-9', 'INTERNSHIP', 'Environmental Science', 'EPA', 'Washington DC', '🌱', 'Summer 2024'),
            createOpp('sci-10', 'COMPETITION', 'Neuroscience Hackathon', 'BrainInit', 'Online', '🧠', 'Dec 2024'),
            createOpp('sci-11', 'FULL-TIME', 'Lab Technician', 'Quest Diagnostics', 'Secaucus, NJ', '🧫', 'Starts Jan 2025'),
            createOpp('sci-12', 'INTERNSHIP', 'Pharmacy Intern', 'CVS Health', 'Woonsocket, RI', '💊', 'Summer 2024'),
            createOpp('sci-13', 'FULL-TIME', 'Geologist', 'Shell', 'Houston, TX', '🪨', 'Starts Feb 2025'),
            createOpp('sci-14', 'INTERNSHIP', 'Astronomy Research', 'NASA', 'Greenbelt, MD', '🔭', 'Summer 2024'),
            createOpp('sci-15', 'FULL-TIME', 'Marine Biologist', 'NOAA', 'Silver Spring, MD', '🐬', 'Starts Mar 2025'),
            createOpp('sci-16', 'VOLUNTEER', 'Veterinary Assistant', 'Local Animal Hospital', 'Denver, CO', '🐕', 'Weekends'),
            createOpp('sci-17', 'FULL-TIME', 'Nutritionist', 'Whole Foods Market', 'Austin, TX', '🥗', 'Immediate'),
            createOpp('sci-18', 'FULL-TIME', 'Physical Therapist', 'Athletico', 'Chicago, IL', '💪', 'Starts Jan 2025'),
            createOpp('sci-19', 'INTERNSHIP', 'Genetics Researcher', '23andMe', 'Sunnyvale, CA', '🧬', 'Summer 2024'),
            createOpp('sci-20', 'FULL-TIME', 'Forensic Scientist', 'FBI', 'Quantico, VA', '🔎', 'Starts Apr 2025'),
        ];
    }
    // 7. General Humanities / Social Sciences
    else {
         specific = [
            createOpp('gen-1', 'VOLUNTEER', 'Literacy Tutor', 'Reading Partners', 'Local Library', '📚', 'Weekly'),
            createOpp('gen-2', 'FULL-TIME', 'Teacher (Teach for America)', 'TFA', 'Various', '🍎', 'Starts Aug 2025'),
            createOpp('gen-3', 'INTERNSHIP', 'Editorial Intern', 'Penguin Random House', 'New York, NY', '📖', 'Summer 2024'),
            createOpp('gen-4', 'EVENT', 'Writers Conference', 'AWP', 'Seattle, WA', '✍️', 'Feb 2025'),
            createOpp('gen-5', 'COMPETITION', 'National Debate Championship', 'NDA', 'Chicago, IL', '🎙️', 'Nov 2024'),
            createOpp('gen-6', 'VOLUNTEER', 'Museum Docent', 'Smithsonian', 'Washington DC', '🖼️', 'Weekends'),
            createOpp('gen-7', 'INTERNSHIP', 'Social Media Coordinator', 'Non-Profit', 'Remote', '📱', 'Summer 2024'),
            createOpp('gen-8', 'COMPETITION', 'Model UN', 'United Nations', 'New York, NY', '🇺🇳', 'Oct 2024'),
            createOpp('gen-9', 'FULL-TIME', 'Journalist', 'New York Times', 'New York, NY', '📰', 'Starts Feb 2025'),
            createOpp('gen-10', 'FULL-TIME', 'Social Worker', 'Red Cross', 'Washington DC', '❤️', 'Immediate'),
            createOpp('gen-11', 'FULL-TIME', 'Librarian', 'Public Library', 'Portland, OR', '🤫', 'Starts Jan 2025'),
            createOpp('gen-12', 'INTERNSHIP', 'Translator', 'United Nations', 'Geneva', '🗣️', 'Summer 2024'),
            createOpp('gen-13', 'FULL-TIME', 'Urban Planner', 'City Government', 'Austin, TX', '🏙️', 'Immediate'),
            createOpp('gen-14', 'FULL-TIME', 'HR Manager', 'Walmart Corp', 'Bentonville, AR', '👔', 'Starts Feb 2025'),
            createOpp('gen-15', 'VOLUNTEER', 'Grant Writer', 'Community Foundation', 'Remote', '💵', 'Flexible'),
            createOpp('gen-16', 'FULL-TIME', 'Public Relations Specialist', 'Edelman', 'New York, NY', '📢', 'Starts Jan 2025'),
            createOpp('gen-17', 'INTERNSHIP', 'Event Planner', 'Live Nation', 'Los Angeles, CA', '🎫', 'Summer 2024'),
            createOpp('gen-18', 'FULL-TIME', 'Recruiter', 'Robert Half', 'Denver, CO', '🔎', 'Immediate'),
            createOpp('gen-19', 'VOLUNTEER', 'ESL Tutor', 'Community Center', 'Local', '🗣️', 'Weekends'),
            createOpp('gen-20', 'INTERNSHIP', 'History Researcher', 'National Archives', 'Washington DC', '🏺', 'Summer 2024'),
         ];
    }

    return specific;
  };

  const getNetwork = (majorInput: string): Peer[] => {
      const schools = ['Stanford', 'MIT', 'UC Berkeley', 'Georgia Tech', 'University of Michigan', 'CMU', 'Harvard', 'UCLA', 'UT Austin', 'Cornell'];
      const roles = ['Senior', 'Junior', 'Sophomore', 'Grad Student', 'PhD Candidate'];
      const images = [
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          'https://images.unsplash.com/photo-1521119989659-a83eee488058?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      ];
      const names = ['Sarah Miller', 'David Chen', 'Emily Johnson', 'Michael Ross', 'Jessica Wu', 'Alex Thompson', 'Maria Garcia', 'James Wilson', 'Linda Martinez', 'Robert Taylor'];
      
      return Array.from({ length: 10 }).map((_, i) => ({
          id: `p${i}`,
          name: names[i],
          role: `${roles[i % roles.length]}, ${majorInput}`,
          school: schools[i],
          image: images[i],
          common: `Studying ${majorInput}`
      }));
  };

  const opportunities = getOpportunities(major);
  const volunteerOpps = opportunities.filter(o => o.type === 'VOLUNTEER');
  const internshipOpps = opportunities.filter(o => o.type === 'INTERNSHIP');
  const fulltimeOpps = opportunities.filter(o => o.type === 'FULL-TIME');

  const network = getNetwork(major);

  const startSmartApply = (job: Opportunity) => {
    setSelectedJob(job);
    setApplyStep('upload');
    setShowSmartApplyModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && selectedJob) {
      const file = e.target.files[0];
      setApplyStep('generating');
      
      try {
        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          
          const generatedLetter = await generateCoverLetter(
            selectedJob.title,
            selectedJob.company,
            { data: base64, mimeType: file.type }
          );
          
          setCoverLetterText(generatedLetter);
          setApplyStep('review');
        };
      } catch (error) {
        console.error("Error generating cover letter", error);
        alert("Failed to generate cover letter. Please try again.");
        setApplyStep('upload');
      }
    }
  };

  const handleApprove = () => {
    setApplyStep('success');
  };

  const renderOpportunityCard = (opp: Opportunity) => (
    <div key={opp.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col gap-4 h-full">
        <div className="flex justify-between items-start">
            <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center text-2xl border border-gray-100 shrink-0">
                {opp.icon}
            </div>
            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                opp.type === 'VOLUNTEER' ? 'bg-green-100 text-green-800' : 
                opp.type === 'INTERNSHIP' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
                {opp.type}
            </div>
        </div>
        
        <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{opp.title}</h3>
            <div className="text-sm text-gray-600 font-medium mb-3">{opp.company}</div>
            
            <div className="flex flex-col gap-1 text-xs text-gray-500 font-medium uppercase tracking-wide">
                <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {opp.location}
                </span>
                <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {opp.time}
                </span>
            </div>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
            <button className="w-full py-2 bg-white border border-black text-black font-bold text-xs tracking-widest hover:bg-black hover:text-white transition-all uppercase rounded">
                {opp.type === 'VOLUNTEER' ? 'Volunteer' : 'Apply'}
            </button>
            <button 
                onClick={() => startSmartApply(opp)}
                className="w-full py-2 bg-[#DA7756] border border-[#DA7756] text-white font-bold text-xs tracking-widest hover:bg-[#c35e3d] hover:border-[#c35e3d] transition-all uppercase flex items-center justify-center gap-2 rounded shadow-sm"
            >
                <span>✨</span> Smart Apply
            </button>
        </div>
    </div>
  );

  return (
    <div className="h-screen overflow-y-auto bg-[#F8F9FA] font-sans text-gray-900 relative">
      
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={onBack}>
              <div className="flex-shrink-0 flex items-center gap-2">
                 <div className="w-8 h-8 text-black">
                     <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path d="M50 5 L92 28 V72 L50 95 L8 72 V28 L50 5 Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
                        <path d="M24 62 H76" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
                        <path d="M28 62 L50 35 L72 62" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M50 35 V62" stroke="currentColor" strokeWidth="4"/>
                        <path d="M35 78 H65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
                        <path d="M42 86 H58" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
                    </svg>
                 </div>
                 <span className="font-extrabold text-xl tracking-tight">TALENT BRIDGE</span>
              </div>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <button 
                onClick={() => setActiveTab('opportunities')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold uppercase tracking-wide h-16 transition-colors ${activeTab === 'opportunities' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Opportunities
              </button>
              <button 
                onClick={() => setActiveTab('network')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold uppercase tracking-wide h-16 transition-colors ${activeTab === 'network' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Network
              </button>
            </div>

            <div className="flex items-center gap-4">
                <button 
                    onClick={onBack}
                    className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    HOME
                </button>
                <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-gray-800 transition-colors">
                    ME
                </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Banner */}
      <div className="bg-black text-white py-12 px-6">
          <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Matches</h1>
              <p className="text-xl text-gray-300 font-light">
                  We identified your core strengths in <span className="text-white font-bold uppercase">{major}</span>.
                  {activeTab === 'opportunities' 
                    ? ` Here are the top opportunities curated for you.` 
                    : ` Connect with others studying the same field.`}
              </p>
          </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Tab Content */}
        {activeTab === 'opportunities' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: Volunteer */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <span className="text-2xl">🤝</span>
                        <h2 className="text-xl font-bold text-gray-900">Volunteer</h2>
                        <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">{volunteerOpps.length}</span>
                    </div>
                    {volunteerOpps.length > 0 ? (
                        volunteerOpps.map(renderOpportunityCard)
                    ) : (
                        <div className="text-gray-400 text-sm italic py-4">No volunteer opportunities found.</div>
                    )}
                </div>

                {/* Column 2: Internships */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <span className="text-2xl">💼</span>
                        <h2 className="text-xl font-bold text-gray-900">Internships</h2>
                        <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">{internshipOpps.length}</span>
                    </div>
                    {internshipOpps.length > 0 ? (
                        internshipOpps.map(renderOpportunityCard)
                    ) : (
                         <div className="text-gray-400 text-sm italic py-4">No internships found.</div>
                    )}
                </div>

                {/* Column 3: Full-Time */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <span className="text-2xl">🚀</span>
                        <h2 className="text-xl font-bold text-gray-900">Full-Time</h2>
                        <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">{fulltimeOpps.length}</span>
                    </div>
                    {fulltimeOpps.length > 0 ? (
                        fulltimeOpps.map(renderOpportunityCard)
                    ) : (
                         <div className="text-gray-400 text-sm italic py-4">No full-time jobs found.</div>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'network' && (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {network.map((peer) => (
                    <div key={peer.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <img src={peer.image} alt={peer.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100" />
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{peer.name}</h3>
                                <p className="text-sm text-gray-600">{peer.school}</p>
                            </div>
                        </div>
                        <div className="mb-6">
                             <div className="text-sm font-semibold text-gray-800 mb-1">{peer.role}</div>
                             <div className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                                {peer.common}
                             </div>
                        </div>
                        <button className="w-full py-2 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors rounded-sm">
                            CONNECT
                        </button>
                    </div>
                ))}
             </div>
        )}

      </main>

      {/* Smart Apply Modal */}
      {showSmartApplyModal && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSmartApplyModal(false)}></div>
              <div className="relative bg-white rounded-xl max-w-lg w-full p-8 shadow-2xl animate-fade-in-up">
                  <button 
                      onClick={() => setShowSmartApplyModal(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>

                  {/* Modal Header */}
                  <div className="mb-6">
                      <div className="text-[#DA7756] font-bold text-xs tracking-widest uppercase mb-1">Smart Apply</div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                      <p className="text-gray-500">{selectedJob.company}</p>
                  </div>

                  {/* Step 1: Upload */}
                  {applyStep === 'upload' && (
                      <div className="text-center py-8">
                          <div className="mb-6">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
                                  📄
                              </div>
                              <h3 className="text-lg font-bold mb-2">Upload your Resume</h3>
                              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                  We'll analyze your resume against the job description to draft a tailored cover letter.
                              </p>
                          </div>
                          <input 
                              type="file" 
                              ref={fileInputRef}
                              className="hidden" 
                              accept="application/pdf,image/*"
                              onChange={handleFileUpload}
                          />
                          <button 
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                          >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                              Select Resume (PDF)
                          </button>
                      </div>
                  )}

                  {/* Step 2: Generating */}
                  {applyStep === 'generating' && (
                      <div className="text-center py-12">
                          <div className="inline-block mb-6">
                              <svg className="animate-spin w-12 h-12 text-[#DA7756]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">Analyzing Profile...</h3>
                          <p className="text-gray-500 text-sm">Drafting a personalized cover letter for {selectedJob.company}.</p>
                      </div>
                  )}

                  {/* Step 3: Review */}
                  {applyStep === 'review' && (
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Review Cover Letter</label>
                          <textarea 
                              value={coverLetterText}
                              onChange={(e) => setCoverLetterText(e.target.value)}
                              className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm leading-relaxed text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#DA7756] focus:border-transparent resize-none mb-6 font-serif"
                          ></textarea>
                          <div className="flex gap-4">
                              <button 
                                  onClick={() => setApplyStep('upload')}
                                  className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                  Cancel
                              </button>
                              <button 
                                  onClick={handleApprove}
                                  className="flex-1 py-3 bg-[#DA7756] text-white font-bold rounded-lg hover:bg-[#c35e3d] transition-colors shadow-lg shadow-orange-500/30"
                              >
                                  Approve & Apply
                              </button>
                          </div>
                      </div>
                  )}

                  {/* Step 4: Success */}
                  {applyStep === 'success' && (
                      <div className="text-center py-8">
                          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-4xl mb-6 text-green-600 animate-bounce">
                              ✓
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Sent!</h3>
                          <p className="text-gray-500 mb-8">
                              Your application for <span className="font-bold text-gray-800">{selectedJob.title}</span> has been submitted successfully to {selectedJob.company}.
                          </p>
                          <button 
                              onClick={() => setShowSmartApplyModal(false)}
                              className="w-full py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
                          >
                              Close
                          </button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
          <div className="bg-black text-white p-4 rounded-full shadow-lg">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </div>
      </div>
      
      <style>{`
          .animate-fade-in-up {
              animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              opacity: 0;
              transform: translateY(20px);
          }
          @keyframes fadeInUp {
              to {
                  opacity: 1;
                  transform: translateY(0);
              }
          }
      `}</style>
    </div>
  );
};

export default OpportunitiesPage;