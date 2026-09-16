// Default seed data, transcribed from Joe's paper character sheet.
// Everything here is editable in the app itself -- if something below
// doesn't match the paper sheet, just click it and fix it.

// Bump this whenever the sheet gains something a browser's already-saved copy
// should pick up too (a level-up, a corrected proficiency), and add a matching
// entry to MIGRATIONS at the bottom of this file. Without that, edits here only
// show up for someone loading the sheet for the very first time, or for anyone
// who hits "Reset to paper sheet" and throws away their own changes.
const SHEET_VERSION = 2;

// Shared so the seed data and the level-up migration can't drift apart.
const RANGER_1_FEATURES = [
  {
    name: "Favored Foe",
    source: "Ranger 1",
    uses: { max: 2, expended: 0 },
    notes:
      "Optional class feature — replaces Favored Enemy (no benefit from the replaced feature, " +
      "and it doesn't qualify for anything requiring it).\n\n" +
      "When you hit a creature with an attack roll, you can mark it as your favored enemy for " +
      "1 minute or until you lose concentration (as if concentrating on a spell). The first time " +
      "on each of your turns that you hit that creature and deal damage — including the hit that " +
      "marks it — the damage increases by 1d4.\n\n" +
      "Uses equal your proficiency bonus (currently 2); all expended uses return on a long rest. " +
      "The bonus die grows to 1d6 at Ranger 6 and 1d8 at Ranger 14.",
  },
  {
    name: "Deft Explorer",
    source: "Ranger 1",
    notes:
      "Optional class feature — replaces Natural Explorer (no benefit from the replaced feature, " +
      "and it doesn't qualify for anything requiring it).\n\n" +
      "Canny (1st level): your proficiency bonus is doubled for any ability check using one chosen " +
      "skill proficiency — Investigation. That is the same math as expertise, so Investigation shows " +
      "a double-ringed dot in the Skills list (+5 right now: Int +1 and twice the +2 bonus).\n\n" +
      "You also speak, read, and write two additional languages: Elvish and Dwarvish.\n\n" +
      "Further benefits arrive at Ranger 6 (Roving) and Ranger 10 (Tireless).",
  },
];

