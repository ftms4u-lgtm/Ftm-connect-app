import { Profile, Gender, RelationshipGoal, GuideArticle } from "./types";

export const DEMO_PROFILES: Profile[] = [
  {
    id: "ftm_toby",
    name: "Toby",
    age: 27,
    gender: Gender.FTM_TRANSMAN,
    pronouns: "he/him",
    bio: "Software engineer by day, outdoor camping geek by night. I'm simple, direct, and love hiking, vinyl records, and cooking spicy pasta. Seeking a cisgender partner who loves deep talks, cozy movie nights, and isn't afraid to go off-grid on weekends.",
    interests: ["Hiking", "Tech", "Vinyl Records", "Cooking", "Independent Cinema"],
    goals: RelationshipGoal.LONG_TERM,
    location: "Brooklyn, NY",
    distanceMiles: 4,
    profession: "Software Engineer",
    education: "B.S. in Computer Science",
    avatarSeed: "toby",
    avatarBgColor: "from-amber-400 to-rose-500",
    transitionStageShared: "On T for 5 years, post-top surgery. Open about my journey!",
    openToAnsweringQuestions: "happy_to_share",
    verificationStatus: "verified",
  },
  {
    id: "cis_clara",
    name: "Clara",
    age: 26,
    gender: Gender.CISGENDER_WOMAN,
    pronouns: "she/her",
    bio: "Pediatric nurse with a passion for books, backpacking, and my standard poodle, Pip. Here to meet respectful, genuine fellas who value communication. I love spontaneous road trips, learning languages, and trying new craft breweries.",
    interests: ["Backpacking", "DOGS", "Literature", "Craft Beer", "Board Games"],
    goals: RelationshipGoal.LONG_TERM,
    location: "Manhattan, NY",
    distanceMiles: 6,
    profession: "Pediatric Nurse",
    education: "B.S. in Nursing",
    avatarSeed: "clara",
    avatarBgColor: "from-sky-400 to-indigo-500",
    openToAnsweringQuestions: "only_if_matched_and_close",
    verificationStatus: "verified",
  },
  {
    id: "ftm_leo",
    name: "Leo",
    age: 24,
    gender: Gender.FTM_TRANSMAN,
    pronouns: "he/they",
    bio: "Graphic designer and digital painter. I run on oat milk lattes and indie pop music. Big museum wanderer and vintage thrifter. Love exploring city alleys for hidden book shops. Looking for someone warm, creative, and down-to-earth.",
    interests: ["Digital Painting", "Thrifting", "Coffee Culture", "Museums", "Indie Music"],
    goals: RelationshipGoal.OPEN_TO_CONNECTIONS,
    location: "Astoria, NY",
    distanceMiles: 8,
    profession: "Graphic Designer",
    education: "B.F.A. in Graphic Design",
    avatarSeed: "leo",
    avatarBgColor: "from-teal-400 to-emerald-600",
    transitionStageShared: "Transparent about being transmasc. Living as my authentic self!",
    openToAnsweringQuestions: "only_if_matched_and_close",
    verificationStatus: "verified",
  },
  {
    id: "cis_julian",
    name: "Julian",
    age: 29,
    gender: Gender.CISGENDER_MAN,
    pronouns: "he/him",
    bio: "High school history teacher who loves bicycles, historical fiction, and fermenting sourdough. Strongly supportive trans ally. Looking for deep discussions, supportive partners, and shared adventures. Let's exchange favorite books!",
    interests: ["Bicycling", "Sourdough", "History Loft", "Audiobooks", "Local Volunteering"],
    goals: RelationshipGoal.LONG_TERM,
    location: "Hoboken, NJ",
    distanceMiles: 11,
    profession: "History Teacher",
    education: "M.A. in Education",
    avatarSeed: "julian",
    avatarBgColor: "from-emerald-400 to-blue-500",
    openToAnsweringQuestions: "happy_to_share",
    verificationStatus: "verified",
  },
  {
    id: "ftm_ethan",
    name: "Ethan",
    age: 31,
    gender: Gender.FTM_TRANSMAN,
    pronouns: "he/him",
    bio: "Environmental researcher. I spend 75% of my life cataloging marsh plants, and the other 25% wood carving and drinking loose-leaf tea. Quiet, introverted, and incredibly dedicated. Looking for a cis woman or man who appreciates slower, intentional dating.",
    interests: ["Botany", "Woodworking", "Tea Tastings", "Acoustic Guitar", "Star Gazing"],
    goals: RelationshipGoal.LONG_TERM,
    location: "Staten Island, NY",
    distanceMiles: 15,
    profession: "Environmental Scientist",
    education: "Ph.D. in Botany",
    avatarSeed: "ethan",
    avatarBgColor: "from-violet-400 to-fuchsia-600",
    transitionStageShared: "Transman, fully transitioned. Happy to discuss once we get to know each other.",
    openToAnsweringQuestions: "prefer_no_invasive_questions",
    verificationStatus: "verified",
  },
  {
    id: "cis_sophia",
    name: "Sophia",
    age: 28,
    gender: Gender.CISGENDER_WOMAN,
    pronouns: "she/her",
    bio: "Copywriter at a design collective. Big fan of tabletop RPGs, warm chai, and cozy oversized sweaters. Love meeting thoughtful fellas to explore brunch spots, live stand-up comedy, and local greenhouse markets. Inclusive ally!",
    interests: ["Tabletop RPGs", "Chai", "Gardening", "Live Comedy", "Creative Writing"],
    goals: RelationshipGoal.FRIENDSHIP,
    location: "Queens, NY",
    distanceMiles: 9,
    profession: "UX Copywriter",
    education: "B.A. in English Lit",
    avatarSeed: "sophia",
    avatarBgColor: "from-pink-400 to-rose-600",
    openToAnsweringQuestions: "happy_to_share",
    verificationStatus: "verified",
  },
  {
    id: "nb_reese",
    name: "Reese",
    age: 25,
    gender: Gender.NON_BINARY,
    pronouns: "they/them",
    bio: "Barista & zine maker. Very passionate about queer community events, modular synthesizers, and vintage camera film photography. Open connection seeker who enjoys good energy above all else. Let's hit up a record store!",
    interests: ["Film Photography", "Zine Making", "Synthesizers", "LPs", "Boba Tea"],
    goals: RelationshipGoal.FRIENDSHIP,
    location: "Brooklyn, NY",
    distanceMiles: 3,
    profession: "Barista & Coordinator",
    education: "Self-educated",
    avatarSeed: "reese",
    avatarBgColor: "from-amber-300 to-indigo-600",
    openToAnsweringQuestions: "happy_to_share",
    verificationStatus: "verified",
  },
];

