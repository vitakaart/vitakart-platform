// File: apps/web/lib/data/mega-menu.ts
// Static mega menu data - replace with API call when ready

export interface MegaMenuCategory {
  id: string;
  label: string;
  icon: string;
  href: string;
  types: string[];
  brands: string[];
  healthGoals: string[];
}

export const MEGA_MENU_DATA: MegaMenuCategory[] = [
  {
    id: "vitamins",
    label: "Vitamins",
    icon: "🍊",
    href: "/categories/vitamins",
    types: ["Multivitamins", "Vitamin D", "Vitamin C", "Vitamin B12", "Biotin", "Omega-3", "Calcium", "Iron"],
    brands: ["HealthKart", "MuscleBlaze", "TrueBasics", "WOW Life Science", "Carbamide Forte", "Nutralite"],
    healthGoals: ["Immunity", "Energy", "Hair & Skin", "Bone Health", "Heart Health", "Brain Function"]
  },
  {
    id: "supplements",
    label: "Supplements",
    icon: "💊",
    href: "/categories/supplements",
    types: ["Prebiotics", "Probiotics", "Collagen", "Glucosamine", "Melatonin", "Ashwagandha", "Ginseng", "Zinc"],
    brands: ["Himalaya", "Organic India", "Mamaearth", "Bold Care", "Wellbeing", "HealthVit"],
    healthGoals: ["Sleep", "Stress Relief", "Joint Health", "Digestion", "Brain Health", "Anti-aging"]
  },
  {
    id: "herbal",
    label: "Herbal",
    icon: "🌿",
    href: "/categories/herbal",
    types: ["Green Tea", "Kadha", "Herbal Juice", "Herbal Oil", "Chyawanprash", "Aloe Vera", "Neem", "Tulsi"],
    brands: ["Patanjali", "Dabur", "Baidyanath", "Zandu", "Himalaya", "Kerala Ayurveda"],
    healthGoals: ["Detox", "Respiratory", "Liver Health", "Blood Sugar", "General Wellness", "Immunity"]
  },
  {
    id: "sports",
    label: "Sports Nutrition",
    icon: "💪",
    href: "/categories/sports-nutrition",
    types: ["Pre-Workout", "BCAA", "Creatine", "Electrolytes", "Energy Gels", "Protein Bars", "Post-Workout"],
    brands: ["ON (Optimum Nutrition)", "MyProtein", "MuscleTech", "Isopure", "GNC", "BigMuscles"],
    healthGoals: ["Performance", "Recovery", "Endurance", "Hydration", "Muscle Building"]
  },
  {
    id: "skincare",
    label: "Skincare",
    icon: "✨",
    href: "/categories/skincare",
    types: ["Serums", "Moisturizers", "Sunscreen", "Face Wash", "Masks", "Toners", "Eye Cream"],
    brands: ["Minimalist", "Dr. Sheth's", "Plum", "mCaffeine", "Dot & Key", "The Derma Co"],
    healthGoals: ["Acne", "Anti-Aging", "Dry Skin", "Brightening", "Sensitive Skin"]
  },
  {
    id: "protein",
    label: "Protein",
    icon: "🥛",
    href: "/categories/protein",
    types: ["Whey Protein", "Whey Isolate", "Mass Gainer", "Plant Protein", "Casein", "Soy Protein"],
    brands: ["MuscleBlaze", "ON", "MyProtein", "Isopure", "Oziva", "Fast&Up"],
    healthGoals: ["Muscle Building", "Weight Loss", "Meal Replacement", "Recovery"]
  },
  {
    id: "wellness",
    label: "Wellness Devices",
    icon: "⌚",
    href: "/categories/wellness-devices",
    types: ["Fitness Trackers", "Massage Guns", "Yoga Mats", "Resistance Bands", "Smart Scales", "BP Monitors"],
    brands: ["Fitbit", "Garmin", "Apple", "Noise", "Cult Sport", "Dr. Trust"],
    healthGoals: ["Fitness", "Recovery", "Mental Wellness", "Monitoring"]
  },
  {
    id: "ayurveda",
    label: "Ayurveda",
    icon: "🧘",
    href: "/categories/ayurveda",
    types: ["Triphala", "Shilajit", "Giloy", "Tulsi", "Neem", "Ashwagandha", "Ghee", "Honey"],
    brands: ["Kerala Ayurveda", "Dabur", "Patanjali", "Forest Essentials", "Kama Ayurveda"],
    healthGoals: ["Immunity", "Rejuvenation", "Digestion", "Stress", "Detox"]
  }
];

export const POPULAR_SEARCHES = [
  "Multivitamins for men",
  "Whey protein isolate",
  "Ashwagandha capsules",
  "Vitamin D3",
  "Omega 3 fish oil",
  "Biotin for hair"
];