const DEFAULT_CHARACTER = {
  version: SHEET_VERSION,
  meta: {
    name: "Joe",
    player: "Evan",
    race: "Human",
    background: "Haunted One",
    alignment: "Neutral Good",
    xp: "",
    age: "30",
  },
  classes: [
    { name: "Artificer", level: 1 },
    { name: "Rogue", level: 1 },
    { name: "Fighter", level: 1 },
    { name: "Ranger", level: 1 },
  ],
  proficiencyBonus: 2,
  inspiration: 0,
  abilities: {
    str: 14,
    dex: 12,
    con: 15,
    int: 12,
    wis: 14,
    cha: 13,
  },
  savingThrows: {
    // proficient = true adds proficiency bonus on top of the ability mod
    str: false,
    dex: false,
    con: true,
    int: true,
    wis: false,
    cha: false,
  },
  skills: {
    acrobatics: { ability: "dex", prof: 0 },
    animalHandling: { ability: "wis", prof: 0 },
    arcana: { ability: "int", prof: 0 },
    athletics: { ability: "str", prof: 0 },
    deception: { ability: "cha", prof: 0 },
    history: { ability: "int", prof: 0 },
    insight: { ability: "wis", prof: 0 },
    intimidation: { ability: "cha", prof: 0 },
    investigation: { ability: "int", prof: 2 }, // proficient, doubled by Deft Explorer's Canny
    medicine: { ability: "wis", prof: 0 },
    nature: { ability: "int", prof: 0 },
    perception: { ability: "wis", prof: 0 },
    performance: { ability: "cha", prof: 0 },
    persuasion: { ability: "cha", prof: 0 },
    religion: { ability: "int", prof: 0 },
    sleightOfHand: { ability: "dex", prof: 1 },
    stealth: { ability: "dex", prof: 2 }, // 2 = expertise (rogue)
    survival: { ability: "wis", prof: 0 },
  },
  combat: {
    armorClass: 12,
    initiative: 1,
    speed: 30,
    hpMax: null,
    hpCurrent: null,
    hpTemp: 0,
    hitDice: [
      { die: "1d10", class: "Fighter", used: 0 },
      { die: "1d10", class: "Ranger", used: 0 },
      { die: "1d8", class: "Rogue", used: 0 },
      { die: "1d8", class: "Artificer", used: 0 },
    ],
    deathSaves: { successes: 0, failures: 0 },
  },
  attacks: [
    { name: "Short Sword A", atkBonus: "+5", damage: "1d6+2 slashing", notes: "" },
    { name: "Short Sword B", atkBonus: "+5", damage: "1d6+2 slashing", notes: "two-weapon fighting off-hand" },
    { name: "Scythe (reflavored)", atkBonus: "+5", damage: "2d4+2 slashing", notes: "" },
    { name: "Wrench (club)", atkBonus: "+4", damage: "1d4+2 bludgeoning", notes: "" },
    { name: "Long Dagger", atkBonus: "+3", damage: "1d4+1 piercing", notes: "" },
  ],
  spellcasting: {
    ability: "int",
    class: "Artificer",
    cantrips: ["Guidance", "Mending"],
    slots: {
      1: { total: 2, expended: 0 },
    },
    spells: [
      { name: "Cure Wounds", level: 1, prepared: true, notes: "1d8+3 healing" },
      { name: "Purify Food and Drink", level: 1, prepared: true, notes: "" },
      { name: "Divine Smite", level: 1, prepared: true, notes: "Planned once Paladin levels are taken — not usable yet" },
      { name: "Heroism", level: 1, prepared: false, notes: "" },
    ],
  },
  currency: { cp: 2, sp: 58, gp: 7, pp: 0 },
  otherMoney: "12.62 gold (loose/misc)",
  equipmentWorn: [
    "Common working clothes",
    "Leather armor",
    "Shield",
  ],
  inventory: [
    { name: "5x Rations", qty: 1, notes: "" },
    { name: "Artisan's Tools", qty: 1, notes: "" },
    { name: "Thieves' Tools", qty: 1, notes: "" },
    { name: "Leather Armor (extra)", qty: 1, notes: "" },
    { name: "Sack of iron ore", qty: "30x", notes: "1 sack" },
    { name: "Iron ingot", qty: 6, notes: "" },
    { name: "Sack of Shadow Quartz dust", qty: "30 lbs", notes: "1 sack" },
    { name: "Shadow Quartz crystals", qty: 2, notes: "" },
    { name: "Empty sacks", qty: 4, notes: "" },
    { name: "Magic Ring", qty: 1, notes: "(E) — needs identifying/details" },
    { name: "Short Sword A", qty: 1, notes: "" },
    { name: "Short Sword B", qty: 1, notes: "" },
    { name: "Wrench (club)", qty: 1, notes: "" },
    { name: "Scythe", qty: 1, notes: "(E)" },
    { name: "Shield", qty: 1, notes: "" },
    { name: "Short Dagger", qty: 1, notes: "" },
    { name: "Long Dagger", qty: 1, notes: "" },
    { name: "Pickaxe", qty: 1, notes: "" },
  ],
  proficiencies: {
    armor: ["All Armor", "All Shields"],
    weapons: ["Simple Weapons", "Martial Weapons", "Firearms"],
    tools: ["Artisan's Tools", "Thieves' Tools"],
    languages: ["Common", "Elvish", "Dwarvish"],
  },
  features: [
    {
      name: "Divine Sense",
      source: "Paladin (planned)",
      notes: "Detect celestials/fiends/undead within 60 ft. Not active until Paladin levels are taken.",
    },
    {
      name: "Lay on Hands",
      source: "Paladin (planned)",
      notes: "Healing pool. Not active until Paladin levels are taken.",
    },
    {
      name: "Sacred Weapon",
      source: "Oath of Devotion (planned)",
      notes: "Channel Divinity. Not active until Paladin levels are taken.",
    },
    {
      name: "Second Wind",
      source: "Fighter 1",
      notes: "Bonus action, regain 1d10 + fighter level HP. Recharges on short/long rest.",
    },
    {
      name: "Sneak Attack",
      source: "Rogue 1",
      notes: "1d6 extra damage once per turn on an attack with advantage, or when another enemy is within 5 ft of the target.",
    },
    {
      name: "Thieves' Cant",
      source: "Rogue 1",
      notes: "Secret rogue code/dialect for hiding messages in normal conversation.",
    },
    {
      name: "Magical Tinkering",
      source: "Artificer 1",
      notes: "Imbue a tiny object with a minor magical effect.",
    },
    ...RANGER_1_FEATURES,
  ],
  personality: {
    traits: "",
    ideals: "",
    bonds: "",
    flaws: "",
  },
  backstoryNotes: "",
};

