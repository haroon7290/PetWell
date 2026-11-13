/**
 * Starter content copied from the original Pet Well Shopify store.
 * Images are downloaded once from the Shopify CDN during import and stored in your own image storage.
 */

export const SHOPIFY_FILES = 'https://cdn.shopify.com/s/files/1/0769/3870/7013/files/'
export const SHOPIFY_ARTICLES = 'https://cdn.shopify.com/s/files/1/0769/3870/7013/articles/'

export const categories = [
  { title: 'Dog', slug: 'dog', image: 'Dog.jpg', sortOrder: 1 },
  { title: 'Cat', slug: 'cat', image: 'Cat.jpg', sortOrder: 2 },
  { title: 'Birds', slug: 'birds', image: 'Birds.jpg', sortOrder: 3 },
  { title: 'Horses', slug: 'horses', image: 'Horse.jpg', sortOrder: 4 },
  { title: 'Small Pets', slug: 'small-pets', image: 'Small_Pets.jpg', sortOrder: 5 },
]

type SeedVariant = { option?: string; secondOption?: string; price: number; compareAtPrice?: number; sku: string; stock?: number }
export type SeedProduct = {
  slug: string
  title: string
  brand: string
  categories: string[]
  images: string[]
  intro: string
  benefits: string[]
  details: { heading: string; text: string }[]
  optionName?: string
  secondOptionName?: string
  variants: SeedVariant[]
  badge?: string
  prescriptionRequired?: boolean
  petRegistrationRequired?: boolean
}

