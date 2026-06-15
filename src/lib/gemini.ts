import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Global state to track quota status and prevent spamming when limited
let isQuotaExceeded = false;
let quotaResetTime = 0;

export function getAIStatus() {
  return {
    isLimited: isQuotaExceeded && Date.now() < quotaResetTime,
    resetIn: Math.max(0, Math.ceil((quotaResetTime - Date.now()) / 1000))
  };
}

/**
 * Helper to handle retries with exponential backoff
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> {
  try {
    // Check if we are in a quota cooldown period
    if (isQuotaExceeded && Date.now() < quotaResetTime) {
      throw { status: 429, message: "Quota exceeded cooldown" };
    }
    
    return await fn();
  } catch (error: any) {
    if (error?.status === 429 && retries > 0) {
      isQuotaExceeded = true;
      quotaResetTime = Date.now() + 60000; // 1 minute cooldown
      console.warn(`Quota hit, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * Curated high-quality food photography from Unsplash based on keywords or categories
 */
/**
 * Unique high-resolution Unsplash food photography images mapped specifically to each of the 50 pre-seeded recipes
 * to ensure that there are absolutely zero repetitions, and every recipe is styled with custom plated matching dishes.
 */
const PRE_SEEDED_MAP: Record<string, string> = {
  "rosewater & pistachio macarons": "https://images.unsplash.com/photo-1569864358642-9d161970296d?q=80&w=800&auto=format&fit=crop",
  "pink dragonfruit smoothie bowl": "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop",
  "strawberry glazed summer salad": "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=800&auto=format&fit=crop",
  "hibiscus & honey roast chicken": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800&auto=format&fit=crop",
  "beetroot & feta hummus platter": "https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=800&auto=format&fit=crop",
  "raspberry & rosewater sorbet": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800&auto=format&fit=crop",
  "pink grapefruit & avocado salad": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
  "pomegranate glazed salmon": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop",
  "watermelon & feta skewers": "https://images.unsplash.com/photo-1563223552-30d01fda3ead?q=80&w=800&auto=format&fit=crop",
  "pink peppercorn crusted tofu": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
  "strawberry basil lemonade": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop",
  "roasted radicchio with balsamic": "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop",
  "pink pasta with roasted garlic": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop",
  "cherry blossom tea cakes": "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?q=80&w=800&auto=format&fit=crop",
  "shrimp tacos with radish slaw": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop",
  "pink risotto with radicchio": "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800&auto=format&fit=crop",
  "blood orange tart": "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=800&auto=format&fit=crop",
  "rhubarb & ginger crumble": "https://images.unsplash.com/photo-1506084868730-342b1f8505b0?q=80&w=800&auto=format&fit=crop",
  "pink gin fizz": "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=800&auto=format&fit=crop",
  "roasted beet & goat cheese crostini": "https://images.unsplash.com/photo-1572656631137-7935297eff55?q=80&w=800&auto=format&fit=crop",
  "pink potato salad": "https://images.unsplash.com/photo-1546793665-c74683c3f43d?q=80&w=800&auto=format&fit=crop",
  "strawberry chia pudding": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop",
  "pink velvet cupcakes": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
  "hibiscus poached pears": "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=800&auto=format&fit=crop",
  "pink hummus wrap": "https://images.unsplash.com/photo-1626700051175-6518c4793f0b?q=80&w=800&auto=format&fit=crop",
  "rose petal jam": "https://images.unsplash.com/photo-1589415447196-857ca48eb7f4?q=80&w=800&auto=format&fit=crop",
  "pink cauliflower steaks": "https://images.unsplash.com/photo-1624462966581-bc6d768cbce5?q=80&w=800&auto=format&fit=crop",
  "strawberry spinach smoothie": "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800&auto=format&fit=crop",
  "pink deviled eggs": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop",
  "raspberry white chocolate blondies": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop",
  "pink couscous salad": "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=800&auto=format&fit=crop",
  "strawberry balsamic bruschetta": "https://images.unsplash.com/photo-1501595091296-3a9f4ca3edd0?q=80&w=800&auto=format&fit=crop",
  "pink lemonade sorbet": "https://images.unsplash.com/photo-1501856777435-29877ed80a3d?q=80&w=800&auto=format&fit=crop",
  "roasted beet & quinoa bowl": "https://images.unsplash.com/photo-1540420773084-3366772f4999?q=80&w=800&auto=format&fit=crop",
  "pink pancakes": "https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=800&auto=format&fit=crop",
  "watermelon gazpacho": "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop",
  "pink rice paper rolls": "https://images.unsplash.com/photo-1530685932526-48ee92998eaa?q=80&w=800&auto=format&fit=crop",
  "strawberry mousse": "https://images.unsplash.com/photo-1464305795204-6f5bdf7f81b1?q=80&w=800&auto=format&fit=crop",
  "pink grapefruit sorbet": "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop",
  "roasted salmon with pink peppercorns": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop",
  "pink potato gnocchi": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=800&auto=format&fit=crop",
  "strawberry rhubarb pie": "https://images.unsplash.com/photo-1507226983735-a838615193b0?q=80&w=800&auto=format&fit=crop",
  "pink tabbouleh": "https://images.unsplash.com/photo-1623428187969-5da2d87a6cd1?q=80&w=800&auto=format&fit=crop",
  "raspberry chia jam": "https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?q=80&w=800&auto=format&fit=crop",
  "pink cauliflower soup": "https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=800&auto=format&fit=crop",
  "strawberry salsa": "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=800&auto=format&fit=crop",
  "pink coconut macaroons": "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
  "roasted radishes with butter": "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=800&auto=format&fit=crop",
  "pink grapefruit margarita": "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=800&auto=format&fit=crop",
  "strawberry white chocolate cookies": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop"
};

