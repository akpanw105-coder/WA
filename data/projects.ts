export interface Project {
  id: string
  title: string
  subtitle: string
  category: 'Web' | 'Mobile'
  technologies: string[]
  description: string
  liveUrl: string
  image: string
  aspectRatio: 'landscape' | 'mobile'
}

export const PROJECTS: Project[] = [
  {
    id: 'fundly',
    title: 'Fundly',
    subtitle: 'Personal Finance App',
    category: 'Mobile',
    technologies: ['React Native', 'Supabase'],
    description: 'Income and expense tracking, transaction history, budgeting, savings goals, and financial analytics.',
    liveUrl: 'https://fundly-psi.vercel.app',
    image: '/images/projects/fundly.png',
    aspectRatio: 'mobile',
  },
  {
    id: 'crafted-barber',
    title: 'Crafted Barber',
    subtitle: 'Barber Booking App',
    category: 'Mobile',
    technologies: ['React Native', 'Supabase'],
    description: 'Customer authentication, barber appointment booking, and admin management.',
    liveUrl: 'https://crafted-barber-mu.vercel.app',
    image: '/images/projects/crafted-barber.png',
    aspectRatio: 'mobile',
  },
  {
    id: 'chow9ja',
    title: 'Chow9ja',
    subtitle: 'Food Ordering App',
    category: 'Mobile',
    technologies: ['React Native', 'Supabase', 'Stripe'],
    description: 'Food browsing, customer authentication, ordering, and payment functionality.',
    liveUrl: 'https://chow9ja.vercel.app',
    image: '/images/projects/chow9ja.png',
    aspectRatio: 'mobile',
  },
  {
    id: 'fitness-one',
    title: 'Fitness One',
    subtitle: 'Fitness App UI',
    category: 'Mobile',
    technologies: ['React Native'],
    description: 'A fitness application interface designed for gym and workout experiences.',
    liveUrl: 'https://fitness-khaki-kappa.vercel.app',
    image: '/images/projects/fitness-one.png',
    aspectRatio: 'mobile',
  },
  {
    id: 'cook-smart',
    title: 'Cook Smart',
    subtitle: 'AI Meal Discovery',
    category: 'Mobile',
    technologies: ['React Native', 'Google Gemini'],
    description: 'Users enter ingredients they have available and receive meal suggestions.',
    liveUrl: 'https://cook-smart-theta.vercel.app',
    image: '/images/projects/cook-smart.png',
    aspectRatio: 'mobile',
  },
  {
    id: 'atelier-two',
    title: 'Atelier Two',
    subtitle: 'Wristwatch E-commerce',
    category: 'Web',
    technologies: ['Next.js'],
    description: 'A wristwatch storefront with product showcases and online shopping.',
    liveUrl: 'https://atelier-two-ruby.vercel.app',
    image: '/images/projects/atelier-two.png',
    aspectRatio: 'landscape',
  },
  {
    id: 'coco-root',
    title: 'Coco Root',
    subtitle: 'Hair Care E-commerce',
    category: 'Web',
    technologies: ['Next.js', 'Stripe'],
    description: 'Hair-care product browsing, user login, and online payments.',
    liveUrl: 'https://coco-root.vercel.app',
    image: '/images/projects/coco-root.png',
    aspectRatio: 'landscape',
  },
]