export const products: SeedProduct[] = [
  {
    slug: 'equivale-hoof-supplement-for-horses',
    title: 'Hoof Supplement for Horses – Biotin & Zinc',
    brand: 'Equivale',
    categories: ['horses'],
    images: ['P11.jpg'],
    intro: 'A daily supplement with biotin, zinc and methionine to support strong, healthy hoof growth.',
    benefits: [
      'Biotin, zinc and methionine for hoof horn quality',
      'Tasty pellet horses eat readily',
      'Suitable for horses and ponies of all ages',
    ],
    details: [
      { heading: 'Composition', text: 'Per 30 g: biotin 20 mg, zinc 300 mg, DL-methionine 1,200 mg, calcium, copper.' },
      { heading: 'Directions for use', text: 'Horses: 30 g daily. Ponies: 20 g daily. Add to the feed. Allow 6–9 months for new hoof growth.' },
    ],
    optionName: 'Size',
    variants: [{ option: '', price: 24.99, sku: 'EQ-HOOF-1.5' }],
  },
  {
    slug: 'nibbleburrow-timothy-hay',
    title: 'Premium Timothy Hay for Rabbits & Guinea Pigs',
    brand: 'Nibbleburrow',
    categories: ['small-pets'],
    images: ['P10_e5f17879-d293-416b-b881-5a6471ca07ce.jpg'],
    intro:
      "Sweet-smelling, long-strand Timothy hay, hand-checked for quality. Hay should make up most of your rabbit's or guinea pig's diet.",
    benefits: ['High in fibre for healthy teeth and digestion', 'Long strands encourage natural foraging', 'Dust-extracted and hand-checked'],
    details: [
      { heading: 'Feeding guide', text: "Provide unlimited fresh hay every day, at least a bundle the size of your pet's body." },
    ],
    optionName: 'Size',
    variants: [
      { option: '1kg', price: 6.99, sku: 'NB-HAY-1' },
      { option: '2.5kg', price: 14.99, sku: 'NB-HAY-2.5' },
    ],
  },
  {
    slug: 'hearthpaw-orthopaedic-memory-foam-dog-bed',
    title: 'Orthopaedic Memory Foam Dog Bed',
    brand: 'Hearthpaw',
    categories: ['dog'],
    images: ['P8.jpg', 'P9.jpg'],
    intro:
      'Supportive memory foam bed with a soft bolster and removable, machine-washable cover. Ideal for older dogs and those with stiff joints.',
    benefits: ['7 cm orthopaedic memory foam base', 'Raised bolster for a cosy headrest', 'Removable cover, washable at 30°C', 'Non-slip base'],
    details: [{ heading: 'Sizes', text: 'Small 60 x 45 cm. Medium 80 x 60 cm. Large 100 x 75 cm.' }],
    optionName: 'Size',
    secondOptionName: 'Colour',
    variants: [
      { option: 'Small', secondOption: 'Grey', price: 39.99, sku: 'HP-BED-S-GRY' },
      { option: 'Small', secondOption: 'Forest green', price: 39.99, sku: 'HP-BED-S-GRN' },
      { option: 'Medium', secondOption: 'Grey', price: 54.99, compareAtPrice: 64.99, sku: 'HP-BED-M-GRY' },
      { option: 'Medium', secondOption: 'Forest green', price: 54.99, compareAtPrice: 64.99, sku: 'HP-BED-M-GRN' },
      { option: 'Large', secondOption: 'Grey', price: 69.99, sku: 'HP-BED-L-GRY' },
      { option: 'Large', secondOption: 'Forest green', price: 69.99, sku: 'HP-BED-L-GRN', stock: 0 },
    ],
  },
  {
    slug: 'featherby-budgie-finch-seed-mix',
    title: 'Budgie & Finch Seed Mix',
    brand: 'Featherby',
    categories: ['birds'],
    images: ['P7.jpg'],
    intro: 'A nutritious blend of millets, canary seed and grass seeds for budgies and finches, with added vitamins.',
    benefits: ['Natural seed variety birds love', 'Added vitamins and minerals', 'Cleaned and dust-reduced'],
    details: [
      { heading: 'Ingredients', text: 'White millet, red millet, canary seed, panicum millet, grass seeds, vitamins and minerals.' },
      {
        heading: 'Feeding guide',
        text: 'Offer 1–2 teaspoons per bird per day. Remove husks daily and always provide fresh water and grit.',
      },
    ],
    optionName: 'Size',
    variants: [
      { option: '1kg', price: 4.49, sku: 'FB-SEED-1' },
      { option: '4kg', price: 13.99, sku: 'FB-SEED-4', stock: 0 },
    ],
  },
  {
    slug: 'purrfield-renal-support-dry-cat-food',
    title: 'Renal Support Veterinary Diet – Dry Cat Food',
    brand: 'Purrfield',
    categories: ['cat'],
    images: ['P6.jpg'],
    intro:
      'A veterinary diet with controlled phosphorus and high-quality protein to support cats with reduced kidney function. Use only on the advice of your vet.',
    benefits: [
      'Controlled phosphorus and sodium',
      'High-quality, easily digested protein',
      'Added omega-3 fatty acids',
      'Highly palatable for fussy cats',
    ],
    details: [
      {
        heading: 'Composition',
        text: 'Protein 26%, fat 18%, crude fibre 2.5%, phosphorus 0.45%, sodium 0.3%, omega-3 fatty acids 0.6%.',
      },
      {
        heading: 'Feeding guide',
        text: '3 kg cat: 40 g/day. 4 kg cat: 50 g/day. 5 kg cat: 60 g/day. Introduce over 7 days. Recommended for an initial period of up to 6 months; ask your vet for regular check-ups.',
      },
    ],
    optionName: 'Size',
    variants: [
      { option: '1.5kg', price: 19.99, compareAtPrice: 27.99, sku: 'PF-RENAL-1.5' },
      { option: '4kg', price: 42.99, compareAtPrice: 59.99, sku: 'PF-RENAL-4' },
    ],
    badge: 'Up to 30% off',
    prescriptionRequired: true,
    petRegistrationRequired: true,
  },
  {
    slug: 'canimed-anti-inflammatory-tablets-for-dogs-sample',
    title: 'Anti-Inflammatory Tablets for Dogs',
    brand: 'Canimed Labs',
    categories: ['dog'],
    images: ['P5.jpg'],
    intro:
      "Sample prescription listing used to test the store. Replace it with your real licensed medicines, the manufacturer's information and official pack photos before launch.",
    benefits: [
      'Prescription-only medicine: dispensed against a valid written veterinary prescription',
      'Each pet must be registered before ordering',
      'Checked by our pharmacy team before dispatch',
    ],
    details: [
      {
        heading: 'How to order',
        text: "Add to basket, enter your pet's details and upload your prescription, or choose to send it by email or post. We will contact you if anything is missing.",
      },
    ],
    optionName: 'Pack size',
    variants: [
      { option: '30 tablets', price: 18.5, sku: 'CM-NSAID-30' },
      { option: '90 tablets', price: 46.0, sku: 'CM-NSAID-90' },
    ],
    prescriptionRequired: true,
    petRegistrationRequired: true,
  },
  {
    slug: 'vetacare-flea-tick-spot-on-for-dogs',
    title: 'Flea & Tick Spot-On for Dogs – 3 Pipettes',
    brand: 'VetaCare',
    categories: ['dog'],
    images: ['P4.jpg'],
    intro: "Easy-to-apply spot-on treatment that kills fleas and ticks on dogs, with three months' supply in every pack.",
    benefits: ['Kills fleas within 24 hours', 'Kills ticks within 48 hours', 'Waterproof after 48 hours', 'Three pipettes: one per month'],
    details: [
      {
        heading: 'Directions for use',
        text: "Choose the pack for your dog's weight. Part the fur between the shoulder blades and squeeze the whole pipette onto the skin. Repeat monthly. Always read the leaflet before use.",
      },
    ],
    optionName: 'Dog weight',
    variants: [
      { option: 'Small (2–10kg)', price: 14.99, sku: 'VC-SPOT-S' },
      { option: 'Medium (10–20kg)', price: 16.99, sku: 'VC-SPOT-M' },
      { option: 'Large (20–40kg)', price: 18.99, sku: 'VC-SPOT-L' },
      { option: 'Extra large (40–60kg)', price: 20.99, sku: 'VC-SPOT-XL' },
    ],
    badge: 'Bestseller',
  },
  {
    slug: 'vetacare-joint-support-chews-for-dogs',
    title: 'Joint Support Chews for Dogs',
    brand: 'VetaCare',
    categories: ['dog'],
    images: ['P3.jpg'],
    intro:
      'Tasty daily chews with glucosamine, green-lipped mussel and omega-3 to help keep active and older dogs moving comfortably.',
    benefits: [
      'Supports healthy joints and cartilage',
      'Easy-to-give chew dogs actually enjoy',
      'Suitable for all ages and breeds',
      'Results typically seen within 6 weeks',
    ],
    details: [
      {
        heading: 'Composition',
        text: 'Glucosamine HCl 500 mg, green-lipped mussel 300 mg, chondroitin 100 mg, omega-3 fatty acids, vitamin E per chew.',
      },
      {
        heading: 'Directions for use',
        text: 'Under 10 kg: 1 chew daily. 10–25 kg: 2 chews daily. Over 25 kg: 3 chews daily. Give with or after food.',
      },
    ],
    optionName: 'Pack size',
    variants: [
      { option: '60 chews', price: 16.99, compareAtPrice: 19.99, sku: 'VC-JOINT-60' },
      { option: '120 chews', price: 29.99, compareAtPrice: 35.99, sku: 'VC-JOINT-120' },
    ],
    badge: 'New',
  },
  {
    slug: 'purrfield-wet-cat-food-pouches-fish-selection',
    title: 'Wet Cat Food Pouches – Fish Selection in Jelly',
    brand: 'Purrfield',
    categories: ['dog', 'cat'],
    images: ['P2.jpg'],
    intro: 'Tender chunks of salmon, tuna and whitefish in a tasty jelly, made for adult cats who love variety.',
    benefits: [
      'Complete and balanced for adult cats',
      'Added taurine for heart and eye health',
      'Single-serve 85 g pouches for freshness',
      'Mix and match: buy 3, get the cheapest free',
    ],
    details: [
      {
        heading: 'Ingredients',
        text: 'Fish and fish derivatives (including salmon 4%, tuna 4%, whitefish 4%), meat and animal derivatives, cereals, minerals, sugars.',
      },
      { heading: 'Feeding guide', text: '4 kg cat: 3–4 pouches per day. Divide into two or more meals. Serve at room temperature.' },
    ],
    optionName: 'Pack size',
    variants: [
      { option: '12 x 85g', price: 6.49, sku: 'PF-WET-FISH-12' },
      { option: '48 x 85g', price: 22.99, sku: 'PF-WET-FISH-48' },
    ],
    badge: '3 for 2',
  },
  {
    slug: 'barkwell-adult-dry-dog-food-chicken-rice',
    title: 'Adult Dry Dog Food – Chicken & Rice',
    brand: 'Barkwell Kitchen',
    categories: ['dog'],
    images: ['p1.jpg'],
    intro:
      'Complete, balanced dry food for adult dogs, made with chicken as the first ingredient and gentle rice for easy digestion.',
    benefits: [
      'High-quality chicken protein for strong muscles',
      'Omega-3 and 6 for a healthy skin and shiny coat',
      'Prebiotic fibre to support digestion',
      'No artificial colours or flavours',
    ],
    details: [
      { heading: 'Ingredients', text: 'Chicken (26%), rice (20%), maize, chicken fat, beet pulp, fish oil, minerals, vitamins.' },
      {
        heading: 'Feeding guide',
        text: '10 kg dog: 150 g/day. 20 kg dog: 250 g/day. 30 kg dog: 340 g/day. Switch from the old food gradually over 7 days and always provide fresh water.',
      },
    ],
    optionName: 'Size',
    variants: [
      { option: '2kg', price: 11.99, sku: 'BW-DRY-CR-2' },
      { option: '6kg', price: 27.99, compareAtPrice: 32.99, sku: 'BW-DRY-CR-6' },
      { option: '12kg', price: 44.99, compareAtPrice: 52.99, sku: 'BW-DRY-CR-12' },
    ],
    badge: 'Bestseller',
  },
]