export const EDUCATIONAL_ARTICLES: GuideArticle[] = [
  {
    id: "guide_ftm_101",
    title: "Understanding FTM Transmasculine Identity",
    category: "Terminology",
    excerpt: "What does FTM mean, and how does it relate to gender and identity in modern dating?",
    content: `**FTM** stands for "Female-to-Male," which refers to transmasculine individuals who were assigned female at birth but whose true internal gender identity is male/masculine. 

### Core Concepts to Keep in Mind:
* **Transgender Men are Men:** Transgender men share the same social, emotional, and relational needs as any other men.
* **Transition is Personal:** Transitioning can involve social changes (name, pronouns, clothes), hormonal therapies (Testosterone/T), and surgical procedures (top or bottom surgery). However, there is no "correct" way to be trans; every individual's journey is unique and valid.
* **Aesthetic & Grooming:** Many FTM individuals grow facial hair, build muscle, and undergo voice changes, while some express their masculinity in distinct, creative ways.
* **Orientation:** Being trans is about *identity*, not *attraction*. FTM men can be straight, gay, bisexual, pansexual, or asexual, just like cisgender men.`,
    iconName: "Heart",
  },
  {
    id: "guide_cis_etiquette",
    title: "Dating Etiquette for Cisgender Partners",
    category: "Ally Guidance",
    excerpt: "Dos and don'ts to make your FTM date feel safe, respected, and romantically valued.",
    content: `Dating trans individuals can be a beautiful experience. To ensure you maintain a respectful, safe space for your date, review these conversational guidelines:

### 👍 DO:
* **Focus on the Person:** Ask about their hobbies, their job, their taste in music, and what they’re looking for, just like on any date!
* **Respect Pronouns:** Always use their correct pronouns (usually he/him or he/they). If you make a mistake, simply apologize briefly, correct yourself, and move on.
* **Let Them Take the Lead on Trans Topics:** Some trans men are very open about their transition, while others prefer to keep it private until a trust bond is formed. Let them choose when and how to discuss it.
* **Use Literal, Affirming Terminology:** Refer to them as men, partners, or dates. 

### 👎 DON'T:
* **Don't Ask Invasive Questions Early On:** Never ask about surgery, genitalia, medical history, or their "birth name" (often called deadname). These questions are highly personal and can trigger dysphoria or feel objectifying.
* **Don't Fetishize:** Avoid comments like "I've always wanted to try dating a trans guy" or centering their identity as a novelty. It makes them feel like a curiosity rather than a whole person.
* **Don't Make Assumptions About Sex:** Physical intimacy looks different for everyone. Let trust build naturally and have open, enthusiastic conversations when the time comes.
* **Don't Out Them:** A trans person's identity is their personal information. Never share their trans status with friends, family, or strangers without their explicit consent.`,
    iconName: "AlertCircle",
  },
  {
    id: "guide_safety_stages",
    title: "Dysphoria, Euphoria & Intimacy",
    category: "Safety & Transition",
    excerpt: "Learn how to assist your partner through moments of dysphoria and foster gender-affirming romantic loops.",
    content: `Intimacy with an FTM partner requires active consent, communication, and basic awareness of **Gender Dysphoria** and **Gender Euphoria**.

### Gender Dysphoria 
Dysphoria is the distress or discomfort some trans folk feel when their physical characteristics or social roles do not line up with their true gender. 
* **In dating:** Physical touch can sometimes trigger dysphoria. If your partner seems distant or asks to halt a certain kind of physical affection, respond with love and reassurance. It is not a rejection of you; it is a temporary reflection of their body-mind comfort.
* **Support:** Praise them using masculine-affirming adjectives (e.g. handsome, strong, beautiful energy, charming) and ask: *"How can I best support you right now?"*

### Gender Euphoria
Euphoria is the profound joy, comfort, or sense of alignment a trans person feels when they are accurately perceived, respected, and affirmed.
* **Affirming Romance:** Holding the door, buying flowers, calling them your boyfriend, and treating them with traditional or customized romantic elements are fantastic methods to spark gender euphoria!`,
    iconName: "Compass",
  },
];
