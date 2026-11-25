import type { PuppyMediaItem } from './puppies';

export const SITE = {
  name: 'TeddyPups U.A.E.',
  shortName: 'TeddyPups',
  tagline: 'every puppy is family',
  description:
    'TeddyPups U.A.E. is a Dubai-based brand specializing in miniature puppies, offering premium services and worldwide shipping.',
  whatsappHref:
    "https://wa.me/919898124987?text=Hi%20Insta%20Biz%20Web%2C%20I'd%20like%20to%20discuss%20a%20project.",
  phoneDisplay: '+971 50 000 0000',
  phoneHref: 'tel:+971500000000',
  email: 'info@instabizweb.com',
  address: 'Downtown Dubai, United Arab Emirates',
  socialHref: 'https://www.instabizweb.com/',
  socials: [
    { label: 'Instagram', href: 'https://www.instabizweb.com/' },
    { label: 'TikTok', href: 'https://www.instabizweb.com/' },
    { label: 'Facebook', href: 'https://www.instabizweb.com/' },
  ],
};

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    "id": "2bcfc70e-8c06-475d-aa8a-2b64932d30cc",
    "question": "Are your puppies vaccinated and health-checked?",
    "answer": "Yes. All our puppies come with a verified health certificate from licensed vets. Every puppy is vaccinated, dewormed, and thoroughly checked before joining your family."
  },
  {
    "id": "45fb5252-c038-41c7-afae-c8478b8f4f76",
    "question": "Can I meet a puppy before I decide?",
    "answer": "Yes. Come meet our locally available puppies in our Downtown Dubai showroom and spend time bonding before making your decision."
  },
  {
    "id": "9585fb34-9d0d-4ee3-a903-38442633135d",
    "question": "Can I take my puppy home the same day?",
    "answer": "Local puppies are available immediately, so you can take your puppy home the same day."
  },
  {
    "id": "bd85389d-2116-4c4b-8500-0a5a82cae22c",
    "question": "Do you import puppies from abroad?",
    "answer": "Yes. Through our Order Upon Request service we source rare and premium teacup breeds from the most reputable, certified breeders across Europe, Korea, and beyond — and we handle the import for you."
  },
  {
    "id": "9c865c5e-bd1e-4bd3-9c09-cf193923123e",
    "question": "How does an imported puppy travel to Dubai?",
    "answer": "We manage every part of the import process, including health checks, travel arrangements, and the necessary documentation, so your puppy arrives happy, healthy, and stress-free."
  },
  {
    "id": "18483536-4415-4cc9-8ef8-913421f9da89",
    "question": "Will I see photos and health details first?",
    "answer": "Yes. Photos, videos, and health certificates are shared before your puppy travels, and our team sends real photos and health details directly on WhatsApp."
  },
  {
    "id": "653f64ec-6e3a-4e3a-b4ab-8862b96fd123",
    "question": "Do you deliver?",
    "answer": "Yes. We deliver within Dubai, and our trusted international cargo partners deliver puppies safely to loving homes all around the world."
  },
  {
    "id": "c7990450-8c87-47f5-9ebe-1490c7f47ffa",
    "question": "Which breeds do you usually have?",
    "answer": "Breeds we regularly have include Maltipoo, Pomeranian, Poodle and Bichon, plus rare teacup lines such as Korean teacup poodles, Maltese, Pom and Yorkie."
  },
  {
    "id": "67b95211-ac7c-4582-a684-90fcd4e00812",
    "question": "Is there help after my puppy comes home?",
    "answer": "Yes. Our team is available 24/7 and offers advice on training, nutrition, and general care to ensure a smooth transition for you and your new furry friend."
  }
];

export interface JourneyStep {
  title: string;
  text: string;
}

export interface JourneyConfig {
  key: 'local' | 'imported';
  label: string;
  hint: string;
  heading: string;
  body: string;
  note: string;
  steps: JourneyStep[];
}

export type ChatStepItem = JourneyStep;
export type MediaItem = PuppyMediaItem;
export type HowItWorksJourney = JourneyConfig;