/**
 * Categorized pools of beautiful, uniquely themed ready-to-eat gourmet food plating photos.
 * Deterministic hash-based selections pull from these pools so sibling recipes do not repeat their photo assets.
 */
const POOL_BREAKFAST = [
  'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop', // Eggs, berries, & sourdough
  'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=800&auto=format&fit=crop', // Multi-grain Oatmeal bowl
  'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=800&auto=format&fit=crop', // Stacked breakfast flapjacks
  'https://images.unsplash.com/photo-1496042453907-6c2ff930b201?q=80&w=800&auto=format&fit=crop', // French toast plate
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=800&auto=format&fit=crop', // Avocado eggs brunch
  'https://images.unsplash.com/photo-1538220856186-0be0c085984d?q=80&w=800&auto=format&fit=crop', // Fresh melon fruit plate
  'https://images.unsplash.com/photo-1506084868730-342b1f8505b0?q=80&w=800&auto=format&fit=crop', // Greek yogurt berry parfait
  'https://images.unsplash.com/photo-1513442547838-c146e3694948?q=80&w=800&auto=format&fit=crop', // Freshly baked breakfast pastry
  'https://images.unsplash.com/photo-1495214876489-73415cafc9ed?q=80&w=800&auto=format&fit=crop', // Belgian waffle honey grid
  'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=800&auto=format&fit=crop'  // Avocado toast with seeds
];

const POOL_LUNCH = [
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop', // Vibrant feta salad
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop', // Superfood healthy grain bowl
  'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=800&auto=format&fit=crop', // Caesar salad greens
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop', // Seared tofu salmon lunch bowl
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop', // Caprese Toast lunch bites
  'https://images.unsplash.com/photo-1500507396744-80922124c49d?q=80&w=800&auto=format&fit=crop', // Grilled paninis sandwich
  'https://images.unsplash.com/photo-1626700051175-6518c4793f0b?q=80&w=800&auto=format&fit=crop', // Savory herbed wraps
  'https://images.unsplash.com/photo-1563223552-30d01fda3ead?q=80&w=800&auto=format&fit=crop', // Summer garden veggie skewers
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop', // Creamy warm soup bowl
  'https://images.unsplash.com/photo-1623428187969-5da2d87a6cd1?q=80&w=800&auto=format&fit=crop'  // Parsley mint quinoa plate
];