/** Product slugs shown in the homepage rows (same order as the Shopify homepage). */
export const homepageRowProducts = [
  'equivale-hoof-supplement-for-horses',
  'nibbleburrow-timothy-hay',
  'hearthpaw-orthopaedic-memory-foam-dog-bed',
  'featherby-budgie-finch-seed-mix',
  'purrfield-renal-support-dry-cat-food',
]

export const homepage = {
  heroSlides: [
    {
      image: 'Gemini_Generated_Image_9gp9d39gp9d39gp9.jpg',
      alt: 'A dog and cat sleeping by the fire with winter presents',
      eyebrow: 'Winter sale',
      heading: 'Up to 20% off pet essentials',
      text: 'Food, healthcare and accessories for every pet.',
      buttonLabel: 'Shop the sale',
      link: '/collections/all',
    },
    {
      image: 'dog_1.jpg',
      alt: 'Dog next to a delivery box',
      eyebrow: 'Subscribe & Save',
      heading: 'Repeat deliveries, made easy',
      text: 'Save on every order and never run out.',
      buttonLabel: 'How it works',
      link: '/pages/subscribe-and-save',
    },
  ],
  promoTiles: [
    { image: 'Pill_Giving.jpg', title: 'Pill-giving treats', subtitle: 'Make medicine time easy', colour: 'orange', link: '/collections/dog' },
    { image: 'Dental_care.jpg', title: 'Dental care', subtitle: 'Fresher breath, healthier teeth', colour: 'blue', link: '/collections/all' },
    { image: 'Joint_Support.jpg', title: 'Joint support', subtitle: 'Keep them moving', colour: 'green', link: '/products/vetacare-joint-support-chews-for-dogs' },
    { image: 'Flea.jpg', title: 'Flea & worm', subtitle: 'Year-round protection', colour: 'purple', link: '/products/vetacare-flea-tick-spot-on-for-dogs' },
    { image: 'Seasonal.jpg', title: 'Seasonal picks', subtitle: 'New for this season', colour: 'pink', link: '/collections/all' },
  ],
  shopByPet: [
    { image: 'Dog.jpg', label: 'Dog', link: '/collections/dog' },
    { image: 'Cat.jpg', label: 'Cat', link: '/collections/cat' },
    { image: 'Horse.jpg', label: 'Horse', link: '/collections/horses' },
    { image: 'Small_Pets.jpg', label: 'Small pets', link: '/collections/small-pets' },
    { image: 'Birds.jpg', label: 'Birds & exotics', link: '/collections/birds' },
  ],
  infoBlocks: [
    {
      icon: 'pill',
      colour: 'purple',
      heading: 'Prescriptions made easy',
      text: "Upload your vet's prescription at checkout and our pharmacy team will dispatch your pet's medicine fast.",
      linkLabel: 'Shop prescriptions',
      link: '/pages/prescriptions',
    },
    {
      icon: 'gift',
      colour: 'orange',
      heading: 'Earn rewards every time you shop',
      text: 'Collect points on every order and turn them into money off your next purchase.',
      linkLabel: 'Join rewards',
      link: '/pages/rewards',
    },
  ],
  offers: [
    { image: '20_off_essentials.jpg', badge: '20% OFF', title: '20% off essentials', subtitle: 'Limited-time savings', link: '/collections/all' },
    { image: 'Up_to_30_off_vet_diets.jpg', badge: 'UP TO 30%', title: 'Up to 30% off vet diets', subtitle: 'Selected brands', link: '/collections/cat' },
    { image: '3_for_2_on_treats.jpg', badge: '3 FOR 2', title: '3 for 2 on treats', subtitle: 'Mix and match', link: '/collections/all' },
  ],
  featureBanner: {
    image: 'Subscribe_Save_banner.jpg',
    eyebrow: 'Subscribe & Save',
    heading: 'Never run out of pet essentials',
    bullets: ['Save on every repeat order', 'Delivered to your door on your schedule', 'Skip, change or cancel any time'],
    buttonLabel: 'Find out more',
    link: '/pages/subscribe-and-save',
  },
  imageBanner: {
    image: 'Winter.jpg',
    heading: 'Winter wellness',
    text: 'Keep them cosy, healthy and happy all season.',
    buttonLabel: 'Shop winter',
    link: '/collections/all',
  },
}

