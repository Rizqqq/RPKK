import { RoleplaySession } from '../types/roleplay';

export const MHA_PRESET_SESSION: RoleplaySession = {
  id: 'mha-starter-session',
  title: 'My Hero Academia: The Vector Paradox',
  universe: 'My Hero Academia',
  universeType: 'mha',
  timelineAnchor: 'U.A. High School - Post-USJ Incident & Preparation for the Sports Festival',
  canonLore: `Setting: Musutafu, Japan. 80% of humanity possesses superhuman abilities known as "Quirks". Society is maintained by licensed Pro Heroes, with the Hero Billboard Chart led by the Symbol of Peace: All Might, followed by Endeavor, Best Jeanist, and Hawks.
School: U.A. High School's hero department is the pinnacle of hero education. Class 1-A is guided by homeroom teacher Shota Aizawa (Eraserhead). Notable classmates include Izuku Midoriya (One For All), Katsuki Bakugo (Explosion), Shoto Todoroki (Half-Cold Half-Hot), Ochaco Uraraka (Zero Gravity), Tenya Iida (Engine), Eijiro Kirishima, and Fumikage Tokoyami.
Threats: The League of Villains, orchestrated from the shadows by All For One and commanded on the front lines by Tomura Shigaraki with Kurogiri's warp gates. Rumors of bio-engineered Nomu monsters linger after the USJ attack.
Quirk Mechanics: Quirks are physical functions subject to strain, exhaustion, and quirk factor limitations. Quirk Awakenings can occur under extreme psychological or physical thresholds.`,
  fanficDivergences: [
    {
      id: 'div-mha-1',
      title: 'The Vector Disruption Anomaly',
      category: 'Quirk / Power Mutation',
      description:
        'The player character possesses "Kinetic Vector Redirection", an anomalous Quirk that does not register on standard Japanese quirk registries. It was initially classified as an unregistered quirk anomaly by the Hero Public Safety Commission.',
      priority: 'High',
      active: true,
      tags: ['Quirk Anomaly', 'OC Focus', 'Government Mystery'],
    },
    {
      id: 'div-mha-2',
      title: 'USJ Underground Survivor',
      category: 'Timeline Shift',
      description:
        'During the USJ invasion, a hidden secondary villain infiltration cell attempted to breach the underground disaster control vault, but was intercepted and defeated single-handedly by the player before Aizawa or All Might arrived.',
      priority: 'Subtle',
      active: true,
      tags: ['USJ Divergence', 'Backstory'],
    },
    {
      id: 'div-mha-3',
      title: 'Class 1-A 21st Desk',
      category: 'Canon Rule Override',
      description:
        'Due to exceptional emergency recommendation and classified HPSC intervention, Class 1-A was expanded to 21 students, altering squad dynamics and pairing assignments.',
      priority: 'High',
      active: true,
      tags: ['Class 1-A', 'Hero Society'],
    },
    {
      id: 'div-mha-4',
      title: 'Todoroki\'s Hidden Skepticism',
      category: 'Relationship / Rivalry',
      description:
        'Shoto Todoroki witnessed your vector redirection at USJ and suspects your quirk shares origins with an underground syndicate his father Endeavor investigated years ago, forging an intense, wary rivalry.',
      priority: 'High',
      active: true,
      tags: ['Rivalry', 'Todoroki', 'Endeavor'],
    },
  ],
  character: {
    name: 'Kaelen "Kuro" Jin',
    alias: 'Vectis',
    power: 'Vector Distortion',
    powerDetails:
      'Can perceive and manipulate vectors (magnitude and direction) of physical kinetic energy upon skin or costume contact. Can deflect bullets, reverse blunt impact, or propel objects at supersonic velocity. Overuse causes extreme neural migraines and temporary vertigo.',
    backstory:
      'Raised outside the traditional district hero schools, Kuro trained in private martial arts and physics theory to control his volatility. After saving civilians from an unrecorded quirk rampage, he was recommended straight to U.A. High.',
    appearance:
      'Lean athletic build, raven hair with faint silver highlights, observant amber eyes, dark hero gym uniform reinforced with impact-dampening carbon fiber gloves.',
    stats: {
      power: 74,
      agility: 82,
      intellect: 88,
      willpower: 80,
      mastery: 76,
    },
    health: 100,
    stamina: 100,
    resolve: 85,
    signatureMoves: [
      {
        name: 'Inverse Velocity: Deflection Sphere',
        type: 'Defensive / Kinetic',
        description: 'Instantaneously turns the velocity vector of any projectile or incoming blow back 180 degrees.',
      },
      {
        name: 'Accelerated Step: Vector Dash',
        type: 'Mobility',
        description: 'Multiplies ground friction vector forward, launching in an instantaneous zig-zag flash.',
      },
      {
        name: 'Full Impact Reversal: Point Break',
        type: 'Ultimate Strike',
        description: 'Absorbs opponent kinetic force into palms and releases it concentrated into a single point.',
      },
    ],
  },
  messages: [
    {
      id: 'msg-mha-intro',
      sender: 'model',
      speakerName: 'LoreMaster GM',
      text: `**Ground Beta — U.A. High School Combat Training Grounds**

The afternoon sun beats down on the faux-skyscraper ruins of Ground Beta. Dust still hangs in the air from Bakugo's test run five minutes ago, the smell of burnt ozone and sulfur sharp in your nostrils.

Leaning against the observation rail with his capture weapon looped casually around his neck, **Shota Aizawa** fixes bloodshot, half-lidded eyes directly on you. Behind him, the monitors flicker with live telemetry from Recovery Girl's medical feed and the Support Course's sensors.

**[Aizawa]**: "Jin. Step up to the launch gate. With the Sports Festival two weeks out, the other classes are sharpening their fangs. After what happened at the USJ, the principal and the Safety Commission have had their eyes on your registration file."

He reaches into his dark jumpsuit and clicks a remote detonator. Across the street canyon, three heavy steel blast-doors grind open.

*Whirrrrr-CLANK.*

Stepping out from the smoke are two heavily armored Titan-class autonomous combat drones, their red optical sensors locking onto your heat signature. But more noticeably—standing between them on an elevated steel beam with arms folded across his dual-colored chest—is **Shoto Todoroki**. His mismatched grey and turquoise eyes lock onto yours with chilling intensity.

**[Todoroki]**: "Mr. Aizawa. Let me be his sparring partner today. At the USJ, I saw how your vectors dismantled that villain squad. I want to see if your redirection works against absolute zero."

Frost begins creeping down the steel girder beneath Todoroki's boots, freezing the air with a crisp, terrifying hum. The Class 1-A observation deck goes dead silent. From the side benches, you can hear **Bakugo** scoff with a crackle of sparks in his palm: *"Hah! Don't hold back, Half-and-Half! Flatten that freak!"*

The timer on the central screen flashes: **READY — 03... 02... 01... GO!**

What will you do?`,
      timestamp: Date.now() - 60000,
      suggestions: [
        'Engage Todoroki directly: activate Vector Deflection to slide across the freezing floor',
        'Target the Titan combat drones first to use their heavy chassis as kinetic projectiles',
        'Analyze Todoroki\'s stance and speak: probe his motives about the USJ incident',
      ],
    },
  ],
  narrativeStyle: 'cinematic shonen',
  createdAt: Date.now() - 120000,
  updatedAt: Date.now(),
};