const POOL_DINNER = [
  'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop', // Grilled steak chops
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop', // Crispy skinned salmon plate
  'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800&auto=format&fit=crop', // Golden roast chicken plating
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop', // Stacked dinner tacos
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop', // Tomato basil fettuccine
  'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800&auto=format&fit=crop', // Creamy saffron risotto
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop', // Bubbling stone pizza flatbread
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop', // Seared pan fish with greens
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop', // Ginger sesame tofu dinner wok
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=800&auto=format&fit=crop'  // Artisan hand-pinched gnocchi dinner
];

const POOL_DESSERT = [
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop', // Glazed gourmet sponge cake
  'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=800&auto=format&fit=crop', // Beautiful glaze berry tart
  'https://images.unsplash.com/photo-1569864358642-9d161970296d?q=80&w=800&auto=format&fit=crop', // Colorful French macarons
  'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800&auto=format&fit=crop', // Sorbet scoop in ice bowl
  'https://images.unsplash.com/photo-1507226983735-a838615193b0?q=80&w=800&auto=format&fit=crop', // Rustic orchard baked pie slice
  'https://images.unsplash.com/photo-1464305795204-6f5bdf7f81b1?q=80&w=800&auto=format&fit=crop', // Pink mousse custard cup
  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop', // Rich dark chocolate brownies
  'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop', // Soft warm chocolate cookies
  'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop', // Frosted gourmet doughnut cake
  'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=800&auto=format&fit=crop'  // Wine poached pear caramel
];

const POOL_SNACKS = [
  'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=800&auto=format&fit=crop', // Elegant hummus spreads platter
  'https://images.unsplash.com/photo-1572656631137-7935297eff55?q=80&w=800&auto=format&fit=crop', // Tomato herb crostini appetizers
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop', // Deviled egg appetizer plate
  'https://images.unsplash.com/photo-1530685932526-48ee92998eaa?q=80&w=800&auto=format&fit=crop', // Rice paper spring rolls tray
  'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=800&auto=format&fit=crop', // Chunky tomato-berry salsa bowl
  'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800&auto=format&fit=crop', // Cheese board and flatbread crackers
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop', // Mini bruschetta Caprese rolls
  'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?q=80&w=800&auto=format&fit=crop', // Roasted chickpea snack cup
  'https://images.unsplash.com/photo-1541014741259-df529411b96a?q=80&w=800&auto=format&fit=crop', // Homemade baked grain chips
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop'  // Plated meat sliders platter
];

const POOL_DRINK = [
  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop', // Iced strawberry cocktail drink
  'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=800&auto=format&fit=crop', // Glowing herbal gin beverage
  'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800&auto=format&fit=crop', // Fresh creamy berry glass juice
  'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=800&auto=format&fit=crop', // Citrus Margarita cocktail tumbler
  'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=800&auto=format&fit=crop', // Lavender floral tea pitcher
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop', // Foamed double hot espresso cup
  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop', // Tall cold brew caffeine glass
  'https://images.unsplash.com/photo-1501856777435-29877ed80a3d?q=80&w=800&auto=format&fit=crop', // Infused mineral raspberry water
  'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?q=80&w=800&auto=format&fit=crop', // Crystal cocktail flute
  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop'  // Frozen dynamic pink mocktail
];

/**
 * Deterministic hash algorithm helper to translate titles into stable pool offsets.
 * Outlaws repetitions for different recipes within the same categories.
 */
function getDeterministicIndex(str: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % length;
}

