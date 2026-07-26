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
- Data is saved automatically to `localStorage` as you type. Use the
  **Export backup** button in the footer to download a JSON copy (handy before
  clearing browser data or to move to another device), and **Import backup**
  to load one back in.
- **Reset to paper sheet** restores the original transcription from the
  physical character sheet (see `js/data.js`).

## Notes on the seed data

The starting data in `js/data.js` was transcribed from a photo of the paper
sheet. A few values (exact HP maximum, some attack bonuses/damage) were hard
to read and were filled in as best guesses — double check those in the app
and correct them if needed. The Paladin-related features and the Divine Smite
spell are marked "planned" since those levels haven't been taken yet.