export const settings = {
  storeName: 'Pet Well',
  logo: 'petwell-logo-transparent.png',
  currency: 'gbp',
  promo: { show: true, text: 'Save an extra 10% sitewide with code', code: 'PETWELL10', daysFromNow: 18 },
  saleBar: { show: true, boldText: 'Winter Sale:', text: 'up to 20% off pet essentials', link: '/collections/all' },
  infoBar: { show: true, boldText: 'Next day delivery', text: 'available on prescriptions*' },
  usps: [
    { icon: 'truck', boldText: 'Free delivery', text: 'over £49' },
    { icon: 'pill', boldText: 'Next day', text: 'prescription delivery' },
    { icon: 'stars', boldText: 'Rated Excellent', text: 'by customers' },
    { icon: 'shield', boldText: 'Trusted by thousands', text: 'of pet owners' },
    { icon: 'gift', boldText: 'Earn reward points', text: 'every time you shop' },
  ],
}

export const pages = [
  {
    slug: 'prescriptions',
    title: 'Prescriptions made easy',
    intro: "Upload your vet's prescription at checkout and our pharmacy team will dispatch your pet's medicine fast.",
    markdown: `### How it works
- Add your pet's medicine to your basket.
- In your basket, enter your pet's details and upload a photo or PDF of the written prescription from your vet – or choose to send it by email or post.
- Our pharmacy team checks the prescription before your order is sent. We'll contact you if anything is missing.`,
  },
  {
    slug: 'subscribe-and-save',
    title: 'Subscribe & Save',
    intro: 'Repeat deliveries, made easy. Save on every order and never run out.',
    markdown: `- Save on every repeat order
- Delivered to your door on your schedule
- Skip, change or cancel any time

Contact our team to set up a repeat delivery for your pet's essentials.`,
  },
  {
    slug: 'rewards',
    title: 'Petwell Rewards',
    intro: 'Earn rewards every time you shop.',
    markdown: `Collect points on every order and turn them into money off your next purchase. Contact us to find out more.`,
  },
  {
    slug: 'help-centre',
    title: 'Help centre',
    intro: 'Answers to common questions about orders, delivery and prescriptions.',
    markdown: `### Delivery
Free delivery on orders over £49. Standard and express delivery are available at checkout.

### Track your order
Use the [order status page](/order-status) with your order number and email address.

### Still need help?
[Contact our pet care team](/pages/contact) – we're here Monday to Friday, 9am–5pm.`,
  },
]