export const NARUTO_PRESET_SESSION: RoleplaySession = {
  id: 'naruto-starter-session',
  title: 'Naruto Shippuden: Chains of the Void',
  universe: 'Naruto Shippuden',
  universeType: 'naruto',
  timelineAnchor: 'Pre-Five Kage Summit — Akatsuki Hunting & Hidden Leaf Rebuilding',
  canonLore: `Setting: The Shinobi World of the Five Great Nations (Fire, Wind, Water, Earth, Lightning). Ninjutsu, Taijutsu, Genjutsu powered by Chakra molded from physical and spiritual energy.
Village: Konohagakure (Hidden Leaf). Tsunade serves as the Fifth Hokage. Naruto Uzumaki has mastered Sage Mode after the cataclysmic battle against Pain. Sasuke Uchiha leads the rogue group Taka under the influence of the Akatsuki.
The Threat: The Akatsuki, commanded by the masked shinobi calling himself "Madara Uchiha" (Tobi), collecting the Nine Tailed Beasts for the Tsuki no Me (Eye of the Moon) plan.
Power Mechanics: Nature Transformations (Fire, Wind, Lightning, Earth, Water, Yin, Yang) and Kekkei Genkai. Ancient Fuinjutsu (sealing jutsu) can suppress even Tailed Beasts.`,
  fanficDivergences: [
    {
      id: 'div-naruto-1',
      title: 'Uzumaki Void Fuinjutsu Heirs',
      category: 'Quirk / Power Mutation',
      description:
        'The player character is a survivor of the scattered Uzumaki clan who discovered the lost "Void Sealing" scrolls of Uzushio. Unlike standard chakra chains, their Adamantine Chains can anchor space-time and disrupt dimensional rifts.',
      priority: 'Extreme / AU Overwrite',
      active: true,
      tags: ['Uzumaki Lore', 'Fuinjutsu', 'Space-Time'],
    },
    {
      id: 'div-naruto-2',
      title: 'Itachi\'s Crow Contingency',
      category: 'Secret Organization',
      description:
        'Before the fateful confrontation between Sasuke and Itachi, Itachi transmitted a cryptic raven seal containing classified intel on "Madara\'s" Kamui intangibility mechanism to the player.',
      priority: 'High',
      active: true,
      tags: ['Itachi', 'Akatsuki Intel', 'Kamui'],
    },
    {
      id: 'div-naruto-3',
      title: 'Danzo\'s Shadow Warrant',
      category: 'Timeline Shift',
      description:
        'Danzo Shimura and Root placed an assassination bounty on the player, fearing that a true Uzumaki sealing prodigy could seize control of the Nine Tails or break Danzo\'s Kotoamatsukami eye.',
      priority: 'High',
      active: true,
      tags: ['Root', 'Danzo', 'Political Intrigue'],
    },
  ],
  character: {
    name: 'Ren Uzumaki',
    alias: 'The Crimson Anchor',
    power: 'Adamantine Void Chains & Space-Time Fuinjutsu',
    powerDetails:
      'Can manifest glowing amethyst-tinted chakra chains from the spine that bind chakra flow, solidify spatial gaps, and absorb jutsu kinetic force into sealing talismans. Heavy strain burns through massive chakra reserves.',
    backstory:
      'Smuggled out of the ruins of Uzushio as a toddler, Ren lived in the borderlands between the Rain and Fire countries, unlocking the bloodline through sheer life-or-death survival.',
    appearance:
      'Fiery crimson red hair tied back with a worn black forehead protector, sharp storm-grey eyes, dark tactical flak jacket over a high-collared shinobi tunic lined with sealing formulas.',
    stats: {
      power: 80,
      agility: 85,
      intellect: 90,
      willpower: 88,
      mastery: 84,
    },
    health: 100,
    stamina: 100,
    resolve: 90,
    signatureMoves: [
      {
        name: 'Adamantine Binding: Tetra-Lock',
        type: 'Fuinjutsu / Sealing',
        description: 'Erupts four diamond-hard chains to pin the enemy\'s chakra meridian points to the earth.',
      },
      {
        name: 'Void Severance: Space Ripple',
        type: 'Space-Time Attack',
        description: 'Snaps a chain through the air, creating a micro-vacuum rupture that shatters defensive barriers.',
      },
      {
        name: 'Crimson Barrier: Uzushio Domain',
        type: 'Ultimate Defense',
        description: 'Weaves a dome of intertwined glowing sealing chains impenetrable to S-rank elemental jutsu.',
      },
    ],
  },
  messages: [
    {
      id: 'msg-naruto-intro',
      sender: 'model',
      speakerName: 'LoreMaster GM',
      text: `**Deep Forest Perimeter — Border of Fire and Frost Country**

Cold mountain rain patters relentlessly against the canopy of giant redwood trees. The scent of damp pine and wet iron hangs thick in the twilight.

You crouch on a thick cedar branch. In your left palm, the raven feather talisman left by **Itachi Uchiha** suddenly burns with a faint violet hum—the chakra signature of an uninvited predator.

*Swoosh.*

Through the veil of mist thirty yards ahead, two figures in high-collared black cloaks adorned with crimson clouds materialize silently atop the mist-shrouded river stones.

One wears an orange spiral mask with a single eyehole revealing the crimson spin of a Sharingan: **Tobi (Masked Madara)**. Beside him, emerging partially from the trunk of an ancient oak, is the grotesque bicolored scout **Zetsu**.

**[Tobi]**: *(Voice shifting from his playful high pitch into a deep, chilling baritone)* "...Well, well. If it isn't the ghost of Uzushio. Danzo couldn't silence you, and Pain was too preoccupied with the Nine-Tails to retrieve our missing scroll. Hand over the raven seal, Ren Uzumaki. Or your chains will rust inside my dimension."

A sudden gust of wind whips through the forest, fluttering the hem of your flak jacket. The seal formulas tattooed across your forearms ignite in reaction to the ominous spatial distortion pooling around the masked man's eye.

Your heart pounds. To your flank, three hidden Root ANBU masks glint through the upper branches—Danzo's assassins, waiting like vultures to strike whoever falters first.

What is your move?`,
      timestamp: Date.now() - 60000,
      suggestions: [
        'Erupt the Adamantine Void Chains instantly to anchor the space around Tobi to counter Kamui',
        'Leap back and throw an explosive sealing tag to smoke out the lurking Root ANBU',
        'Confront Tobi verbally: mention the true contents of Itachi\'s secret raven scroll',
      ],
    },
  ],
  narrativeStyle: 'gritty dark shonen',
  createdAt: Date.now() - 120000,
  updatedAt: Date.now(),
};