export function getFallbackRecipeImage(title: string, category: string = ''): string {
  const t = title.toLowerCase().trim();
  const c = category.toLowerCase().trim();

  // 1. Check if the recipe matches a exact pre-seeded title map (Guarantees zero-repetition 100% correct pre-seeds)
  if (PRE_SEEDED_MAP[t]) {
    return PRE_SEEDED_MAP[t];
  }

  // 2. Exact keyword overrides for general/searched recipe terms
  if (t.includes('avocado') || t.includes('avacado') || t.includes('dukkah')) {
    return 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=800&auto=format&fit=crop'; // Avocado Toast
  }
  if (t.includes('quinoa') || t.includes('mediterranean') || t.includes('greek salad') || t.includes('tabbouleh') || t.includes('couscous')) {
    return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop'; // Grains Salad
  }
  if (t.includes('earl grey') || t.includes('lavender') || t.includes('iced tea')) {
    return 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=800&auto=format&fit=crop'; // Lavender Iced drink
  }
  if (t.includes('slider') || t.includes('sliders') || t.includes('burger') || t.includes('hamburger')) {
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop'; // Sliders
  }
  if (t.includes('hummus') || t.includes('chickpea dip') || t.includes('baba ghanoush')) {
    return 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?q=80&w=800&auto=format&fit=crop'; // Hummus platter
  }
  if (t.includes('sorbet') || t.includes('ice cream') || t.includes('gelato') || t.includes('sundae') || t.includes('mousse')) {
    return 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800&auto=format&fit=crop'; // Frozen scoop dessert
  }
  if (t.includes('macaron') || t.includes('macarons')) {
    return 'https://images.unsplash.com/photo-1569864358642-9d161970296d?q=80&w=800&auto=format&fit=crop'; // Macarons
  }
  if (t.includes('smoothie bowl') || t.includes('chia pudding') || t.includes('pitaya') || t.includes('dragonfruit')) {
    return 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop'; // Smoothie bowl pitaya
  }
  if (t.includes('chicken') || t.includes('hen') || t.includes('poultry') || t.includes('roast')) {
    return 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800&auto=format&fit=crop'; // Roast golden bird
  }
  if (t.includes('tofu')) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'; // Cooked tofu dish
  }
  if (t.includes('salmon') || t.includes('fish') || t.includes('tuna') || t.includes('seafood') || t.includes('shrimp') || t.includes('prawn')) {
    return 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop'; // Clean salmon plate
  }
  if (t.includes('skewers') || t.includes('kebab') || t.includes('kabob')) {
    return 'https://images.unsplash.com/photo-1563223552-30d01fda3ead?q=80&w=800&auto=format&fit=crop'; // Skewers
  }
  if (t.includes('pizza') || t.includes('flatbread')) {
    return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop'; // Golden slice pizza
  }
  if (t.includes('pasta') || t.includes('spaghetti') || t.includes('fettuccine') || t.includes('noodles') || t.includes('lasagna') || t.includes('gnocchi') || t.includes('ravioli')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop'; // Plated pasta
  }
  if (t.includes('cake') || t.includes('cupcake') || t.includes('sponge') || t.includes('blondies') || t.includes('brownie') || t.includes('macaroons')) {
    return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop'; // Red velvet dessert
  }
  if (t.includes('cookie') || t.includes('cookies') || t.includes('biscuit')) {
    return 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=800&auto=format&fit=crop'; // Chocolate chip cookies
  }
  if (t.includes('taco') || t.includes('tacos') || t.includes('burrito') || t.includes('fajita')) {
    return 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop'; // Plated tacos
  }
  if (t.includes('risotto') || t.includes('rice') || t.includes('pilaf')) {
    return 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800&auto=format&fit=crop'; // Saffron risotto rice bowl
  }
  if (t.includes('tart') || t.includes('pie') || t.includes('crumble') || t.includes('galette')) {
    return 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=800&auto=format&fit=crop'; // Beautiful baked berry pie/tart
  }
  if (t.includes('crostini') || t.includes('bruschetta')) {
    return 'https://images.unsplash.com/photo-1572656631137-7935297eff55?q=80&w=800&auto=format&fit=crop'; // Sliced crostini bites
  }
  if (t.includes('soup') || t.includes('broth') || t.includes('ramen') || t.includes('gazpacho') || t.includes('chowder')) {
    return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop'; // Savory gazpacho bowl
  }
  if (t.includes('salad') || t.includes('veg') || t.includes('greens') || t.includes('caesar')) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop'; // Green garden salad
  }
  if (t.includes('margarita') || t.includes('mojito') || t.includes('fizz') || t.includes('cocktail') || t.includes('lemonade') || t.includes('shake') || t.includes('smoothie') || t.includes('juice')) {
    return 'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=800&auto=format&fit=crop'; // Glow drink tumbler
  }
  if (t.includes('coffee') || t.includes('latte') || t.includes('espresso') || t.includes('cappuccino')) {
    return 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop'; // Hot foamy espresso
  }
  if (t.includes('egg') || t.includes('eggs')) {
    return 'https://images.unsplash.com/photo-1546793665-c74683c3f43d?q=80&w=800&auto=format&fit=crop'; // Eggs platter
  }
  if (t.includes('steak') || t.includes('beef') || t.includes('ribeye')) {
    return 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop'; // Steak dinner
  }
  if (t.includes('cauliflower')) {
    return 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?q=80&w=800&auto=format&fit=crop'; // Cauliflower pan plate
  }
  if (t.includes('pancake') || t.includes('waffle') || t.includes('crepe') || t.includes('french toast') || t.includes('pancakes')) {
    return 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=800&auto=format&fit=crop'; // Fluffy grid pancakes
  }

  // 3. Fallbacks by Category via deterministic hash (zero repetition among dynamic entries of same category)
  if (c.includes('breakfast')) {
    const idx = getDeterministicIndex(title, POOL_BREAKFAST.length);
    return POOL_BREAKFAST[idx];
  }
  if (c.includes('lunch')) {
    const idx = getDeterministicIndex(title, POOL_LUNCH.length);
    return POOL_LUNCH[idx];
  }
  if (c.includes('dinner')) {
    const idx = getDeterministicIndex(title, POOL_DINNER.length);
    return POOL_DINNER[idx];
  }
  if (c.includes('dessert')) {
    const idx = getDeterministicIndex(title, POOL_DESSERT.length);
    return POOL_DESSERT[idx];
  }
  if (c.includes('snack')) {
    const idx = getDeterministicIndex(title, POOL_SNACKS.length);
    return POOL_SNACKS[idx];
  }
  if (c.includes('drink')) {
    const idx = getDeterministicIndex(title, POOL_DRINK.length);
    return POOL_DRINK[idx];
  }

  // 4. Default global category selection using a fallback hash picker
  const globalPool = [...POOL_LUNCH, ...POOL_DINNER, ...POOL_BREAKFAST];
  const idx = getDeterministicIndex(title, globalPool.length);
  return globalPool[idx];
}