export type SeedPost = {
  slug: string
  title: string
  image: string
  excerpt: string
  readTime: number
  publishedAt: string
  shopLinkLabel: string
  shopLinkUrl: string
  markdown: string
}

export const posts: SeedPost[] = [
  {
    slug: 'a-simple-guide-to-your-cats-dental-health',
    title: "A simple guide to your cat's dental health",
    image: 'A_simple_guide_to_your_cat_s_dental_health.jpg',
    excerpt:
      "Most adult cats have some dental disease, and they're experts at hiding the pain. The signs to look for and how to keep their teeth healthy.",
    readTime: 3,
    publishedAt: '2026-11-08T23:08:36Z',
    shopLinkLabel: 'Shop cat healthcare',
    shopLinkUrl: '/collections/cat',
    markdown: `Cats are masters at hiding pain, and a sore mouth is no exception. Many cats with painful teeth keep eating as normal, so dental problems often go unnoticed until they're quite advanced. A few minutes of attention each week can make a real difference to your cat's comfort and long-term health.
### How common is dental disease in cats?
Very. Cornell University's feline health centre reports that between 50% and 90% of cats over four years old have some form of dental disease. The three most common problems are:
- Gingivitis: red, inflamed gums caused by a build-up of plaque.
- Periodontitis: when gingivitis progresses and starts to damage the tissues and bone that hold the teeth in place.
- Tooth resorption: a painful condition, very common in cats, where the tooth structure is gradually broken down. Its cause isn't yet known, and it's the most common reason cats lose teeth.
### From plaque to tartar in two days
Plaque is a soft, sticky film of bacteria that forms on teeth every day. If it isn't removed, it hardens into tartar within about 36 to 48 hours. Tartar can't be brushed away, and it gives bacteria a place to settle along the gum line. That's why regular home care matters so much.
### Signs your cat may have a sore mouth
- bad breath
- a red line along the gums, or bleeding gums
- yellow or brown build-up on the teeth
- drooling, or pawing at the mouth
- dropping food, chewing on one side, or suddenly preferring soft food
- grooming less, so the coat looks scruffy
- weight loss, hiding, or seeming irritable
Remember: a cat who is still eating can still be in pain.
### A quick monthly mouth check
Pick a calm moment when your cat is relaxed. Gently lift the side of their upper lip and look at the teeth and gums, especially the big back teeth. Healthy gums are pink with no redness at the edge of the teeth. If you see redness, swelling, tartar or a broken tooth, book a vet appointment.
### How to brush your cat's teeth
Daily brushing is the most effective way to remove plaque before it hardens. Most cats can learn to accept it if you go slowly and keep sessions short and positive. If your cat's gums already look sore, see your vet before you start, because brushing inflamed gums can hurt.
- Choose the right kit. Use a toothpaste made for cats; never use human toothpaste, which isn't safe for cats to swallow. Start with a soft finger brush, then move to a small cat toothbrush.
- Days 1 to 3: a tasty introduction. Let your cat lick a little toothpaste from your finger. Most cat toothpastes are meat- or fish-flavoured, so many cats see it as a treat.
- Days 4 to 7: touch the mouth. Gently lift the lip and rub a little paste along the gum line with your finger for a few seconds. Praise and reward afterwards.
- Week 2: add the brush. Use the finger brush on a few outer teeth, working along the gum line with small circular movements. Focus on the outside surfaces; you don't need to open your cat's mouth.
- Week 3 onwards: build up. Gradually work round to the back teeth, aiming for about 30 seconds per side. Stop before your cat gets fed up, and always finish on a good note.
If daily brushing isn't possible, a few times a week still helps.
### Other ways to help
Dental diets with a special kibble shape and texture, dental treats and chew toys can all help reduce plaque alongside brushing. Ask your vet which products are best for your cat, especially if they have other health conditions.
### Regular vet checks
Your vet will check your cat's mouth at their annual health check. Older cats benefit from checks every six months. Some problems, especially tooth resorption, can only be fully assessed with dental X-rays under anaesthetic. Painful or badly damaged teeth often need to be removed, and most cats feel much better and eat happily afterwards.
Looking after your cat's teeth is one of the simplest ways to keep them comfortable, healthy and happy for longer.`,
  },
  {
    slug: 'caring-for-your-senior-dogs-joints',
    title: "Caring for your senior dog's joints",
    image: 'Caring_for_your_senior_dog_s_joints.jpg',
    excerpt:
      'Stiff after a nap or slower on walks? It may be more than old age. How to spot arthritis early and keep your dog comfortable.',
    readTime: 3,
    publishedAt: '2026-11-08T23:06:06Z',
    shopLinkLabel: 'Shop joint & mobility support',
    shopLinkUrl: '/products/vetacare-joint-support-chews-for-dogs',
    markdown: `If your dog takes a little longer to get up after a nap, or has started lagging behind on walks, it's easy to put it down to old age. Often, though, these are early signs of arthritis, and there's a lot you can do to help.
### Arthritis is common in older dogs
Osteoarthritis is the most common joint disease in dogs. It happens when the smooth cartilage that cushions a joint wears down, so the joint becomes stiff, inflamed and painful. A large UK study of more than 455,000 dogs under veterinary care estimated that around 200,000 dogs in the UK are diagnosed with it each year. The dogs most at risk were heavier dogs, dogs over eight years old, and breeds such as Labradors and Golden Retrievers.
Arthritis can't be cured. With the right care, though, most dogs with arthritis can stay comfortable and active for years.
### Signs to look out for
Arthritis usually develops slowly, so the signs are easy to miss. The PDSA lists these common ones:
- stiffness, especially after resting or after a walk
- limping or favouring one leg
- slowing down on walks or wanting to turn back early
- weaker, thinner muscles over the hips and back legs
- being quieter or grumpier than usual, or sleeping more
You might also notice your dog hesitating at the stairs, no longer jumping onto the sofa or into the car, or licking at a particular joint.
If you spot any of these, book a check-up with your vet. Older dogs benefit from regular health checks anyway, and the sooner arthritis is found, the more you can do to slow it down.
### 1. Keep them slim
This is the single most helpful thing you can do. Every extra kilo puts more strain on sore joints. Ask your vet or vet nurse to check your dog's body condition and suggest a target weight. Weigh food rather than scooping it, and count treats as part of the daily allowance.
### 2. Exercise little and often
Keeping active keeps muscles strong, and strong muscles support the joints. Instead of one long walk, try two or three shorter, gentler walks a day on flat, even ground. The PDSA suggests avoiding activities that jar the joints, such as jumping, skidding, chasing balls and running on uneven ground. Swimming and hydrotherapy are excellent low-impact options; ask your vet about a referral.
At home, encourage your dog to get up and potter about during the day. Lying still for hours can make joints stiffer.
### 3. Make home more comfortable
Small changes can make a big difference:
- A supportive bed. An orthopaedic or memory foam bed spreads your dog's weight and eases pressure on the hips and elbows. Place it somewhere warm and away from draughts.
- Grip underfoot. Laminate and tiled floors are slippery for stiff legs. Rugs or runners on your dog's usual routes help them feel steady.
- Ramps and steps. A ramp into the car or a step up to the sofa saves sore joints from jumping.
- Short nails. Overgrown nails change the way a dog stands and walks, so keep them trimmed.
### 4. Talk to your vet about pain relief and supplements
Your vet may prescribe anti-inflammatory pain relief, which can be given daily or in courses. Many dogs become noticeably brighter and more playful once their pain is controlled. Physiotherapy and hydrotherapy can also help.
Joint supplements, usually containing ingredients such as omega-3 fatty acids, glucosamine or green-lipped mussel, are popular. Quality varies a lot between products, so ask your vet which one suits your dog. Never give your dog painkillers meant for people: many are toxic to dogs.
### 5. Keep track of how they're doing
Arthritis can have good days and bad days. Jot down how your dog manages walks, stairs and getting up each week, or film them walking once a month. It makes changes easier to spot and gives your vet useful information at check-ups.
With a little extra care, your senior dog can keep enjoying walks, play and their favourite spot on the sofa for years to come.`,
  },
  {
    slug: 'how-to-protect-your-dog-from-fleas-and-ticks-all-year',
    title: 'How to protect your dog from fleas and ticks all year',
    image: 'How_to_protect.jpg',
    excerpt:
      "Fleas and ticks aren't just a summer problem. Here's why UK dogs need protection all year, how to spot both pests, and what to do.",
    readTime: 4,
    publishedAt: '2026-11-08T23:03:53Z',
    shopLinkLabel: 'Shop flea, tick & worm treatments',
    shopLinkUrl: '/products/vetacare-flea-tick-spot-on-for-dogs',
    markdown: `Many of us think of fleas and ticks as a summer nuisance. In the UK, they're a year-round problem. Our centrally heated homes keep fleas breeding through the winter, and ticks are found on dogs in towns as well as the countryside. The good news is that a simple routine keeps your dog, and your home, protected in every season.
### Why fleas don't take the winter off
Fleas love warmth. The PDSA notes that around 21°C is their ideal temperature for hatching, which is about where most of us set the thermostat in winter. In those conditions a flea can go from egg to adult in as little as two to three weeks.
The fleas you see on your dog are only the tip of the iceberg. About 5% of an infestation is adult fleas on your pet. The other 95% are eggs, larvae and pupae hiding in carpets, floorboards, sofas and pet beds. Flea pupae can lie dormant for up to a year, waiting for warmth and the vibration of footsteps to tell them it's time to hatch. That's why a sudden flea problem often appears in autumn, just as the heating goes back on.
### Signs your dog has fleas
- Scratching, nibbling or licking more than usual, especially around the lower back and base of the tail
- Red, irritated skin or patches of thinning fur
- Tiny dark specks in the coat ("flea dirt"). Comb some onto damp white kitchen roll: if they turn reddish-brown, it's flea droppings
- Small itchy bites on people in the house, often around the ankles
Some dogs are allergic to flea saliva, so even one bite can make them very itchy. Fleas can also pass on tapeworm if your dog swallows one while grooming.
### Ticks: more common than you might think
The Big Tick Project, run by the University of Bristol, checked dogs at random during routine vet visits across the UK. Almost a third of them (31%) were carrying a tick. Dogs were at risk in both urban and rural areas, with the South West, Scotland and East Anglia among the highest-risk regions.
Ticks matter because they can carry diseases, including Lyme disease, which can also affect people, and canine babesiosis. Babesiosis has now been found in UK dogs that have never travelled abroad.
### How to check your dog for ticks
Ticks are most active from spring to autumn, but it's worth checking after every walk through long grass, woodland or parks. Run your hands slowly over your dog and feel for small bumps, paying special attention to:
- the head, ears and around the eyes
- the neck and under the collar
- the armpits and groin
- between the toes
A tick can be as small as a sesame seed before it feeds, and grows to the size of a pea once it's full.
### How to remove a tick safely
- Use a tick removal tool (also called a tick twister). Slide the slot under the tick, as close to the skin as you can.
- Twist gently in one direction a few times until the tick comes away. Don't pull straight up.
- Never squeeze the tick's body, burn it, or cover it in creams or oils. This can make it release more saliva into your dog.
- Clean the area and wash your hands. Keep an eye on the spot for a few days.
If you're not confident, or your dog seems unwell afterwards (tired, off their food, lame or feverish), contact your vet.
### Your year-round protection plan
Treat every pet, every month. Use a vet-approved flea and tick treatment matched to your dog's weight, and keep going through the winter. Treat every cat and dog in the household at the same time, so fleas can't simply move to another pet.
Never use a dog product on a cat. Some dog flea treatments contain permethrin, which is highly toxic to cats. Always check the label.
Treat your home too. If you find fleas:
- vacuum carpets, sofas and the car every day for a week or two, then empty the vacuum outside
- wash your dog's bedding on a hot cycle (at least 60°C)
- use a household flea spray that also stops eggs and larvae developing, following the instructions carefully
Don't worry if you still spot the odd flea for a few weeks. New fleas keep hatching from pupae, and the treatment kills them before they can lay eggs.
Make it a habit. The easiest way to stay protected is to never miss a dose. Set a monthly reminder, or choose Subscribe & Save on your treatment so it arrives on time without you having to think about it.
### When to see your vet
Speak to your vet if your dog has sore or broken skin, hair loss, a heavy infestation, or any signs of illness after a tick bite. Your vet can also recommend the best type of treatment for your dog's lifestyle, especially if you're planning to travel abroad.`,
  },
]
