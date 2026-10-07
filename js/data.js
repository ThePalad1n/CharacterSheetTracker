// Default seed data, transcribed from Joe's paper character sheet.
// Everything here is editable in the app itself -- if something below
// doesn't match the paper sheet, just click it and fix it.

// Bump this whenever the sheet gains something a browser's already-saved copy
// should pick up too (a level-up, a corrected proficiency), and add a matching
// entry to MIGRATIONS at the bottom of this file. Without that, edits here only
// show up for someone loading the sheet for the very first time, or for anyone
// who hits "Reset to paper sheet" and throws away their own changes.
const SHEET_VERSION = 4;

// Hit point maximum at character level 5 (Artificer 1 / Rogue 1 / Fighter 1 /
// Ranger 1 / Paladin 1): 38 rolled through Ranger 1, plus the Paladin d10's
// fixed average of 6 and +2 Con.
const HP_MAX = 46;

// Character level 5 moves the proficiency bonus from +2 to +3.
const PROFICIENCY_BONUS = 3;

// Shared so the seed data and the level-up migration can't drift apart.
const RANGER_1_FEATURES = [
  {
    name: "Favored Foe",
    source: "Ranger 1",
    uses: { max: PROFICIENCY_BONUS, expended: 0 },
    notes:
      "Optional class feature — replaces Favored Enemy (no benefit from the replaced feature, " +
      "and it doesn't qualify for anything requiring it).\n\n" +
      "When you hit a creature with an attack roll, you can mark it as your favored enemy for " +
      "1 minute or until you lose concentration (as if concentrating on a spell). The first time " +
      "on each of your turns that you hit that creature and deal damage — including the hit that " +
      "marks it — the damage increases by 1d4.\n\n" +
      "Uses equal your proficiency bonus (currently 3); all expended uses return on a long rest. " +
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
      "a double-ringed dot in the Skills list (+7 right now: Int +1 and twice the +3 bonus).\n\n" +
      "You also speak, read, and write two additional languages: Elvish and Dwarvish.\n\n" +
      "Further benefits arrive at Ranger 6 (Roving) and Ranger 10 (Tireless).",
  },
];

const PALADIN_1_FEATURES = [
  {
    name: "Divine Sense",
    source: "Paladin 1",
    uses: { max: 2, expended: 0 },
    notes:
      "Action: until the end of your next turn, you know the location of any celestial, fiend, or " +
      "undead within 60 feet that isn't behind total cover, and its type (but not its identity). " +
      "You also sense any place or object within 60 feet that has been consecrated or desecrated.\n\n" +
      "Uses equal 1 + your Charisma modifier (currently 2); all expended uses return on a long rest.",
  },
  {
    name: "Lay on Hands",
    source: "Paladin 1",
    uses: { max: 5, expended: 0 },
    notes:
      "A pool of healing equal to 5 × your Paladin level (currently 5 hit points), refilled on a " +
      "long rest. The counter above tracks hit points spent from the pool.\n\n" +
      "Action: touch a creature and restore any number of hit points from the pool. Or spend 5 " +
      "points to cure it of one disease or neutralize one poison (several at once cost 5 each). " +
      "No effect on undead or constructs.",
  },
];

// Attack bonuses as they were at proficiency +2, keyed by attack name. The
// level 5 migration only bumps an attack that still carries this value, so a
// bonus somebody corrected by hand is left alone.
const ATTACK_BONUSES_BEFORE_LEVEL_5 = {
  "Short Sword A": "+5",
  "Short Sword B": "+5",
  "Scythe (reflavored)": "+5",
  "Wrench (club)": "+4",
  "Long Dagger": "+3",
};