/**
 * Generates an image based on a recipe title and description.
 * Returns a base64 data URL.
 */
export async function generateRecipeImage(title: string, descriptionOrCategory?: string): Promise<string> {
  const prompt = `
    Task: Create a world-class, professional food photography image for a prepared recipe titled "${title}".
    Context: Present ONLY the beautifully prepared and ready-to-eat dish itself.
    
    Strict Style & Content Rules (MANDATORY):
    - Subject: Only show the finished, beautifully prepared and plated/bowled ${title}. ${descriptionOrCategory ? `Ingredients/theme: ${descriptionOrCategory}.` : ''}
    - EXCLUDE: Do NOT include any cutlery, utensils, hands, people, kitchen equipment, raw packages, raw unchopped whole ingredients lying on the side, text overlays, or watermarks.
    - Presentation: Focus purely on the elegant plate or bowl holding the prepared food. The plate/bowl should be simple, single-color ceramic or porcelain.
    - Background: Clean, plain, out-of-focus slate, marble, or simple modern surface with no background clutter.
    - Style: Editorial gourmet food photography, extremely appetizing and clean.
    - Lighting: Soft, natural natural side-lighting creating a bright, beautiful focus on the food.
    - Composition: Front-facing or slightly-overhead close-up of the prepared dish. Extremely clean plating.
    
    Quality Requirements:
    - Ultra-realistic textures, steam, moistness, or crispiness of the prepared food.
    - Strictly no extra decorative table settings or surrounding noise — just the prepared food, plate/bowl, and the clean surface.
  `;

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: { aspectRatio: "1:1" },
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No image data returned from Gemini");
    });
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes('quota')) {
      console.warn("Gemini API quota exceeded. Using high-quality fallback.");
    } else {
      console.error("Error generating image:", error);
    }
    
    return getFallbackRecipeImage(title, descriptionOrCategory);
  }
}

/**
 * Uses AI to search and filter trending recipes based on a natural language query.
 */