// Deep clone helper so we never mutate the default template in place.
function getDefaultCharacter() {
  return JSON.parse(JSON.stringify(DEFAULT_CHARACTER));
}

/* ---------------- Saved-sheet upgrades ---------------- */

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function sameText(a, b) {
  return String(a == null ? "" : a).trim().toLowerCase() === String(b).trim().toLowerCase();
}

function hasNamedEntry(list, name) {
  return Array.isArray(list) && list.some((entry) => sameText(entry && entry.name, name));
}

// Each migration brings a saved sheet up to `version`. They run in order, only
// the ones newer than the sheet's own version, and each one has to be safe to
// run against a sheet someone has already been editing by hand -- hence all the
// "only if it isn't there already" checks.
const MIGRATIONS = [
  {
    version: 2,
    label: "Ranger 1: Favored Foe, Deft Explorer, skill fixes",
    apply(sheet) {
      // Skill fixes: Sleight of Hand and Investigation should have been
      // proficient all along. Canny (Deft Explorer) then doubles the
      // proficiency bonus for Investigation, which is expertise's math.
      if (sheet.skills) {
        if (sheet.skills.sleightOfHand && !sheet.skills.sleightOfHand.prof) {
          sheet.skills.sleightOfHand.prof = 1;
        }
        if (sheet.skills.investigation) {
          sheet.skills.investigation.prof = 2;
        }
      }

      if (Array.isArray(sheet.classes) && !hasNamedEntry(sheet.classes, "Ranger")) {
        sheet.classes.push({ name: "Ranger", level: 1 });
      }

      const hitDice = sheet.combat && sheet.combat.hitDice;
      if (Array.isArray(hitDice) && !hitDice.some((hd) => sameText(hd && hd.class, "Ranger"))) {
        hitDice.push({ die: "1d10", class: "Ranger", used: 0 });
      }

      const languages = sheet.proficiencies && sheet.proficiencies.languages;
      if (Array.isArray(languages)) {
        ["Elvish", "Dwarvish"].forEach((language) => {
          if (!languages.some((known) => sameText(known, language))) languages.push(language);
        });
      }

      if (Array.isArray(sheet.features)) {
        RANGER_1_FEATURES.forEach((feature) => {
          if (!hasNamedEntry(sheet.features, feature.name)) sheet.features.push(cloneValue(feature));
        });
      }
    },
  },
];

// Returns the upgraded sheet plus whether anything actually changed, so the
// caller can write it straight back to localStorage.
function migrateCharacter(sheet) {
  if (!sheet || typeof sheet !== "object") return { sheet: getDefaultCharacter(), changed: true };
  const from = Number(sheet.version) || 1;
  let changed = false;
  MIGRATIONS.forEach((migration) => {
    if (migration.version <= from) return;
    migration.apply(sheet);
    changed = true;
  });
  if (sheet.version !== SHEET_VERSION) {
    sheet.version = SHEET_VERSION;
    changed = true;
  }
  return { sheet, changed };
}