export const JJK_PRESET_SESSION: RoleplaySession = {
  id: 'jjk-starter-session',
  title: 'Jujutsu Kaisen: Spatial Rupture Inversion',
  universe: 'Jujutsu Kaisen',
  universeType: 'jjk',
  timelineAnchor: 'Pre-Shibuya Incident — Tokyo Metropolitan Curse Technical College',
  canonLore: `Setting: Modern Tokyo, Japan. Negative human emotions bleed into the environment, coalescing into monstrous Cursed Spirits. Jujutsu Sorcerers manipulate their own Cursed Energy to exorcise these curses using innate and inherited Cursed Techniques.
Sorcerers: Satoru Gojo (Limitless & Six Eyes, the strongest sorcerer), Suguru Geto/Kenjaku (Curse Manipulation), Kento Nanami (Ratio Technique), Megumi Fushiguro (Ten Shadows), Yuji Itadori (Vessel of Sukuna), Nobara Kugisaki (Straw Doll).
Power Mechanics: Cursed Energy flows like electricity; techniques are the appliances. Advanced concepts include Black Flash (spatial distortion power amplification), Simple Domain, Falling Blossom Emotion, and Domain Expansion (the pinnacle of barrier jutsu, creating an unavoidable hit zone).`,
  fanficDivergences: [
    {
      id: 'div-jjk-1',
      title: 'Inverted Space-Fracture Technique',
      category: 'Quirk / Power Mutation',
      description:
        'The player commands an uncatalogued innate technique: "Spatial Rupture". By infusing cursed energy into coordinate intersections, they can fold atmospheric space to deflect cursed strikes or rupture cursed spirits from the inside out.',
      priority: 'Extreme / AU Overwrite',
      active: true,
      tags: ['Cursed Technique', 'Space Distortion', 'Special Grade'],
    },
    {
      id: 'div-jjk-2',
      title: 'Gojo\'s Confidential Apprentice',
      category: 'Timeline Shift',
      description:
        'Satoru Gojo recruited you off-the-books before Jujutsu High higher-ups could classify you for immediate execution as an unregistered Special Grade anomaly.',
      priority: 'High',
      active: true,
      tags: ['Gojo', 'Higher-Ups', 'Special Grade'],
    },
    {
      id: 'div-jjk-3',
      title: 'Kenjaku\'s Shadow Stalker',
      category: 'Secret Organization',
      description:
        'Curse user conspirators orchestrated by the brain-swapping sorcerer have placed tracking seals across your district, sensing your spatial manipulation could interfere with the upcoming Shibuya prison realm barrier.',
      priority: 'High',
      active: true,
      tags: ['Kenjaku', 'Shibuya', 'Intrigue'],
    },
  ],
  character: {
    name: 'Kaito Kurogane',
    alias: 'The Rift Walker',
    power: 'Innate Technique: Spatial Rupture & Zero-Point Inversion',
    powerDetails:
      'Pinches the fabric of three-dimensional space with cursed energy. Can compress distance (instant displacement), shear cursed reinforcements, or establish localized null-gravity vortexes. Intense brain strain requires precise cursed energy refinement.',
    backstory:
      'Awakened during a catastrophic curse incident in Shinjuku where a Special Grade spirit attempted to consume his family. Surviving purely on instinctual space-folding, he was intercepted by Gojo before the Zenin clan could claim him.',
    appearance:
      'Dark high-collared Jujutsu High uniform with silver button accents, loose obsidian hair, piercing violet-flecked eyes, hands wrapped in inscribed barrier-control bandages.',
    stats: {
      power: 82,
      agility: 88,
      intellect: 85,
      willpower: 86,
      mastery: 80,
    },
    health: 100,
    stamina: 100,
    resolve: 90,
    signatureMoves: [
      {
        name: 'Spatial Rupture: Shear Cleave',
        type: 'Offensive Technique',
        description: 'Snaps fingers along a linear plane, slicing through cursed spirits regardless of outer armor.',
      },
      {
        name: 'Zero-Point Shift: Phase Slip',
        type: 'Mobility / Evasion',
        description: 'Compresses spatial distance between self and target to teleport instantaneously.',
      },
      {
        name: 'Domain Expansion: Infinite Fracture Vault',
        type: 'Ultimate Domain',
        description: 'Manifests a mirrored tessellated void where all spatial coordinates are under total absolute command.',
      },
    ],
  },
  messages: [
    {
      id: 'msg-jjk-intro',
      sender: 'model',
      speakerName: 'LoreMaster GM',
      text: `**Tokyo Jujutsu High — Training Yard No. 4 (Midnight)**

A crisp autumn breeze rustles the bamboo groves lining the shrine stone paths. The sky above Tokyo is bruised violet, the faint hum of city traffic miles away swallowed by the barrier shrouding Jujutsu High.

Sitting casually atop a stone lantern with his long legs dangling and his trademark blindfold pushed slightly up to reveal one sparkling sky-blue eye is **Satoru Gojo**. He tosses half a strawberry daifuku into his mouth, smiling with reckless amusement.

**[Gojo]**: "Yo, Kaito! You're five minutes late. If you keep moving that slow, the higher-ups are gonna assign some boring old geezer from Kyoto to watch your every move."

He hops down lightly, hands buried in his dark uniform pockets. Thirty paces behind him on the gravel grounds, **Megumi Fushiguro** stands with his shadow puppets ready, his Divine Dog pacing restlessly with hackles raised.

**[Gojo]**: "I set up a special barrier exercise tonight. The cursed energy traces we pulled from the subway tunnels yesterday match Kenjaku's conspirators. Megumi's shadows are going to test your reaction time, and if you can't snap your Spatial Rupture before he flanks you, well... no sweets for a week!"

Megumi weaves his fingers into a shadow posture: *"Don't hold back, Kaito. Gojo's right—something massive is brewing in Shibuya."*

From the ground beneath Megumi's boots, twin Nue shadows crackle with orange electricity, ready to pounce.

The training field tension snaps taut. What is your move?`,
      timestamp: Date.now() - 60000,
      suggestions: [
        'Activate Spatial Rupture to shear the ground between you and Megumi, disrupting the shadow summon',
        'Use Zero-Point Shift to instantly teleport behind Gojo and challenge his Infinity barrier instead',
        'Speak to Megumi and Gojo about the sinister cursed energy residue detected in the subway',
      ],
    },
  ],
  narrativeStyle: 'cinematic shonen',
  createdAt: Date.now() - 120000,
  updatedAt: Date.now(),
};

export const INITIAL_PRESETS: RoleplaySession[] = [
  MHA_PRESET_SESSION,
  NARUTO_PRESET_SESSION,
  JJK_PRESET_SESSION,
];