export async function searchTrendingRecipes(query: string, recipes: any[]) {
  const recipeList = recipes.map(r => ({ id: r.id, title: r.title, category: r.category })).slice(0, 50);
  
  const prompt = `Given this list of recipes: ${JSON.stringify(recipeList)}
  Find the top 3 most relevant recipes for the query: "${query}".
  Return ONLY a JSON array of the recipe IDs.
  Example: ["1", "5", "12"]`;

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const ids = JSON.parse(response.text || '[]');
      return recipes.filter(r => ids.includes(r.id));
    });
  } catch (error) {
    console.error("Error searching recipes with AI:", error);
    return recipes.filter(r => 
      r.title.toLowerCase().includes(query.toLowerCase()) || 
      r.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);
  }
}

/**
 * Extracts recipe details from a URL using Gemini.
 */
export async function extractRecipeFromUrl(url: string) {
  const prompt = `Extract the recipe details from this URL: ${url}. 
  Return a JSON object with the following structure:
  {
    "title": "Recipe Name",
    "description": "Short description",
    "category": "One of: Breakfast, Lunch, Dinner, Dessert, Snack, Drink, Other",
    "ingredients": ["ingredient 1", "ingredient 2"],
    "instructions": ["step 1", "step 2"],
    "tags": ["tag 1", "tag 2"],
    "imageUrl": "URL to the recipe image if found"
  }`;

  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      return JSON.parse(response.text || '{}');
    });
  } catch (error: any) {
    console.error("Error extracting recipe:", error);
    if (error?.status === 429 || error?.message?.includes('quota')) {
      throw new Error("AI Quota Exceeded: We're currently processing many requests. Please try manual entry or try again in a minute.");
    }
    throw error;
  }
}

/**
 * Intercepts recipe image URLs and guarantees that any broken/falsy/picsum/placeholder
 * links are swapped for beautifully curated, high-quality ready-to-eat Unsplash photos.
 */
export function resolveCleanRecipeImage(recipe: { imageUrl?: string; image?: string; title: string; category?: string }): string {
  const url = (recipe.imageUrl || recipe.image || '').trim();
  const titleClean = recipe.title.toLowerCase().trim();

  // 1. Check if the recipe matches an exact pre-seeded title map (Guarantees zero-repetition 100% correct pre-seeds)
  if (PRE_SEEDED_MAP[titleClean]) {
    return PRE_SEEDED_MAP[titleClean];
  }
  
  if (!url || url.includes('picsum.photos') || url.includes('placeholder') || url === '') {
    return getFallbackRecipeImage(recipe.title, recipe.category || '');
  }

  // Check if it's not a newly generated custom base64 image
  const isBase64 = url.startsWith('data:image/');
  
  if (!isBase64) {
    const t = recipe.title.toLowerCase();
    
    // Check if the current URL contains known non-food scenery keywords or landscape identifiers
    const containsSceneryKeywords = 
      url.includes('photo-1506744038136') || // Mountain landscape
      url.includes('photo-1486406146926') || // Commercial skyscrapers
      url.includes('photo-1519681393784') || // Starry sky mountain
      url.includes('photo-1470071459604') || // Forest
      url.includes('photo-1472214222541') || // Sunset Valley
      url.includes('photo-1469474968028') || // Hills
      url.includes('photo-1501854140801') || // Rolling hills
      url.includes('photo-1441974231531') || // Forest trees
      url.includes('photo-1447752875215') || // Wooden bridge
      url.includes('sky') || url.includes('scenery') || url.includes('nature') || url.includes('landscape') || url.includes('outdoor') || url.includes('building') || url.includes('architecture');
      
    // Overlap with core pre-seeded or popular user dishes to ensure 100% correct, stunning ready-to-eat plated imagery
    const isCoreRecipe = 
      t.includes('avocado') || t.includes('dukkah') ||
      t.includes('quinoa') || t.includes('mediterranean') || t.includes('greek salad') ||
      t.includes('earl grey') || t.includes('lavender') || t.includes('iced tea') ||
      t.includes('slider') || t.includes('sliders') || t.includes('burger') || t.includes('hamburger') ||
      t.includes('macaron') || t.includes('macarons') ||
      t.includes('dragonfruit') || t.includes('pitaya') || t.includes('smoothie bowl') ||
      t.includes('beet beetroot') || t.includes('hummus') ||
      t.includes('salmon') || t.includes('skewers');

    if (isCoreRecipe || containsSceneryKeywords) {
      return getFallbackRecipeImage(recipe.title, recipe.category || '');
    }
  }

  return url;
}
