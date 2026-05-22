export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "breastfeeding-tips" | "nutrition" | "mental-health" | "product-guide";
  categoryLabel: string;
  author: string;
  authorRole: string;
  image: string;
  readTime: number;
  publishedAt: string;
  isPublished: boolean;
  tags: string[];
  featured: boolean;
}

export const ARTICLE_CATEGORIES: { value: Article["category"]; label: string; color: string; bg: string }[] = [
  { value: "breastfeeding-tips", label: "Breastfeeding Tips", color: "#D5557E", bg: "#FFF5F8" },
  { value: "nutrition",          label: "Nutrition",          color: "#10B981", bg: "#ECFDF5" },
  { value: "mental-health",      label: "Mental Health",      color: "#8B5CF6", bg: "#F5F3FF" },
  { value: "product-guide",      label: "Product Guide",      color: "#F59E0B", bg: "#FFFBEB" },
];

const INITIAL_ARTICLES: Article[] = [
  {
    id: "art-1",
    slug: "10-cara-alami-tingkatkan-asi",
    title: "10 Natural Ways to Boost Your Milk Supply",
    excerpt: "Struggling with low milk supply? Before reaching for supplements, try these evidence-backed natural strategies that real mamas swear by.",
    content: `Many new mothers worry about whether they're producing enough milk. The good news is that for most mamas, supply is driven by demand — meaning the more you feed or pump, the more milk your body produces. Here are 10 natural strategies to support a healthy, abundant milk supply.

First and foremost: feed frequently and on demand. Newborns typically feed 8–12 times in 24 hours. Each time your baby empties the breast, your body receives a signal to produce more. Skipping feeds or supplementing with formula without a medical reason can reduce your supply over time. If your baby is sleeping longer stretches, try offering the breast when they stir.

Hydration and rest are non-negotiable. Your body uses approximately 500–900 extra calories and significant fluid to produce breast milk. Aim for at least 2–3 liters of water per day, and try to sleep when your baby sleeps. Chronic fatigue and dehydration are two of the most overlooked causes of dipping supply.

Certain foods — called galactagogues — have long been used across cultures to support lactation. Oats are rich in beta-glucan, a fiber that may support prolactin levels. Almonds, fenugreek seeds, moringa leaves, and fennel are also commonly used. While scientific evidence is still emerging, many nursing mamas report noticeable differences when incorporating these foods regularly.

Skin-to-skin contact with your baby, especially in the early weeks, triggers a powerful hormonal response — releasing oxytocin and prolactin, which are the two key hormones behind milk let-down and production. Even if you're not feeding, holding your baby skin-to-skin for 20–30 minutes daily can help establish and maintain your supply.

Finally, if you've tried everything and still feel your supply is low, reach out to a certified lactation consultant. A professional can assess your latch, check for tongue-tie, review your pumping technique, and give personalized guidance. Low supply is rarely a permanent situation — with the right support, most mamas can build the supply they need.`,
    category: "breastfeeding-tips",
    categoryLabel: "Breastfeeding Tips",
    author: "Dr. Ayu Larasati",
    authorRole: "IBCLC, Pediatrician",
    image: "https://images.unsplash.com/photo-1648375975494-30e0629799a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVhc3RmZWVkaW5nJTIwbW90aGVyJTIwYmFieSUyMHdlbGxuZXNzfGVufDF8fHx8MTc3OTI5MDE2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    readTime: 5,
    publishedAt: "2025-04-10",
    isPublished: true,
    tags: ["milk supply", "galactagogues", "breastfeeding", "natural remedies"],
    featured: true,
  },
  {
    id: "art-2",
    slug: "nutrisi-lengkap-ibu-menyusui",
    title: "The Complete Nutrition Guide for Breastfeeding Mamas",
    excerpt: "What you eat directly affects the quality and quantity of your breast milk. Here's everything you need to know about eating well while nursing.",
    content: `Breastfeeding is one of the most nutritionally demanding phases of a woman's life. Your body prioritizes your baby's needs first — pulling nutrients from your own stores if necessary. This means that eating well while nursing is not just about your baby; it's about protecting your own long-term health too.

Caloric needs increase by approximately 400–500 calories per day while breastfeeding. Rather than counting calories obsessively, focus on nutrient density. Fill your plate with whole grains (brown rice, oats, quinoa), lean proteins (chicken, fish, tofu, tempeh), healthy fats (avocado, nuts, olive oil), and a colorful variety of vegetables and fruits.

Calcium is critically important — both for your baby's bone development and to protect your own bone density. Aim for 1,000mg per day from sources like dairy products, fortified plant milks, tofu, edamame, and leafy greens like kale and bok choy. Iron-rich foods (red meat, spinach, lentils) paired with vitamin C sources improve absorption and help combat postpartum fatigue.

Omega-3 fatty acids, especially DHA, are essential for your baby's brain and eye development. Fatty fish like salmon and sardines are excellent sources (safe to eat 2–3 times per week). If you don't eat fish, algae-based DHA supplements are a good alternative. Iodine is another often-overlooked nutrient — found in seaweed, dairy, and eggs — crucial for thyroid function and baby's cognitive development.

As for what to limit or avoid: high-mercury fish (shark, swordfish, king mackerel), excess caffeine (keep it under 200mg/day), and alcohol (if you do drink, wait at least 2 hours before nursing). Some babies are sensitive to certain foods in a mother's diet — common culprits include dairy, soy, and cruciferous vegetables — but this varies greatly from baby to baby. A food diary can help you spot patterns.`,
    category: "nutrition",
    categoryLabel: "Nutrition",
    author: "Agnes Susanti Widjaja",
    authorRole: "B.Sc. Food Technology & Nutrition",
    image: "https://images.unsplash.com/photo-1758523419881-a105870bec27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbnV0cml0aW9uJTIwZm9vZCUyMHByZWduYW5jeXxlbnwxfHx8fDE3NzkyOTAxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    readTime: 6,
    publishedAt: "2025-04-05",
    isPublished: true,
    tags: ["nutrition", "diet", "calcium", "omega-3", "breastfeeding"],
    featured: true,
  },
  {
    id: "art-3",
    slug: "mengatasi-baby-blues-kecemasan",
    title: "You're Not Alone: Understanding Postpartum Anxiety",
    excerpt: "Postpartum anxiety is more common than postpartum depression, yet rarely discussed. Learn the signs, what's normal, and how to find support.",
    content: `Becoming a mother is a profound, life-changing experience — and not always in ways that feel beautiful. Postpartum anxiety affects up to 20% of new mothers, yet it remains significantly under-discussed compared to postpartum depression. If you find yourself constantly worrying, struggling to sleep even when your baby does, or feeling a sense of dread you can't shake, you are not alone — and there is support available.

Postpartum anxiety goes beyond ordinary "new mom worries." Signs to watch for include: racing thoughts that you can't quiet, persistent fears that something terrible will happen to your baby, physical symptoms like a racing heart, dizziness, or nausea, irritability, and difficulty concentrating. Unlike postpartum depression (which often presents with sadness and withdrawal), anxiety often shows up as hypervigilance — being "on alert" all the time.

Baby blues — the weepy, emotionally raw first 1–2 weeks after birth — are a normal response to the dramatic hormone shift after delivery. They typically resolve on their own. Postpartum anxiety and depression, however, tend to persist or worsen past the 2-week mark and require more intentional support. The distinction matters because knowing which you're experiencing shapes the kind of help you seek.

Self-care strategies that genuinely help include: asking for and accepting help from family and friends, establishing a predictable daily routine, limiting doomscrolling and social media comparison, gentle movement (even a 10-minute walk), and deep breathing exercises. Talking to other mothers — whether in person or in online communities — can be enormously validating. You are not weak for struggling; you are adapting to one of the hardest transitions a human being goes through.

If anxiety is significantly impacting your daily functioning or your relationship with your baby, please speak with a healthcare provider. Therapy (particularly cognitive-behavioral therapy), support groups, and in some cases medication are all evidence-based options that work. Seeking help is not giving up — it is the most loving thing you can do for yourself and your baby.`,
    category: "mental-health",
    categoryLabel: "Mental Health",
    author: "Bidan Nisa",
    authorRole: "Lactation Counselor",
    image: "https://images.unsplash.com/photo-1714646793297-5d0f006f78cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RoZXIlMjBtZW50YWwlMjBoZWFsdGglMjBjYWxtJTIwbWVkaXRhdGlvbnxlbnwxfHx8fDE3NzkyOTAxNzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    readTime: 5,
    publishedAt: "2025-03-28",
    isPublished: true,
    tags: ["mental health", "postpartum", "anxiety", "baby blues", "self-care"],
    featured: false,
  },
  {
    id: "art-4",
    slug: "masalah-latch-penyebab-solusi",
    title: "Latching Problems: Why It Happens and How to Fix It",
    excerpt: "A poor latch is the number one cause of breastfeeding pain and low supply. Learn how to recognize a shallow latch and what you can do about it.",
    content: `A deep, comfortable latch is the foundation of successful breastfeeding. When latching is working well, feeding should be pain-free (you may feel pressure or tugging but not sharp pain), your baby should be able to transfer milk efficiently, and your supply will develop properly. When latching goes wrong, it can cause cracked nipples, mastitis, poor weight gain in baby, and — most sadly — premature breastfeeding cessation. The good news: most latching problems can be fixed.

A shallow latch is the most common issue. This happens when baby takes only the nipple into the mouth, rather than a large portion of the breast. Signs include: pain during feeding, a clicking sound, your nipple looks pinched or "lipstick-shaped" after a feed, and your baby seems unsatisfied after long feeds. To improve latch: make sure baby opens wide (try tickling the top lip), bring baby to the breast (not breast to baby), aim baby's lower lip well below the nipple, and ensure their chin is pressing into the breast.

Tongue-tie (ankyloglossia) is an often-missed cause of latching difficulty. In tongue-tie, a tight band of tissue under the tongue restricts its movement, making it hard for baby to cup the breast and maintain suction. Signs include: clicking sound during feeding, difficulty maintaining a seal, slow weight gain, and a heart-shaped tongue tip when baby cries. A pediatrician, IBCLC, or pediatric dentist can assess for tongue-tie. A simple procedure (frenotomy) often resolves the issue quickly.

Engorgement — especially in the first days when milk "comes in" — can make it hard for baby to latch onto a rock-hard, swollen breast. Try hand-expressing a small amount before a feed to soften the areola, or use a warm compress for 2–3 minutes. Breast shields (nipple shields) can be helpful in some situations but should be used under guidance from a lactation consultant, as they can affect supply if used improperly.

If you're in pain, don't push through silently. Broken nipples and mastitis (breast infection) can develop quickly and make breastfeeding much harder. Reach out to a lactation consultant early — ideally within the first week postpartum if you have any concerns. Mamabear's free consultation service is available to help you work through exactly these kinds of challenges.`,
    category: "breastfeeding-tips",
    categoryLabel: "Breastfeeding Tips",
    author: "Dr. Ayu Larasati",
    authorRole: "IBCLC, Pediatrician",
    image: "https://images.unsplash.com/photo-1751890855930-7520793ce160?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxicmVhc3RmZWVkaW5nJTIwbW90aGVyJTIwYmFieSUyMHdlbGxuZXNzfGVufDF8fHx8MTc3OTI5MDE2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    readTime: 6,
    publishedAt: "2025-03-15",
    isPublished: true,
    tags: ["latch", "tongue-tie", "nipple pain", "newborn", "breastfeeding"],
    featured: false,
  },
  {
    id: "art-5",
    slug: "membangun-stok-asi-perah",
    title: "Building a Breast Milk Stash: A Working Mom's Complete Guide",
    excerpt: "Returning to work doesn't have to mean the end of breastfeeding. Here's how to build, store, and maintain a breast milk stash that works for your life.",
    content: `Going back to work while breastfeeding is one of the most common challenges nursing mothers face. The key to making it work is preparation: building a stash of pumped milk before your return, setting up a pumping schedule that protects your supply, and knowing how to store and use your milk safely. With the right plan, many mamas breastfeed well beyond their return to work.

Start building your stash 2–4 weeks before your return date. Pump once a day after your first morning feed (when supply is usually highest) and save the milk. Don't stress about the amount — even 30–60ml per session adds up quickly. Aim to have 10–20 feedings worth of stored milk before your return. More than that is great, but don't sacrifice your current nursing relationship to build a massive stash.

Safe storage guidelines: breast milk can be kept at room temperature for up to 4 hours; in a refrigerator for up to 4 days; in a freezer compartment of a fridge for 2 weeks; in a deep freezer for 6–12 months. Always store in BPA-free milk storage bags or hard plastic/glass containers. Label every bag with the date and amount. Use oldest milk first (first in, first out). Pre-portion bags in the amount your baby typically takes in one feeding to reduce waste.

Once back at work, aim to pump as often as your baby feeds, approximately every 2–3 hours for the first 6 months. Finding a private, comfortable space to pump matters enormously for let-down. Looking at a photo or video of your baby, or having a piece of their clothing nearby, can help trigger the oxytocin response. Try to pump for at least 15 minutes per session, or 2 minutes after milk stops flowing.

A drop in supply is common during the return-to-work transition, especially if pumping doesn't quite replace the efficiency of direct nursing. Power pumping (pumping on-off for 60 minutes once a day) can help rebuild supply. Staying hydrated, eating well, and managing stress all play a role. And remember: using some formula on tough days is not failure. Fed is fed, and your wellbeing matters too.`,
    category: "breastfeeding-tips",
    categoryLabel: "Breastfeeding Tips",
    author: "Bidan Nisa",
    authorRole: "Lactation Counselor",
    image: "https://images.unsplash.com/photo-1723934602247-9243d87b599e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVhc3QlMjBwdW1wJTIwd29ya2luZyUyMG1vbSUyMHB1bXBpbmd8ZW58MXx8fHwxNzc5MjkwMTczfDA&ixlib=rb-4.1.0&q=80&w=1080",
    readTime: 7,
    publishedAt: "2025-03-01",
    isPublished: true,
    tags: ["pumping", "working mom", "milk storage", "stash", "returning to work"],
    featured: false,
  },
  {
    id: "art-6",
    slug: "mengenal-produk-asi-booster",
    title: "ASI Booster Products: What the Science Actually Says",
    excerpt: "Not all ASI boosters are created equal. A food scientist breaks down which ingredients have real evidence behind them — and what to look for on the label.",
    content: `The market for lactation-support products has exploded in recent years, and with so many options available, it can be overwhelming (and expensive) to figure out what's worth trying. As both a breastfeeding mother and someone with a background in food technology and nutrition, I've spent years researching this topic. Here's an honest look at what the science supports.

Galactagogues are substances believed to support milk production. The most studied include: Fenugreek — the most widely used herbal galactagogue, with some clinical studies showing modest increases in milk volume, though results are inconsistent. Moringa (malunggay) — emerging evidence suggests it may be one of the more effective plant-based options, particularly for mothers whose supply drops after the first weeks. Blessed thistle and fennel — commonly used in combination with fenugreek; limited clinical data, but strong anecdotal support. Oats — rich in beta-glucan, which may support prolactin levels; one of the safest and most accessible options.

What to look for when choosing a product: transparency about ingredients and their amounts (not proprietary blends that hide quantities), BPOM certification (Indonesia's food safety authority), Halal certification if relevant to you, and a clean ingredient list without excessive additives, preservatives, or artificial sweeteners. The form matters too — some people find teas and drinks more effective than capsules, possibly because the fluid intake itself supports supply.

At Mamabear, every product is formulated with these principles in mind. We use natural, whole-food ingredients in effective amounts, supported by both traditional use and contemporary food science. Our ASI Booster Tea, Almon Mix, and Capsules are not magic — but used consistently alongside frequent feeding, good nutrition, and adequate rest, they can meaningfully support a nursing mother's journey.

One important caveat: no supplement can compensate for infrequent feeding, dehydration, or chronic stress. If your supply is low, the first steps are always to feed or pump more frequently, increase fluid intake, and address any underlying latch issues. Supplements are best thought of as supportive additions to a strong foundation, not as standalone solutions.`,
    category: "product-guide",
    categoryLabel: "Product Guide",
    author: "Agnes Susanti Widjaja",
    authorRole: "B.Sc. Food Technology & Nutrition",
    image: "https://images.unsplash.com/photo-1686178622370-5579e09fd50f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxicmVhc3RmZWVkaW5nJTIwbW90aGVyJTIwYmFieSUyMHdlbGxuZXNzfGVufDF8fHx8MTc3OTI5MDE2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    readTime: 5,
    publishedAt: "2025-02-15",
    isPublished: true,
    tags: ["ASI booster", "galactagogues", "fenugreek", "moringa", "product guide"],
    featured: true,
  },
];

const STORAGE_KEY = "mamabear_articles";

export function getStoredArticles(): Article[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : INITIAL_ARTICLES;
  } catch {
    return INITIAL_ARTICLES;
  }
}

export function saveStoredArticles(articles: Article[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch { /* ignore */ }
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
