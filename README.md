# CharacterSheetTracker

A simple, tabbed web app for tracking a single D&D character, built as a friendlier
alternative to D&D Beyond's sheet UI. No build step, no backend — just static
HTML/CSS/JS that saves to your browser's local storage.

## Running it

Any static file server works, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

You can also just open `index.html` directly in a browser, though a local
server avoids some browsers' restrictions on local file access.

## How it works

- **Tabs**: Overview, Combat, Spells, Inventory, Features, Background.
- Every field is editable in place — click a number to change it, click a row
  (attack, spell, inventory item, feature) to expand it and see/edit details.
- Ability score blocks expand to show the linked saving throw and skills.
- Features with limited uses show a `2/2 left` counter on the row and an
  expended/max control inside; **Track limited uses** adds one to any other
  feature.
- Data is saved automatically to `localStorage` as you type. Use the
  **Export backup** button in the footer to download a JSON copy (handy before
  clearing browser data or to move to another device), and **Import backup**
  to load one back in.
- **Reset to paper sheet** restores the original transcription from the
  physical character sheet (see `js/data.js`).

## Changing the sheet in code

`js/data.js` is only read the first time a browser opens the sheet. After that
the copy in `localStorage` wins, so editing the seed data by itself never
reaches a sheet somebody is already using.

To get a change (a level-up, a corrected proficiency) onto an existing sheet:

1. Edit `DEFAULT_CHARACTER` so a brand-new sheet is right.
2. Bump `SHEET_VERSION` and add a matching entry to `MIGRATIONS` making the same
   change to an already-saved sheet.

Migrations run on load and on imported backups, and older sheets are brought up
to date in one pass. Because a sheet may have been hand-edited in the app for
months, each migration checks before it adds anything and never overwrites an
existing entry — running one twice has to be a no-op.

## Notes on the seed data

The starting data in `js/data.js` was transcribed from a photo of the paper
sheet. A few values (exact HP maximum, some attack bonuses/damage) were hard
to read and were filled in as best guesses — double check those in the app
and correct them if needed. The Paladin-related features and the Divine Smite
spell are marked "planned" since those levels haven't been taken yet.

Joe is Artificer 1 / Rogue 1 / Fighter 1 / Ranger 1. The Ranger level takes the
optional Tasha's features — Favored Foe and Deft Explorer, with Canny applied to
Investigation — so Favored Enemy and Natural Explorer are deliberately absent.
The HP maximum does not include the Ranger level's hit die yet; add whatever you
roll for it.
