"use strict";

const STORAGE_KEY = "dnd-character-sheet:joe";

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load saved sheet, using default.", e);
  }
  return getDefaultCharacter();
}

let saveTimer = null;
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const ind = document.getElementById("saveIndicator");
  ind.textContent = "Saved " + new Date().toLocaleTimeString();
  ind.classList.add("show");
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => ind.classList.remove("show"), 1500);
}

function getPath(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}
function setPath(obj, path, value) {
  const keys = path.split(".");
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (cur[keys[i]] == null) cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
}

function abilityMod(score) {
  if (score == null || score === "") return 0;
  return Math.floor((Number(score) - 10) / 2);
}
function fmtMod(n) {
  return (n >= 0 ? "+" : "") + n;
}
function esc(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const ABILITY_LABELS = { str: "Strength", dex: "Dexterity", con: "Constitution", int: "Intelligence", wis: "Wisdom", cha: "Charisma" };
const SKILL_LABELS = {
  acrobatics: "Acrobatics", animalHandling: "Animal Handling", arcana: "Arcana", athletics: "Athletics",
  deception: "Deception", history: "History", insight: "Insight", intimidation: "Intimidation",
  investigation: "Investigation", medicine: "Medicine", nature: "Nature", perception: "Perception",
  performance: "Performance", persuasion: "Persuasion", religion: "Religion", sleightOfHand: "Sleight of Hand",
  stealth: "Stealth", survival: "Survival",
};

/* ---------------- Panel renderers ---------------- */

function renderOverview() {
  const a = state.abilities;
  const abilityBlocks = Object.keys(ABILITY_LABELS).map((key) => {
    const score = a[key];
    const mod = abilityMod(score);
    const saveProf = !!state.savingThrows[key];
    const saveMod = mod + (saveProf ? state.proficiencyBonus : 0);
    const relatedSkills = Object.keys(SKILL_LABELS).filter((sk) => state.skills[sk].ability === key);
    const skillsDetail = relatedSkills.map((sk) => {
      const skState = state.skills[sk];
      const skMod = abilityMod(a[key]) + skState.prof * state.proficiencyBonus;
      const dotClass = skState.prof === 2 ? "filled expertise" : skState.prof === 1 ? "filled" : "";
      return `<label><span><span class="prof-dot ${dotClass}" data-action="cycle-skill" data-key="${sk}" title="Click to cycle: none / proficient / expertise"></span> ${SKILL_LABELS[sk]}</span><span data-computed="skill-mod" data-computed-key="${sk}">${fmtMod(skMod)}</span></label>`;
    }).join("");
    const isOpen = openAbilities.has(key);
    return `
    <div class="ability-block ${isOpen ? "expanded" : ""}" data-ability="${key}">
      <div class="ab-name">${ABILITY_LABELS[key]}</div>
      <input class="num-input ab-score" style="width:100%;font-size:1.8rem;text-align:center;background:transparent;border:none;"
        type="number" data-path="abilities.${key}" data-computed-group="abilities" value="${esc(score)}" />
      <div class="ab-mod" data-computed="ability-mod" data-computed-key="${key}">${fmtMod(mod)}</div>
      <div class="ab-detail">
        <label>
          <span><span class="prof-dot ${saveProf ? "filled" : ""}" data-action="toggle-save" data-key="${key}"></span> Saving Throw</span>
          <span data-computed="save-mod" data-computed-key="${key}">${fmtMod(saveMod)}</span>
        </label>
        ${skillsDetail}
      </div>
    </div>`;
  }).join("");

  const savesRows = Object.keys(ABILITY_LABELS).map((key) => {
    const prof = !!state.savingThrows[key];
    const mod = abilityMod(a[key]) + (prof ? state.proficiencyBonus : 0);
    return `
    <div class="list-row">
      <div class="row-left">
        <span class="prof-dot ${prof ? "filled" : ""}" data-action="toggle-save" data-key="${key}"></span>
        <span>${ABILITY_LABELS[key]}</span>
      </div>
      <span class="row-mod" data-computed="save-mod" data-computed-key="${key}">${fmtMod(mod)}</span>
    </div>`;
  }).join("");

  const skillsRows = Object.keys(SKILL_LABELS).map((key) => {
    const sk = state.skills[key];
    const mod = abilityMod(a[sk.ability]) + sk.prof * state.proficiencyBonus;
    const dotClass = sk.prof === 2 ? "filled expertise" : sk.prof === 1 ? "filled" : "";
    return `
    <div class="list-row">
      <div class="row-left">
        <span class="prof-dot ${dotClass}" data-action="cycle-skill" data-key="${key}" title="Click to cycle: none / proficient / expertise"></span>
        <span>${SKILL_LABELS[key]} <span style="color:var(--ink-soft);font-size:0.8em;">(${sk.ability})</span></span>
      </div>
      <span class="row-mod" data-computed="skill-mod" data-computed-key="${key}">${fmtMod(mod)}</span>
    </div>`;
  }).join("");

  const passivePerception = 10 + abilityMod(a.wis) + state.skills.perception.prof * state.proficiencyBonus;

  const classesRows = state.classes.map((c, i) => `
    <div class="row-wrap">
      <div class="field-row" style="flex-basis:160px;">
        <label>Class</label>
        <input data-path="classes.${i}.name" value="${esc(c.name)}" />
      </div>
      <div class="field-row" style="flex-basis:70px;flex-grow:0;">
        <label>Level</label>
        <input type="number" data-path="classes.${i}.level" data-computed-group="classes" value="${esc(c.level)}" />
      </div>
      <button class="remove-btn" data-action="remove-class" data-index="${i}">Remove</button>
    </div>
  `).join("");

  return `
    <div class="grid">
      <div class="card" style="grid-column:1/-1;">
        <h3>Identity</h3>
        <div class="two-col">
          <div class="field-row"><label>Race</label><input data-path="meta.race" value="${esc(state.meta.race)}" /></div>
          <div class="field-row"><label>Background</label><input data-path="meta.background" value="${esc(state.meta.background)}" /></div>
          <div class="field-row"><label>Alignment</label><input data-path="meta.alignment" value="${esc(state.meta.alignment)}" /></div>
          <div class="field-row"><label>Player</label><input data-path="meta.player" value="${esc(state.meta.player)}" /></div>
          <div class="field-row"><label>Age</label><input data-path="meta.age" value="${esc(state.meta.age)}" /></div>
          <div class="field-row"><label>Experience Points</label><input data-path="meta.xp" value="${esc(state.meta.xp)}" /></div>
        </div>
      </div>

      <div class="card" style="grid-column:1/-1;">
        <h3>Classes &amp; Levels</h3>
        <div class="small-note">Add a row here once the Paladin levels actually happen — it'll flow into the header automatically.</div>
        ${classesRows}
        <button class="add-btn" data-action="add-class">+ Add class</button>
      </div>
    </div>

    <div class="card" style="margin-bottom:1.25rem;">
      <h3>Ability Scores <span style="float:right;font-size:0.75em;color:var(--ink-soft);">click a score to edit</span></h3>
      <div class="abilities-grid">${abilityBlocks}</div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>Saving Throws</h3>
        <div class="list-rows">${savesRows}</div>
      </div>
      <div class="card">
        <h3>Proficiency Bonus &amp; Passive Perception</h3>
        <div class="field-row"><label>Proficiency Bonus</label><input type="number" data-path="proficiencyBonus" data-computed-group="pb" value="${esc(state.proficiencyBonus)}" /></div>
        <div class="list-row"><span>Passive Perception</span><span class="row-mod" data-computed="passive-perception">${passivePerception}</span></div>
      </div>
      <div class="card" style="grid-column:1/-1;">
        <h3>Skills</h3>
        <div class="list-rows">${skillsRows}</div>
      </div>
    </div>
  `;
}

function renderCombat() {
  const hitDiceRows = state.combat.hitDice.map((hd, i) => `
    <div class="row-wrap">
      <div class="field-row" style="flex-basis:70px;"><label>Die</label><input data-path="combat.hitDice.${i}.die" value="${esc(hd.die)}" /></div>
      <div class="field-row" style="flex-basis:100px;"><label>Class</label><input data-path="combat.hitDice.${i}.class" value="${esc(hd.class)}" /></div>
      <div class="field-row" style="flex-basis:70px;flex-grow:0;"><label>Used</label><input type="number" data-path="combat.hitDice.${i}.used" value="${esc(hd.used)}" /></div>
      <button class="remove-btn" data-action="remove-hitdie" data-index="${i}">Remove</button>
    </div>
  `).join("");

  const ds = state.combat.deathSaves;
  const dotsRow = (kind, count) => `<span style="display:inline-flex;gap:0.5rem;">` + Array.from({ length: 3 }, (_, i) => `
    <span class="prof-dot ${i < count ? "filled" : ""}" data-action="toggle-death" data-kind="${kind}" data-index="${i}"></span>
  `).join("") + `</span>`;

  const attacksHtml = renderAccordion("attacks", state.attacks, (item, i) => ({
    title: item.name || "New attack",
    sub: item.atkBonus || "",
    body: `
      <div class="field-row"><label>Name</label><input data-path="attacks.${i}.name" value="${esc(item.name)}" /></div>
      <div class="two-col">
        <div class="field-row"><label>Attack Bonus</label><input data-path="attacks.${i}.atkBonus" value="${esc(item.atkBonus)}" /></div>
        <div class="field-row"><label>Damage / Type</label><input data-path="attacks.${i}.damage" value="${esc(item.damage)}" /></div>
      </div>
      <div class="field-row"><label>Notes</label><textarea data-path="attacks.${i}.notes">${esc(item.notes)}</textarea></div>
      <button class="remove-btn" data-action="remove-attacks" data-index="${i}">Remove attack</button>
    `,
  }));

  return `
    <div class="grid">
      <div class="card">
        <h3>Hit Dice</h3>
        ${hitDiceRows}
        <button class="add-btn" data-action="add-hitdie">+ Add hit die</button>
      </div>
      <div class="card">
        <h3>Death Saves</h3>
        <div class="list-row"><span>Successes</span><span>${dotsRow("successes", ds.successes)}</span></div>
        <div class="list-row"><span>Failures</span><span>${dotsRow("failures", ds.failures)}</span></div>
        <div class="field-row" style="margin-top:0.75rem;"><label>Temp HP</label><input type="number" data-path="combat.hpTemp" value="${esc(state.combat.hpTemp)}" /></div>
      </div>
    </div>

    <div class="card">
      <h3>Attacks &amp; Weapons</h3>
      <div class="accordion">${attacksHtml}</div>
      <button class="add-btn" data-action="add-attacks">+ Add attack</button>
    </div>
  `;
}

function renderSpells() {
  const sp = state.spellcasting;
  const cantripsRows = renderStringList("spellcasting.cantrips", sp.cantrips, "cantrips");

  const slotsRows = Object.keys(sp.slots).sort((a, b) => a - b).map((lvl) => {
    const s = sp.slots[lvl];
    return `
    <div class="list-row">
      <span>Level ${lvl}</span>
      <span style="display:flex;gap:0.5rem;align-items:center;">
        <label style="font-size:0.75rem;color:var(--ink-soft);">Expended</label>
        <input type="number" style="width:3rem;" data-path="spellcasting.slots.${lvl}.expended" value="${esc(s.expended)}" />
        <span>/</span>
        <input type="number" style="width:3rem;" data-path="spellcasting.slots.${lvl}.total" value="${esc(s.total)}" />
      </span>
    </div>`;
  }).join("");

  const spellsHtml = renderAccordion("spellcasting.spells", sp.spells, (item, i) => ({
    title: item.name || "New spell",
    sub: `Lvl ${item.level}${item.prepared ? " • prepared" : ""}`,
    body: `
      <div class="two-col">
        <div class="field-row"><label>Name</label><input data-path="spellcasting.spells.${i}.name" value="${esc(item.name)}" /></div>
        <div class="field-row"><label>Level</label><input type="number" data-path="spellcasting.spells.${i}.level" value="${esc(item.level)}" /></div>
      </div>
      <div class="field-row" style="flex-direction:row;align-items:center;gap:0.5rem;">
        <input type="checkbox" style="width:auto;" id="prep-${i}" data-path="spellcasting.spells.${i}.prepared" ${item.prepared ? "checked" : ""} />
        <label for="prep-${i}" style="text-transform:none;font-size:0.85rem;">Prepared</label>
      </div>
      <div class="field-row"><label>Notes</label><textarea data-path="spellcasting.spells.${i}.notes">${esc(item.notes)}</textarea></div>
      <button class="remove-btn" data-action="remove-spellcasting.spells" data-index="${i}">Remove spell</button>
    `,
  }));

  return `
    <div class="grid">
      <div class="card">
        <h3>Spellcasting</h3>
        <div class="field-row"><label>Class</label><input data-path="spellcasting.class" value="${esc(sp.class)}" /></div>
        <div class="field-row"><label>Ability</label><input data-path="spellcasting.ability" value="${esc(sp.ability)}" /></div>
      </div>
      <div class="card">
        <h3>Spell Slots</h3>
        <div class="list-rows">${slotsRows}</div>
      </div>
      <div class="card">
        <h3>Cantrips</h3>
        ${cantripsRows}
        <button class="add-btn" data-action="add-spellcasting.cantrips">+ Add cantrip</button>
      </div>
    </div>
    <div class="card">
      <h3>Spells Known</h3>
      <div class="accordion">${spellsHtml}</div>
      <button class="add-btn" data-action="add-spellcasting.spells">+ Add spell</button>
    </div>
  `;
}

function renderInventory() {
  const cur = state.currency;
  const wornRows = renderStringList("equipmentWorn", state.equipmentWorn, "worn");

  const invHtml = renderAccordion("inventory", state.inventory, (item, i) => ({
    title: item.name || "New item",
    sub: item.qty != null && item.qty !== "" ? `x${item.qty}` : "",
    body: `
      <div class="two-col">
        <div class="field-row"><label>Name</label><input data-path="inventory.${i}.name" value="${esc(item.name)}" /></div>
        <div class="field-row"><label>Quantity</label><input data-path="inventory.${i}.qty" value="${esc(item.qty)}" /></div>
      </div>
      <div class="field-row"><label>Notes</label><textarea data-path="inventory.${i}.notes">${esc(item.notes)}</textarea></div>
      <button class="remove-btn" data-action="remove-inventory" data-index="${i}">Remove item</button>
    `,
  }));

  return `
    <div class="grid">
      <div class="card">
        <h3>Currency</h3>
        <div class="two-col">
          <div class="field-row"><label>Copper</label><input type="number" data-path="currency.cp" value="${esc(cur.cp)}" /></div>
          <div class="field-row"><label>Silver</label><input type="number" data-path="currency.sp" value="${esc(cur.sp)}" /></div>
          <div class="field-row"><label>Gold</label><input type="number" data-path="currency.gp" value="${esc(cur.gp)}" /></div>
          <div class="field-row"><label>Platinum</label><input type="number" data-path="currency.pp" value="${esc(cur.pp)}" /></div>
        </div>
        <div class="field-row"><label>Other / misc money notes</label><input data-path="otherMoney" value="${esc(state.otherMoney)}" /></div>
      </div>
      <div class="card">
        <h3>Worn / Equipped</h3>
        ${wornRows}
        <button class="add-btn" data-action="add-equipmentWorn">+ Add equipped item</button>
      </div>
    </div>
    <div class="card">
      <h3>Inventory</h3>
      <div class="accordion">${invHtml}</div>
      <button class="add-btn" data-action="add-inventory">+ Add item</button>
    </div>
  `;
}

function renderFeatures() {
  const featuresHtml = renderAccordion("features", state.features, (item, i) => ({
    title: item.name || "New feature",
    sub: item.source || "",
    body: `
      <div class="two-col">
        <div class="field-row"><label>Name</label><input data-path="features.${i}.name" value="${esc(item.name)}" /></div>
        <div class="field-row"><label>Source</label><input data-path="features.${i}.source" value="${esc(item.source)}" /></div>
      </div>
      <div class="field-row"><label>Notes</label><textarea data-path="features.${i}.notes">${esc(item.notes)}</textarea></div>
      <button class="remove-btn" data-action="remove-features" data-index="${i}">Remove feature</button>
    `,
  }));

  const prof = state.proficiencies;
  return `
    <div class="card">
      <h3>Features &amp; Traits</h3>
      <div class="accordion">${featuresHtml}</div>
      <button class="add-btn" data-action="add-features">+ Add feature</button>
    </div>
    <div class="grid">
      <div class="card">
        <h3>Armor &amp; Weapon Proficiencies</h3>
        ${renderStringList("proficiencies.armor", prof.armor, "armor")}
        <button class="add-btn" data-action="add-proficiencies.armor">+ Add</button>
        ${renderStringList("proficiencies.weapons", prof.weapons, "weapons")}
        <button class="add-btn" data-action="add-proficiencies.weapons">+ Add</button>
      </div>
      <div class="card">
        <h3>Tools &amp; Languages</h3>
        ${renderStringList("proficiencies.tools", prof.tools, "tools")}
        <button class="add-btn" data-action="add-proficiencies.tools">+ Add tool</button>
        ${renderStringList("proficiencies.languages", prof.languages, "languages")}
        <button class="add-btn" data-action="add-proficiencies.languages">+ Add language</button>
      </div>
    </div>
  `;
}

function renderBackground() {
  const p = state.personality;
  return `
    <div class="grid">
      <div class="card">
        <h3>Personality Traits</h3>
        <textarea class="editable-area" data-path="personality.traits">${esc(p.traits)}</textarea>
      </div>
      <div class="card">
        <h3>Ideals</h3>
        <textarea class="editable-area" data-path="personality.ideals">${esc(p.ideals)}</textarea>
      </div>
      <div class="card">
        <h3>Bonds</h3>
        <textarea class="editable-area" data-path="personality.bonds">${esc(p.bonds)}</textarea>
      </div>
      <div class="card">
        <h3>Flaws</h3>
        <textarea class="editable-area" data-path="personality.flaws">${esc(p.flaws)}</textarea>
      </div>
    </div>
    <div class="card">
      <h3>Backstory &amp; Session Notes</h3>
      <textarea class="editable-area" style="min-height:8rem;" data-path="backstoryNotes">${esc(state.backstoryNotes)}</textarea>
    </div>
  `;
}

/* ---------------- Shared list/accordion helpers ---------------- */

function renderStringList(path, arr, keyName) {
  const rows = arr.map((val, i) => `
    <div class="field-row" style="flex-direction:row;align-items:center;">
      <input style="flex:1;" data-path="${path}.${i}" value="${esc(val)}" />
      <button class="remove-btn" data-action="remove-${path}" data-index="${i}">✕</button>
    </div>
  `).join("");
  return `<div class="list-rows" data-listname="${keyName}">${rows}</div>`;
}

function renderAccordion(listPath, items, mapFn) {
  return items.map((item, i) => {
    const { title, sub, body } = mapFn(item, i);
    return `
    <div class="acc-item" data-acc-id="${listPath}-${i}">
      <div class="acc-head" data-action="toggle-acc" data-accid="${listPath}-${i}">
        <span class="acc-caret">▶</span>
        <span class="acc-title">${esc(title)}</span>
        <span class="acc-sub">${esc(sub)}</span>
      </div>
      <div class="acc-body">${body}</div>
    </div>`;
  }).join("");
}

const openAccordions = new Set();
const openAbilities = new Set();

/* ---------------- Panel registry ---------------- */

const PANELS = {
  overview: renderOverview,
  combat: renderCombat,
  spells: renderSpells,
  inventory: renderInventory,
  features: renderFeatures,
  background: renderBackground,
};

function renderPanel(name) {
  const panel = document.getElementById("panel-" + name);
  panel.innerHTML = PANELS[name]();
  // restore open accordions
  panel.querySelectorAll(".acc-item").forEach((el) => {
    if (openAccordions.has(el.dataset.accId)) el.classList.add("open");
  });
}

function renderAllPanels() {
  Object.keys(PANELS).forEach(renderPanel);
  refreshComputed();
  refreshHeader();
}

/* ---------------- Header ---------------- */

function refreshHeader() {
  document.getElementById("charName").value = state.meta.name || "";
  const classesStr = state.classes
    .filter((c) => c.name)
    .map((c) => `${c.name} ${c.level}`)
    .join(" / ") || "No class set";
  document.getElementById("subline").textContent =
    `${state.meta.race || ""} ${classesStr} • ${state.meta.background || ""} • ${state.meta.alignment || ""}`;
  document.getElementById("hpCurrent").value = state.combat.hpCurrent ?? "";
  document.getElementById("hpMax").value = state.combat.hpMax ?? "";
  document.getElementById("ac").value = state.combat.armorClass ?? "";
  document.getElementById("speed").value = state.combat.speed ?? "";
  document.getElementById("inspiration").value = state.inspiration ?? 0;
  document.getElementById("initDisplay").textContent = fmtMod(abilityMod(state.abilities.dex));
}

/* ---------------- Computed refresh (no full re-render) ---------------- */

function refreshComputed() {
  const a = state.abilities;
  document.querySelectorAll('[data-computed="ability-mod"]').forEach((elm) => {
    elm.textContent = fmtMod(abilityMod(a[elm.dataset.computedKey]));
  });
  document.querySelectorAll('[data-computed="save-mod"]').forEach((elm) => {
    const key = elm.dataset.computedKey;
    const prof = !!state.savingThrows[key];
    elm.textContent = fmtMod(abilityMod(a[key]) + (prof ? state.proficiencyBonus : 0));
  });
  document.querySelectorAll('[data-computed="skill-mod"]').forEach((elm) => {
    const key = elm.dataset.computedKey;
    const sk = state.skills[key];
    elm.textContent = fmtMod(abilityMod(a[sk.ability]) + sk.prof * state.proficiencyBonus);
  });
  const pp = document.querySelector('[data-computed="passive-perception"]');
  if (pp) pp.textContent = 10 + abilityMod(a.wis) + state.skills.perception.prof * state.proficiencyBonus;
  document.getElementById("initDisplay").textContent = fmtMod(abilityMod(a.dex));
}

/* ---------------- Event wiring ---------------- */

function parseInputValue(input) {
  if (input.type === "checkbox") return input.checked;
  if (input.type === "number") {
    if (input.value === "") return null;
    const n = Number(input.value);
    return Number.isNaN(n) ? null : n;
  }
  return input.value;
}

document.addEventListener("input", (e) => {
  const target = e.target;
  if (!target.dataset || !target.dataset.path) return;
  setPath(state, target.dataset.path, parseInputValue(target));
  saveState();
  refreshComputed();
  if (target.dataset.path.startsWith("meta.") || target.dataset.path.startsWith("classes.") ||
      target.dataset.path === "combat.hpCurrent" || target.dataset.path === "combat.hpMax" ||
      target.dataset.path === "combat.armorClass" || target.dataset.path === "combat.speed" ||
      target.dataset.path === "inspiration") {
    refreshHeader();
  }
});

document.addEventListener("change", (e) => {
  const target = e.target;
  if (target.type === "checkbox" && target.dataset && target.dataset.path) {
    setPath(state, target.dataset.path, target.checked);
    saveState();
  }
});

function addItem(listPath, factory) {
  const arr = getPath(state, listPath);
  arr.push(factory());
  saveState();
}
function removeItem(listPath, index) {
  const arr = getPath(state, listPath);
  arr.splice(index, 1);
  saveState();
}

const NEW_ITEM_FACTORIES = {
  attacks: () => ({ name: "", atkBonus: "", damage: "", notes: "" }),
  "spellcasting.spells": () => ({ name: "", level: 1, prepared: false, notes: "" }),
  "spellcasting.cantrips": () => "",
  inventory: () => ({ name: "", qty: 1, notes: "" }),
  features: () => ({ name: "", source: "", notes: "" }),
  equipmentWorn: () => "",
  "proficiencies.armor": () => "",
  "proficiencies.weapons": () => "",
  "proficiencies.tools": () => "",
  "proficiencies.languages": () => "",
};

function findPanelForAction(el) {
  const panel = el.closest(".tab-panel");
  return panel ? panel.id.replace("panel-", "") : null;
}

document.addEventListener("click", (e) => {
  const actionEl = e.target.closest("[data-action]");

  // Tab switching
  const tabBtn = e.target.closest(".tab-btn");
  if (tabBtn) {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    tabBtn.classList.add("active");
    document.getElementById("panel-" + tabBtn.dataset.tab).classList.add("active");
    return;
  }

  // Ability block expand/collapse (ignore clicks on the input itself so typing doesn't toggle,
  // and ignore clicks on action elements inside the detail panel -- those are handled below)
  const abBlock = e.target.closest(".ability-block");
  if (abBlock && e.target.tagName !== "INPUT" && !actionEl) {
    const key = abBlock.dataset.ability;
    if (openAbilities.has(key)) openAbilities.delete(key);
    else openAbilities.add(key);
    renderPanel("overview");
    return;
  }

  if (!actionEl) return;
  const action = actionEl.dataset.action;

  if (action === "toggle-acc") {
    const item = actionEl.closest(".acc-item");
    item.classList.toggle("open");
    if (item.classList.contains("open")) openAccordions.add(actionEl.dataset.accid);
    else openAccordions.delete(actionEl.dataset.accid);
    return;
  }

  if (action === "toggle-save") {
    const key = actionEl.dataset.key;
    state.savingThrows[key] = !state.savingThrows[key];
    saveState();
    renderPanel("overview");
    return;
  }

  if (action === "cycle-skill") {
    const key = actionEl.dataset.key;
    const sk = state.skills[key];
    sk.prof = (sk.prof + 1) % 3;
    saveState();
    renderPanel("overview");
    return;
  }

  if (action === "toggle-death") {
    const kind = actionEl.dataset.kind;
    const idx = Number(actionEl.dataset.index);
    const ds = state.combat.deathSaves;
    ds[kind] = ds[kind] === idx + 1 ? idx : idx + 1;
    saveState();
    renderPanel("combat");
    return;
  }

  if (action === "add-class") {
    state.classes.push({ name: "", level: 1 });
    saveState();
    renderPanel("overview");
    refreshHeader();
    return;
  }
  if (action === "remove-class") {
    state.classes.splice(Number(actionEl.dataset.index), 1);
    saveState();
    renderPanel("overview");
    refreshHeader();
    return;
  }

  if (action === "add-hitdie") {
    state.combat.hitDice.push({ die: "1d6", class: "", used: 0 });
    saveState();
    renderPanel("combat");
    return;
  }
  if (action === "remove-hitdie") {
    state.combat.hitDice.splice(Number(actionEl.dataset.index), 1);
    saveState();
    renderPanel("combat");
    return;
  }

  if (action.startsWith("add-")) {
    const listPath = action.slice(4);
    const factory = NEW_ITEM_FACTORIES[listPath];
    if (factory) {
      addItem(listPath, factory);
      const panelName = findPanelForAction(actionEl) || Object.keys(PANELS).find((p) => document.getElementById("panel-" + p).contains(actionEl));
      renderPanel(panelName);
    }
    return;
  }
  if (action.startsWith("remove-")) {
    const listPath = action.slice(7);
    removeItem(listPath, Number(actionEl.dataset.index));
    const panelName = findPanelForAction(actionEl);
    renderPanel(panelName);
    return;
  }
});

/* ---------------- Footer: export / import / reset ---------------- */

document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(state.meta.name || "character").replace(/\s+/g, "_")}-sheet-backup.json`;
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("importInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      state = parsed;
      saveState();
      renderAllPanels();
    } catch (err) {
      alert("That file doesn't look like a valid backup: " + err.message);
    }
  };
  reader.readAsText(file);
  e.target.value = "";
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (!confirm("Reset everything back to the original paper-sheet transcription? This can't be undone.")) return;
  state = getDefaultCharacter();
  saveState();
  renderAllPanels();
});

/* ---------------- Init ---------------- */

Object.keys(PANELS).forEach((name, i) => {
  const div = document.createElement("div");
  div.className = "tab-panel" + (i === 0 ? " active" : "");
  div.id = "panel-" + name;
  document.getElementById("tabContent").appendChild(div);
});

renderAllPanels();
