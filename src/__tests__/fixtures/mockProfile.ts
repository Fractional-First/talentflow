import type { ProfileData, Persona, Superpower } from '@/types/profile'

/**
 * Mock profile data for testing
 * Based on realistic executive profile structure
 */
export const mockPersonas: Persona[] = [
  {
    title: 'Strategic Growth Leader',
    bullets: [
      'Scaled SaaS companies from $5M to $50M ARR',
      'Built and led high-performing product teams',
      'Expert in product-led growth strategies',
    ],
  },
  {
    title: 'Operational Excellence Driver',
    bullets: [
      'Implemented OKR frameworks across organizations',
      'Reduced time-to-market by 40%',
      'Created scalable processes for rapid growth',
    ],
  },
]

export const mockSuperpowers: Superpower[] = [
  {
    title: 'Strategic Vision',
    description: 'Translating complex business challenges into actionable product roadmaps',
  },
  {
    title: 'Team Building',
    description: 'Recruiting and developing high-performing product and engineering teams',
  },
  {
    title: 'Stakeholder Alignment',
    description: 'Bringing together diverse stakeholders around a unified product strategy',
  },
]

export const mockProfileData: ProfileData = {
  name: 'Alex Johnson',
  role: 'Fractional Chief Product Officer',
  summary: 'Seasoned product leader with 15+ years of experience scaling B2B SaaS companies from Series A to IPO.',
  location: 'San Francisco, CA',
  personas: mockPersonas,
  meet_them: 'Alex is passionate about building products that solve real customer problems. Outside of work, they enjoy hiking in the Bay Area and mentoring early-stage founders.',
  sweetspot: 'B2B SaaS companies between $5M-$50M ARR looking to establish product-led growth strategies and build scalable product organizations.',
  highlights: [
    'Led product at 3 successful exits (2 acquisitions, 1 IPO)',
    'Built product teams from 5 to 50+ members',
    'Speaker at ProductCon and SaaStr',
  ],
  industries: ['Enterprise Software', 'FinTech', 'HealthTech', 'MarTech'],
  focus_areas: ['Product Strategy', 'Product-Led Growth', 'Team Building', 'Go-to-Market'],
  stage_focus: ['Series A', 'Series B', 'Growth Stage'],
  superpowers: mockSuperpowers,
  user_manual: 'I work best with clear context and autonomy. I prefer async communication for updates and sync meetings for strategic decisions.',
  certifications: ['Pragmatic Marketing Certified', 'Scrum Alliance CSPO'],
  education: ['MBA, Stanford Graduate School of Business', 'BS Computer Science, UC Berkeley'],
  functional_skills: {
    'Product Management': [
      { title: 'Roadmap Planning', description: 'Building and maintaining strategic product roadmaps' },
      { title: 'User Research', description: 'Conducting qualitative and quantitative user research' },
    ],
    'Leadership': [
      { title: 'Team Development', description: 'Growing and mentoring product managers' },
      { title: 'Executive Communication', description: 'Presenting to boards and executive teams' },
    ],
  },
  personal_interests: ['Hiking', 'Angel Investing', 'Mentorship'],
  geographical_coverage: ['United States', 'Canada', 'Western Europe'],
  profilePicture: 'https://example.com/profile.jpg',
  engagement_options: ['Fractional (2-3 days/week)', 'Advisory', 'Interim Full-Time'],
  profile_version: '0.3',
  linkedinurl: 'https://linkedin.com/in/alexjohnson',
}

/**
 * Mock RPC response for get_public_profile
 */
export const mockPublicProfileResponse = {
  profile_slug: 'alex-johnson-cpo',
  profile_data: mockProfileData,
  profile_version: '0.3',
  first_name: 'Alex',
  last_name: 'Johnson',
  linkedinurl: 'https://linkedin.com/in/alexjohnson',
}

/**
 * Mock RPC response for get_anon_profile
 */
export const mockAnonProfileResponse = {
  anon_slug: 'strategic-growth-leader-sf',
  anon_profile_data: {
    ...mockProfileData,
    name: undefined, // Anonymized
    linkedinurl: undefined, // Anonymized
  },
  profile_version: '0.3',
}

/**
 * Empty/minimal profile for edge case testing
 */
export const mockMinimalProfile: ProfileData = {
  name: 'Test User',
  role: 'Executive',
  profile_version: '0.1',
}