export const HOW_IT_WORKS_JOURNEYS: JourneyConfig[] = [
  {
    "key": "local",
    "label": "In Dubai",
    "hint": "meet in person",
    "heading": "Meet your puppy in person",
    "body": "Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face. We source healthy, well-socialized puppies from trusted local breeders, ensuring they're raised with care, proper nutrition, and veterinary checks.",
    "note": "",
    "steps": [
      {
        "text": "Browse our website to view the available puppies. Each listing includes photos, breed details, age, and health information.",
        "title": "Explore our puppies"
      },
      {
        "text": "Once you find a puppy you love, open their profile for more information or to enquire further. You can also reach out to us directly if you have any questions.",
        "title": "Choose your puppy"
      },
      {
        "text": "Spend time bonding before making your decision.",
        "title": "Meet before you choose"
      },
      {
        "text": "Pick up your puppy from us or have them delivered to your home within Dubai. Our delivery service is safe and reliable, ensuring your puppy arrives comfortably.",
        "title": "Pick-up or delivery"
      }
    ]
  },
  {
    "key": "imported",
    "label": "Imported",
    "hint": "order upon request",
    "heading": "Order upon request",
    "body": "Looking for a truly exceptional companion? Our Order Upon Request service gives you access to some of the world's most sought-after teacup breeds — ethically sourced from the most reputable, certified breeders across Europe, Korea, and beyond.",
    "note": "From Korean teacup poodles to rare Maltese, Pom, and Yorkie lines, we bring the world's finest puppies to Dubai, just for you.",
    "steps": [
      {
        "text": "Browse our selection of available breeds and place a reservation for the teacup puppy that captures your heart. Our reservation-only model ensures that each puppy is specifically sourced to meet your preferences.",
        "title": "Reserve your puppy"
      },
      {
        "text": "Once your reservation is confirmed, we will work closely with you to finalize details and provide updates on your puppy's journey.",
        "title": "Personalized consultation"
      },
      {
        "text": "We manage all aspects of the import process, including health checks, travel arrangements, and necessary documentation. Your puppy will be carefully transported and will arrive ready to join your family.",
        "title": "Import and arrival"
      },
      {
        "text": "Upon arrival, we provide support to help your new puppy acclimate to their new environment. Our team is available for any additional assistance and to ensure a smooth transition into your home.",
        "title": "Welcome home"
      }
    ]
  }
];

export const HOME_CHAT_STEPS: JourneyStep[] = [
  {
    title: 'Choose your breed',
    text: "Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle.",
  },
  {
    title: 'Get photos & details',
    text: 'Our team will share real photos, health details, and all necessary information directly on WhatsApp.',
  },
  {
    title: 'Secure & safe delivery',
    text: 'Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free.',
  },
];

export const CHAT_SHOWCASE_MEDIA: PuppyMediaItem[] = [
  {
    id: 'FHyoHcIosLZE',
    url: '/media/FHyoHcIosLZE/60f6e7e00a/27b888_323008bb0f6a41d4bde2a0da7206cd98f000.jpg',
    kind: 'image',
    width: 1080,
    height: 1920,
    alt: 'A tiny apricot teddy bear puppy held up in the TeddyPups showroom',
    caption: '',
    focalX: 0.543,
    focalY: 0.483,
    color: '#685848',
  },
  {
    id: 'Vi-kzyvemRl4',
    url: '/media/Vi-kzyvemRl4/e740ed8a24/27b888_323008bb0f6a41d4bde2a0da7206cd98f001.jpg',
    kind: 'image',
    width: 1080,
    height: 1920,
    alt: 'Apricot teddy bear puppy sitting on a light rug',
    caption: '',
    focalX: 0.479,
    focalY: 0.47,
    color: '#786858',
  },
  {
    id: 'g_e4ebbc7fyG',
    url: '/media/g_e4ebbc7fyG/8276289ae7/27b888_323008bb0f6a41d4bde2a0da7206cd98f002.jpg',
    kind: 'image',
    width: 1080,
    height: 1920,
    alt: 'Teddy bear puppy peeking up towards the camera',
    caption: '',
    focalX: 0.464,
    focalY: 0.464,
    color: '#685848',
  },
  {
    id: 'skvodl2NZiKq',
    url: '/media/skvodl2NZiKq/cefab5eee9/27b888_323008bb0f6a41d4bde2a0da7206cd98f003.jpg',
    kind: 'image',
    width: 1080,
    height: 1920,
    alt: 'The apricot teddy bear puppy from our showroom, held up to say hello',
    caption: '',
    focalX: 0.453,
    focalY: 0.444,
    color: '#685848',
  },
  {
    id: 'dSAUmXs8Qai9',
    url: '/media/dSAUmXs8Qai9/ef39cbea20/27b888_323008bb0f6a41d4bde2a0da7206cd98-720p.mp4',
    kind: 'video',
    width: 720,
    height: 1280,
    alt: 'Video of our tiny apricot teddy bear puppy in Dubai',
    caption: '',
    focalX: 0.5,
    focalY: 0.5,
    color: '#685848',
    poster: {
      id: 'FHyoHcIosLZE',
      url: '/media/FHyoHcIosLZE/60f6e7e00a/27b888_323008bb0f6a41d4bde2a0da7206cd98f000.jpg',
      kind: 'image',
      width: 1080,
      height: 1920,
      alt: 'A tiny apricot teddy bear puppy held up in the TeddyPups showroom',
      caption: '',
      focalX: 0.543,
      focalY: 0.483,
      color: '#685848',
    },
  },
];