const DIVINE_SMITE_NOTES_BEFORE_LEVEL_5 = "Planned once Paladin levels are taken — not usable yet";
const DIVINE_SMITE_NOTES = "Planned — Divine Smite arrives at Paladin 2, not usable yet";
const SACRED_WEAPON_NOTES_BEFORE_LEVEL_5 = "Channel Divinity. Not active until Paladin levels are taken.";
const SACRED_WEAPON_NOTES = "Channel Divinity. Not active until Paladin 3, when the Oath of Devotion is sworn.";

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
    { name: "Paladin", level: 1 },
  ],
  proficiencyBonus: PROFICIENCY_BONUS,
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
    athletics: { ability: "str", prof: 1 }, // skill from the Ranger multiclass list
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
    hpMax: HP_MAX,
    hpCurrent: HP_MAX,
    hpTemp: 0,
    hitDice: [
      { die: "1d10", class: "Fighter", used: 0 },
      { die: "1d10", class: "Ranger", used: 0 },
      { die: "1d8", class: "Rogue", used: 0 },
      { die: "1d8", class: "Artificer", used: 0 },
      { die: "1d10", class: "Paladin", used: 0 },
    ],
    deathSaves: { successes: 0, failures: 0 },
  },
  attacks: [
    { name: "Short Sword A", atkBonus: "+6", damage: "1d6+2 slashing", notes: "" },
    { name: "Short Sword B", atkBonus: "+6", damage: "1d6+2 slashing", notes: "two-weapon fighting off-hand" },
    { name: "Scythe (reflavored)", atkBonus: "+6", damage: "2d4+2 slashing", notes: "" },
    { name: "Wrench (club)", atkBonus: "+5", damage: "1d4+2 bludgeoning", notes: "" },
    { name: "Long Dagger", atkBonus: "+4", damage: "1d4+1 piercing", notes: "" },
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
      { name: "Divine Smite", level: 1, prepared: true, notes: DIVINE_SMITE_NOTES },
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
    ...PALADIN_1_FEATURES,
    {
      name: "Sacred Weapon",
      source: "Oath of Devotion (planned)",
      notes: SACRED_WEAPON_NOTES,
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

function numberOrNull(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
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
  {
    version: 3,
    label: "Ranger 1 follow-ups: Athletics proficiency, rolled hit points",
    apply(sheet) {
      // Athletics is the one skill the Ranger multiclass grants.
      if (sheet.skills && sheet.skills.athletics && !sheet.skills.athletics.prof) {
        sheet.skills.athletics.prof = 1;
      }

      // Current HP moves with the maximum the way it does at a level-up, so a
      // sheet that was sitting on damage stays that far down.
      if (sheet.combat) {
        const previousMax = numberOrNull(sheet.combat.hpMax);
        const current = numberOrNull(sheet.combat.hpCurrent);
        sheet.combat.hpMax = 38;
        sheet.combat.hpCurrent =
          previousMax != null && current != null ? current + (38 - previousMax) : 38;
      }
    },
  },
  {
    version: 4,
    label: "Paladin 1: Divine Sense, Lay on Hands, proficiency +3",
    apply(sheet) {
      if (Array.isArray(sheet.classes) && !hasNamedEntry(sheet.classes, "Paladin")) {
        sheet.classes.push({ name: "Paladin", level: 1 });
      }

      const hitDice = sheet.combat && sheet.combat.hitDice;
      if (Array.isArray(hitDice) && !hitDice.some((hd) => sameText(hd && hd.class, "Paladin"))) {
        hitDice.push({ die: "1d10", class: "Paladin", used: 0 });
      }

      // Character level 5. Everything computed from the bonus (saves, skills,
      // passive Perception) follows on its own; the stored attack bonuses don't.
      if ((numberOrNull(sheet.proficiencyBonus) || 0) < PROFICIENCY_BONUS) {
        sheet.proficiencyBonus = PROFICIENCY_BONUS;
        if (Array.isArray(sheet.attacks)) {
          sheet.attacks.forEach((attack) => {
            const before = attack && ATTACK_BONUSES_BEFORE_LEVEL_5[attack.name];
            const bonus = before != null && String(attack.atkBonus).trim() === before ? numberOrNull(before) : null;
            if (bonus != null) attack.atkBonus = `+${bonus + 1}`;
          });
        }
      }

      if (Array.isArray(sheet.features)) {
        // Favored Foe's uses track the proficiency bonus.
        sheet.features.forEach((feature) => {
          if (!feature) return;
          if (sameText(feature.name, "Favored Foe") && feature.uses && Number(feature.uses.max) === 2) {
            feature.uses.max = PROFICIENCY_BONUS;
          }
          if (typeof feature.notes === "string") {
            feature.notes = feature.notes
              .replace("(currently 2); all", "(currently 3); all")
              .replace("(+5 right now: Int +1 and twice the +2 bonus)", "(+7 right now: Int +1 and twice the +3 bonus)");
          }
          if (sameText(feature.name, "Sacred Weapon") && feature.notes === SACRED_WEAPON_NOTES_BEFORE_LEVEL_5) {
            feature.notes = SACRED_WEAPON_NOTES;
          }
        });

        // The planned Paladin placeholders become the real features; anything
        // already edited away from "planned" is kept as it is.
        PALADIN_1_FEATURES.forEach((feature) => {
          const index = sheet.features.findIndex((entry) => sameText(entry && entry.name, feature.name));
          if (index === -1) {
            sheet.features.push(cloneValue(feature));
          } else if (sameText(sheet.features[index].source, "Paladin (planned)")) {
            sheet.features[index] = cloneValue(feature);
          }
        });
      }

      const spells = sheet.spellcasting && sheet.spellcasting.spells;
      if (Array.isArray(spells)) {
        spells.forEach((spell) => {
          if (spell && sameText(spell.name, "Divine Smite") && spell.notes === DIVINE_SMITE_NOTES_BEFORE_LEVEL_5) {
            spell.notes = DIVINE_SMITE_NOTES;
          }
        });
      }

      if (sheet.combat) {
        const previousMax = numberOrNull(sheet.combat.hpMax);
        const current = numberOrNull(sheet.combat.hpCurrent);
        sheet.combat.hpMax = HP_MAX;
        sheet.combat.hpCurrent =
          previousMax != null && current != null ? current + (HP_MAX - previousMax) : HP_MAX;
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
