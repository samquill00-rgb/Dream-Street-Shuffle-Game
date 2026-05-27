# Tree of Life — archived code

Removed from Dream Street Shuffle in the session of 2026-05-27 because it
read as "arbitrary occult complication" rather than something that earned
its weight in the game. This document preserves the full implementation
so it can be restored if Dr Quill changes his mind.

## What it was

A Kabbalistic Tree of Life overlay tied to ten Soho venues — the player
who walked all 10 ("the sefirot") could:

1. See the Tree drawn on the Soho map in the notebook, then fire a
   blue-white lightning bolt descent followed by a return pulse from
   MALKUTH back up to KETHER (full choreography w/ MALKUTH/KETHER labels,
   trail line, sparkles, arrival flash).
2. Reveal the same Tree-of-life lightning during the Dawn Approach
   endgame sequence (rendered into the centre-pent-overlay SVG).
3. Unlock **OPUS STATE** in the stat bars — a second path to opus
   parallel to collecting all 12 haunts.

Sefirot → venue mapping:

| Sefirah | Hebrew | Venue                  | State variable                              |
|---------|--------|------------------------|---------------------------------------------|
| Keter   | כתר    | Centre Point           | `$visitedCentrePoint`                       |
| Chokmah | חכמה   | Trisha's               | `$visited's Trishas`                        |
| Binah   | בינה   | Chinese Fish & Chips   | `$hadChippy`                                |
| Chesed  | חסד    | Pillars of Hercules    | `$visited's Pillars`                        |
| Gevurah | גבורה  | Ronnie Scott's         | `$visited's Ronnies`                        |
| Tiferet | תפארת  | Colony Room            | `$visited's Colony`                         |
| Netzach | נצח    | Coach & Horses         | `$cowRideDone`                              |
| Hod     | הוד    | Lackland's Offices     | `$knowsLackland`                            |
| Yesod   | יסוד   | The French House       | `$visited's French`                         |
| Malkuth | מלכות  | Cecil Court            | `$knowsCecilCourt`                          |

---

## State variables

```harlowe
(set: $treeFlashed to false)\
(set: $opusViaTree to false)\
```

Initialised in the StoryInit block (around line 88 / 91 historically) and
reset in any debug-complete passage.

A debug shortcut also set `$opusViaTree` directly to grant OPUS state for
testing:

```harlowe
(set: $opusViaTree to true)\
```

---

## `dssToggleSefirot` JS function (was around line 4235)

Toggles the Tree-of-life on the Soho map and fires the cascading
lightning the first time it's revealed after walking all 10 sefirot.
Also sets `$treeFlashed` and triggers `dssOpusReveal` (the Ripley wheel).

```javascript
window.dssToggleSefirot = function(btn) {
  var page = btn.closest('.nb-page');
  if (!page) return;
  var svg = page.querySelector('.soho-map svg');
  if (!svg) return;
  var turningOn = !svg.classList.contains('tree-on');
  if (turningOn) {
    btn.classList.add('tree-active');
    btn.textContent = 'Hide from the map';
  } else {
    btn.classList.remove('tree-active');
    btn.textContent = 'Reveal on the map';
  }
  var mapTab = page.querySelector('.nb-tab[data-tab="map"]');
  if (mapTab && window.nbSwitchTab) window.nbSwitchTab(mapTab);
  // Force a reflow so the panel becomes visible BEFORE we toggle the class —
  // otherwise the browser may collapse the visibility-change + class-change
  // into one paint and skip the transition.
  void svg.offsetWidth;
  if (turningOn) {
    svg.classList.add('tree-on');
    // Lightning Flash culmination: first time the player reveals the Tree
    // after walking all 10 sefirot venues, fire the canonical lightning
    // descent. Queue is set in Build Notebook when conditions are met.
    var queue = page.dataset.pentangleQueue || '';
    if (queue.indexOf('tree') >= 0) {
      svg.classList.remove('tree-flashing');
      void svg.offsetWidth;
      svg.classList.add('tree-flashing');
      queue = queue.split(',').filter(function(t){ return t && t !== 'tree'; }).join(',');
      page.dataset.pentangleQueue = queue;
      // Mark the lightning as fired so the TREE-tab "ready" pulse stops on the
      // next notebook open, and so subsequent reveals don't re-queue it. Build
      // Notebook now leaves $treeFlashed false until this point — so the queue
      // persists across notebook closes until the player actually triggers it.
      if (window.Harlowe && window.Harlowe.API_ACCESS) {
        try { window.Harlowe.API_ACCESS.STATE.variables.treeFlashed = true; } catch(e) {}
      }
      // The Tree is a second path to the OPUS STATE. Fire the same modal
      // the alchemical Wheel uses, timed to follow the lightning settling.
      // dssOpusReveal has its own "don't double-spawn" guard.
      setTimeout(function() {
        if (window.dssOpusReveal) window.dssOpusReveal();
      }, 4000);
    }
  } else {
    svg.classList.remove('tree-on');
    svg.classList.remove('tree-flashing');
  }
};
```

---

## Soho-map Tree-of-life SVG markup (was in `Build Notebook` passage)

Rendered into the notebook map SVG between the venue markers and the
foreground vignette:

```harlowe
(set: _m to _m + "<g class='map-tree-lightning' pointer-events='none'><line class='tree-path tree-path-1' x1='280' y1='70' x2='470' y2='200' fill='none' stroke='#d8e0ec' stroke-width='3' stroke-linecap='round'/><line class='tree-path tree-path-2' x1='470' y1='200' x2='100' y2='250' fill='none' stroke='#d8e0ec' stroke-width='3' stroke-linecap='round'/><line class='tree-path tree-path-3' x1='100' y1='250' x2='510' y2='250' fill='none' stroke='#d8e0ec' stroke-width='3' stroke-linecap='round'/><line class='tree-path tree-path-4' x1='510' y1='250' x2='340' y2='305' fill='none' stroke='#d8e0ec' stroke-width='3' stroke-linecap='round'/><line class='tree-path tree-path-5' x1='340' y1='305' x2='230' y2='250' fill='none' stroke='#d8e0ec' stroke-width='3' stroke-linecap='round'/><line class='tree-path tree-path-6' x1='230' y1='250' x2='490' y2='460' fill='none' stroke='#d8e0ec' stroke-width='3' stroke-linecap='round'/><line class='tree-path tree-path-7' x1='490' y1='460' x2='100' y2='430' fill='none' stroke='#d8e0ec' stroke-width='3' stroke-linecap='round'/><line class='tree-path tree-path-8' x1='100' y1='430' x2='230' y2='470' fill='none' stroke='#d8e0ec' stroke-width='3' stroke-linecap='round'/><line class='tree-path tree-path-9' x1='230' y1='470' x2='280' y2='668' fill='none' stroke='#d8e0ec' stroke-width='3' stroke-linecap='round'/><circle class='tree-spark tree-spark-1' cx='280' cy='70' r='4'/><circle class='tree-spark tree-spark-2' cx='470' cy='200' r='4'/><circle class='tree-spark tree-spark-3' cx='100' cy='250' r='4'/><circle class='tree-spark tree-spark-4' cx='510' cy='250' r='4'/><circle class='tree-spark tree-spark-5' cx='340' cy='305' r='4'/><circle class='tree-spark tree-spark-6' cx='230' cy='250' r='4'/><circle class='tree-spark tree-spark-7' cx='490' cy='460' r='4'/><circle class='tree-spark tree-spark-8' cx='100' cy='430' r='4'/><circle class='tree-spark tree-spark-9' cx='230' cy='470' r='4'/><circle class='tree-spark tree-spark-10' cx='280' cy='668' r='4'/></g>")\
```

The Keter and Malkuth sefirot labels (Hebrew calligraphy) on the map's
Centre Point and Cecil Court markers respectively:

```harlowe
(if: $visitedCentrePoint is true)[(set: _m to _m + "<text x='280' y='92' text-anchor='middle' class='seph seph-keter' font-size='15'>כתר</text>")]
(if: $knowsCecilCourt is true)[(set: _m to _m + "<text x='280' y='654' text-anchor='middle' class='seph' font-size='15'>מלכות</text>")]
```

And the Hebrew sefirot labels inside each venue marker (8 venues — added
inside their `<g transform='translate(...)'>` block alongside the venue
name):

```harlowe
<text x='28' y='22' class='seph' font-size='15'>חכמה</text>   <!-- Trisha's -->
<text x='18' y='22' class='seph' font-size='15'>בינה</text>   <!-- Chippy -->
<text x='-28' y='22' text-anchor='end' class='seph' font-size='15'>חסד</text>   <!-- Pillars -->
<text x='-18' y='22' text-anchor='end' class='seph' font-size='15'>גבורה</text> <!-- Ronnie's -->
<text x='18' y='22' class='seph' font-size='15'>תפארת</text>  <!-- Colony Room -->
<text x='-18' y='22' text-anchor='end' class='seph' font-size='15'>נצח</text>   <!-- Coach & Horses -->
<text x='18' y='36' class='seph' font-size='15'>הוד</text>    <!-- Lackland's -->
<text x='18' y='22' class='seph' font-size='15'>יסוד</text>   <!-- The French House -->
```

---

## Notebook integration

Computed flag:

```harlowe
(set: _treeAllVisited to ($visitedCentrePoint is true and _tVisited and _qVisited and _pVisited and _rVisited and _cVisited and _hVisited and _lVisited and _fVisited and _eVisited))\
```

Queue addition + opus grant when ready to flash:

```harlowe
(if: _treeAllVisited and $treeFlashed is false)[(set: $opusViaTree to true)(set: _queue to _queue + (cond: _queue is '', '', ',') + 'tree')]\
(set: _treeCls to (cond: _treeAllVisited and $treeFlashed is false, ' nb-tab-ready', ''))\
```

Tree tab in the notebook tabs row (`_treeCls` adds the pulse class when ready):

```html
<div class="nb-tab' + _treeCls + '" data-tab="tree" onclick="window.nbSwitchTab(this)">TREE</div>
```

Tree tab panel (the "page in the notebook"):

```harlowe
(set: _nb to _nb + '<div class="nb-panel nb-panel-tree">')\
(set: _nb to _nb + '<div class="nb-section"><strong class="nb-heading">TREE OF LIFE</strong>')\
(set: _nb to _nb + '<div class="nb-tree-list">')\
(set: _nb to _nb + '<div class="nb-tree-row ' + (cond: _kVisited, "nb-tree-visited", "nb-tree-unvisited") + '"><span class="nb-tree-heb">כתר</span><span class="nb-tree-eng">Keter</span><span class="nb-tree-venue">Centre Point</span></div>')\
(set: _nb to _nb + '<div class="nb-tree-row ' + (cond: _tVisited, "nb-tree-visited", "nb-tree-unvisited") + '"><span class="nb-tree-heb">חכמה</span><span class="nb-tree-eng">Chokmah</span><span class="nb-tree-venue">Trisha&#39;s</span></div>')\
(set: _nb to _nb + '<div class="nb-tree-row ' + (cond: _qVisited, "nb-tree-visited", "nb-tree-unvisited") + '"><span class="nb-tree-heb">בינה</span><span class="nb-tree-eng">Binah</span><span class="nb-tree-venue">Chinese Fish &amp; Chips</span></div>')\
(set: _nb to _nb + '<div class="nb-tree-row ' + (cond: _pVisited, "nb-tree-visited", "nb-tree-unvisited") + '"><span class="nb-tree-heb">חסד</span><span class="nb-tree-eng">Chesed</span><span class="nb-tree-venue">Pillars of Hercules</span></div>')\
(set: _nb to _nb + '<div class="nb-tree-row ' + (cond: _rVisited, "nb-tree-visited", "nb-tree-unvisited") + '"><span class="nb-tree-heb">גבורה</span><span class="nb-tree-eng">Gevurah</span><span class="nb-tree-venue">Ronnie Scott&#39;s</span></div>')\
(set: _nb to _nb + '<div class="nb-tree-row ' + (cond: _cVisited, "nb-tree-visited", "nb-tree-unvisited") + '"><span class="nb-tree-heb">תפארת</span><span class="nb-tree-eng">Tiferet</span><span class="nb-tree-venue">Colony Room</span></div>')\
(set: _nb to _nb + '<div class="nb-tree-row ' + (cond: _hVisited, "nb-tree-visited", "nb-tree-unvisited") + '"><span class="nb-tree-heb">נצח</span><span class="nb-tree-eng">Netzach</span><span class="nb-tree-venue">Coach &amp; Horses</span></div>')\
(set: _nb to _nb + '<div class="nb-tree-row ' + (cond: _lVisited, "nb-tree-visited", "nb-tree-unvisited") + '"><span class="nb-tree-heb">הוד</span><span class="nb-tree-eng">Hod</span><span class="nb-tree-venue">Lackland&#39;s</span></div>')\
(set: _nb to _nb + '<div class="nb-tree-row ' + (cond: _fVisited, "nb-tree-visited", "nb-tree-unvisited") + '"><span class="nb-tree-heb">יסוד</span><span class="nb-tree-eng">Yesod</span><span class="nb-tree-venue">The French House</span></div>')\
(set: _nb to _nb + '<div class="nb-tree-row ' + (cond: _eVisited, "nb-tree-visited", "nb-tree-unvisited") + '"><span class="nb-tree-heb">מלכות</span><span class="nb-tree-eng">Malkuth</span><span class="nb-tree-venue">Cecil Court</span></div>')\
(set: _nb to _nb + '<div class="nb-tree-row nb-tree-daat"><span class="nb-tree-heb">דעת</span><span class="nb-tree-eng"></span><span class="nb-tree-venue"></span></div>')\
(set: _nb to _nb + '</div>')\
(set: _nb to _nb + '<div class="nb-tree-btn-wrap"><button class="nb-tree-reveal-btn" onclick="window.dssToggleSefirot(this)">Reveal on the map</button></div>')\
(set: _nb to _nb + '</div>')\
(set: _nb to _nb + '</div>')\
```

---

## Stat-bar opus-via-tree integration

In the `header header` passage, the stat bars promoted MORALE/SOBRIETY to
OPUS/STATE when EITHER the 12 haunts were caught OR `$opusViaTree` was
true. The pattern was a 5-way OR clause repeated in every stat condition:

```harlowe
(if: $haunts's length >= 12 or $opusViaTree is true)[...OPUS rendering...]
```

Used in:
- The dark-background `(enchant: ?page, (css: ...))` for full-opus state
- Stat label (MORALE → OPUS)
- Stat bar fill (var width → 100% bar-opus)
- Stat % display (number → "100%")
- Same trio repeated for SOBRIETY → STATE

After removal, the condition is simply `(if: $haunts's length >= 12)`.

---

## Dawn Approach lightning SVG markup

Inside the centre-pent-overlay SVG, gated on `_treeAllVisited`:

```harlowe
(if: _treeAllVisited)[(set: _pv to _pv + "<g class='tree-lightning-overlay' pointer-events='none'><line class='tree-path tree-path-1' x1='280' y1='70' x2='470' y2='200' fill='none' stroke='#a8c8f8' stroke-width='3' stroke-linecap='round'/><line class='tree-path tree-path-2' x1='470' y1='200' x2='100' y2='250' fill='none' stroke='#a8c8f8' stroke-width='3' stroke-linecap='round'/><line class='tree-path tree-path-3' x1='100' y1='250' x2='510' y2='250' fill='none' stroke='#a8c8f8' stroke-width='3' stroke-linecap='round'/><line class='tree-path tree-path-4' x1='510' y1='250' x2='340' y2='305' fill='none' stroke='#a8c8f8' stroke-width='3' stroke-linecap='round'/><line class='tree-path tree-path-5' x1='340' y1='305' x2='230' y2='250' fill='none' stroke='#a8c8f8' stroke-width='3' stroke-linecap='round'/><line class='tree-path tree-path-6' x1='230' y1='250' x2='490' y2='460' fill='none' stroke='#a8c8f8' stroke-width='3' stroke-linecap='round'/><line class='tree-path tree-path-7' x1='490' y1='460' x2='100' y2='430' fill='none' stroke='#a8c8f8' stroke-width='3' stroke-linecap='round'/><line class='tree-path tree-path-8' x1='100' y1='430' x2='230' y2='470' fill='none' stroke='#a8c8f8' stroke-width='3' stroke-linecap='round'/><line class='tree-path tree-path-9' x1='230' y1='470' x2='280' y2='668' fill='none' stroke='#a8c8f8' stroke-width='3' stroke-linecap='round'/><circle class='tree-spark tree-spark-1' cx='280' cy='70' r='4'/><circle class='tree-spark tree-spark-2' cx='470' cy='200' r='4'/><circle class='tree-spark tree-spark-3' cx='100' cy='250' r='4'/><circle class='tree-spark tree-spark-4' cx='510' cy='250' r='4'/><circle class='tree-spark tree-spark-5' cx='340' cy='305' r='4'/><circle class='tree-spark tree-spark-6' cx='230' cy='250' r='4'/><circle class='tree-spark tree-spark-7' cx='490' cy='460' r='4'/><circle class='tree-spark tree-spark-8' cx='100' cy='430' r='4'/><circle class='tree-spark tree-spark-9' cx='230' cy='470' r='4'/><circle class='tree-spark tree-spark-10' cx='280' cy='668' r='4'/><text class='tree-sefirot-label tree-label-malkuth' x='280' y='693'>MALKUTH</text><text class='tree-sefirot-label tree-label-kether' x='280' y='38'>KETHER</text><line class='tree-return-trail' x1='280' y1='668' x2='280' y2='70'/><circle class='tree-return-spark spark-y-590' cx='280' cy='590' r='3'/><circle class='tree-return-spark spark-y-470' cx='280' cy='470' r='3'/><circle class='tree-return-spark spark-y-340' cx='280' cy='340' r='3'/><circle class='tree-return-spark spark-y-220' cx='280' cy='220' r='3'/><circle class='tree-return-spark spark-y-120' cx='280' cy='120' r='3'/><circle class='tree-return-orb' cx='280' cy='668' r='4'/></g>")]
```

The `_treeAllVisited` precomputed temp var in both Dawn Approach passages
(White uses `cpVig`, Black uses `cpVig2`):

```harlowe
(set: _tV to ($visited contains "Trishas" and $visited's Trishas is true))\
(set: _qV to $hadChippy is true)\
(set: _pV to ($visited contains "Pillars" and $visited's Pillars is true))\
(set: _rV to ($visited contains "Ronnies" and $visited's Ronnies is true))\
(set: _cV to ($visited contains "Colony" and $visited's Colony is true))\
(set: _hV to $cowRideDone is true)\
(set: _lV to $knowsLackland is true)\
(set: _fV to ($visited contains "French" and $visited's French is true))\
(set: _eV to $knowsCecilCourt is true)\
(set: _treeAllVisited to ($visitedCentrePoint is true and _tV and _qV and _pV and _rV and _cV and _hV and _lV and _fV and _eV))\
```

And the `(set: $treeFlashed to true)\` at the top of White / Black page
(needed because the Dawn-Approach setter caused a re-render that
double-fired the pent — moving it to the post-navigation passages avoided
that bug while still marking the state for the notebook).

---

## CSS — Soho-map Tree

```css
.soho-map svg .map-tree-lightning {
  opacity: 0;
  transition: opacity 1.4s ease-out;
}
.soho-map svg.tree-on .map-tree-lightning { opacity: 1; }

.tree-path {
  /* base styling — gradient-fill, drop-shadow halo */
}
.soho-map svg.tree-on .tree-path { /* visible state */ }
.tree-spark { /* base */ }

.soho-map svg.tree-flashing .tree-path {
  animation: tree-path-draw 0.5s ease-out forwards;
}
.soho-map svg.tree-flashing .tree-path-1 { animation-delay: 0.20s; }
.soho-map svg.tree-flashing .tree-path-2 { animation-delay: 0.55s; }
.soho-map svg.tree-flashing .tree-path-3 { animation-delay: 0.90s; }
.soho-map svg.tree-flashing .tree-path-4 { animation-delay: 1.25s; }
.soho-map svg.tree-flashing .tree-path-5 { animation-delay: 1.60s; }
.soho-map svg.tree-flashing .tree-path-6 { animation-delay: 1.95s; }
.soho-map svg.tree-flashing .tree-path-7 { animation-delay: 2.30s; }
.soho-map svg.tree-flashing .tree-path-8 { animation-delay: 2.65s; }
.soho-map svg.tree-flashing .tree-path-9 { animation-delay: 3.00s; }
@keyframes tree-path-draw {
  /* stroke-dashoffset 1000 → 0 + opacity 0 → settled */
}
.soho-map svg.tree-flashing .tree-spark {
  animation: tree-spark-pulse 0.7s ease-out forwards;
}
.soho-map svg.tree-flashing .tree-spark-1  { animation-delay: 0.00s; }
/* ... spark-2 through spark-10 staggered ... */
@keyframes tree-spark-pulse {
  0%   { opacity: 0; r: 3;  }
  30%  { opacity: 1; r: 14; }
  100% { opacity: 0; r: 6;  }
}

/* Hebrew sefirot label glyph styling */
.seph {
  fill: rgba(212, 165, 116, 0.75);
  font-family: 'Crimson Text', Georgia, serif;
  pointer-events: none;
}
.seph-keter { /* possible per-sefirah overrides */ }

/* Notebook TREE tab + panel */
.nb-tab[data-tab="tree"] { /* styling */ }
.nb-tab[data-tab="tree"].nb-tab-ready { /* pulsing-ready state when all 10 sefirot visited and $treeFlashed false */ }
.nb-panel-tree { /* panel styling */ }
.nb-tree-list { /* the 10-row list */ }
.nb-tree-row { display: flex; gap: 0.6em; align-items: baseline; }
.nb-tree-row.nb-tree-visited { /* gold */ }
.nb-tree-row.nb-tree-unvisited { /* dimmed */ }
.nb-tree-row.nb-tree-daat { /* hidden/dim 11th-sefirah row */ }
.nb-tree-heb { font-family: 'Crimson Text', serif; }
.nb-tree-eng { /* italic, gold */ }
.nb-tree-venue { /* the venue name */ }
.nb-tree-btn-wrap { text-align: center; }
.nb-tree-reveal-btn { /* the "Reveal on the map" button */ }
.nb-tree-reveal-btn.tree-active { /* "Hide from the map" state */ }
```

## CSS — Dawn Approach Tree-of-life choreography

Inside `tw-passage[tags~="dawn-approach"]`, after the centre-pent-overlay
animation rules:

```css
/* Path strokes — pure-white core with multi-layer blue-white halo glow */
.centre-pent-overlay .tree-lightning-overlay .tree-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  opacity: 0;
  stroke: #ffffff !important;
  stroke-width: 1.6 !important;
  filter: drop-shadow(0 0 3px rgba(255,255,255,1))
          drop-shadow(0 0 8px rgba(168,200,248,0.95))
          drop-shadow(0 0 18px rgba(168,200,248,0.55))
          drop-shadow(0 0 34px rgba(200,224,252,0.25));
}
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-path {
  animation: tree-path-draw-bright 0.95s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-path-1 { animation-delay: 3.65s; }
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-path-2 { animation-delay: 3.90s; }
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-path-3 { animation-delay: 4.15s; }
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-path-4 { animation-delay: 4.40s; }
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-path-5 { animation-delay: 4.65s; }
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-path-6 { animation-delay: 4.90s; }
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-path-7 { animation-delay: 5.15s; }
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-path-8 { animation-delay: 5.40s; }
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-path-9 { animation-delay: 5.65s; }

/* Sparks at each sefirah node */
.centre-pent-overlay .tree-lightning-overlay .tree-spark {
  fill: rgba(200, 224, 252, 0);
  opacity: 0;
  filter: drop-shadow(0 0 4px rgba(255,255,255,0.95))
          drop-shadow(0 0 11px rgba(168,200,248,0.75))
          drop-shadow(0 0 24px rgba(200,224,252,0.4));
}
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-spark {
  animation: tree-spark-pulse-blue 1.0s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-spark-1  { animation-delay: 3.50s; }
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-spark-2  { animation-delay: 3.75s; }
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-spark-3  { animation-delay: 4.00s; }
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-spark-4  { animation-delay: 4.25s; }
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-spark-5  { animation-delay: 4.50s; }
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-spark-6  { animation-delay: 4.75s; }
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-spark-7  { animation-delay: 5.00s; }
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-spark-8  { animation-delay: 5.25s; }
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-spark-9  { animation-delay: 5.50s; }
.dawn-approach.iframe-ready .centre-pent-overlay .tree-lightning-overlay .tree-spark-10 { animation-delay: 5.75s; }
@keyframes tree-spark-pulse-blue {
  0%   { opacity: 0;    r: 4;  fill: rgba(168,200,248,0);    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
  22%  { opacity: 1;    r: 10; fill: rgba(255,255,255,1);    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1); }
  55%  { opacity: 0.85; r: 13; fill: rgba(200,224,252,0.9);  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
  100% { opacity: 0;    r: 10; fill: rgba(168,200,248,0); }
}
@keyframes tree-path-draw-bright {
  0%   { stroke-dashoffset: 1000; opacity: 0;   animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1); }
  18%  { opacity: 1;              stroke-dashoffset: 720; animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1); }
  58%  { opacity: 1;              stroke-dashoffset: 0;   animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
  100% { opacity: 0.4;            stroke-dashoffset: 0; }
}

/* MALKUTH / KETHER sefirot labels — bookends of the descending lightning
   choreography. Playfair Display gold caps, slow fade-in. */
.centre-pent-overlay .tree-sefirot-label {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 18px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  fill: #f5d070;
  filter: drop-shadow(0 0 6px rgba(245,208,112,0.7))
          drop-shadow(0 0 14px rgba(245,208,112,0.35))
          drop-shadow(0 0 2px rgba(8,6,4,0.95));
  opacity: 0;
}
.dawn-approach.iframe-ready .centre-pent-overlay .tree-label-malkuth {
  animation: tree-label-fade-in 1.05s cubic-bezier(0.4, 0, 0.3, 1) 2.2s forwards;
}
.dawn-approach.iframe-ready .centre-pent-overlay .tree-label-kether {
  animation: tree-label-fade-in 1.05s cubic-bezier(0.4, 0, 0.3, 1) 8.55s forwards;
}
@keyframes tree-label-fade-in {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}

/* Return-pulse orb — white-core electric ball travels MALKUTH → KETHER,
   straight vertical, with an arrival flash at the top. */
.centre-pent-overlay .tree-return-orb {
  fill: #ffffff;
  opacity: 0;
  filter: drop-shadow(0 0 4px rgba(255,255,255,1))
          drop-shadow(0 0 9px rgba(168,200,248,1))
          drop-shadow(0 0 20px rgba(168,200,248,0.7))
          drop-shadow(0 0 36px rgba(200,224,252,0.4));
}
.dawn-approach.iframe-ready .centre-pent-overlay .tree-return-orb {
  animation: tree-orb-return 2.0s cubic-bezier(0.4, 0, 0.2, 1) 6.55s forwards;
}
@keyframes tree-orb-return {
  0%   { cx: 280; cy: 668; opacity: 0; r: 3; }
  4%   {                   opacity: 1; r: 6; }
  85%  { cx: 280; cy: 70;  opacity: 1; r: 9; }
  92%  { cx: 280; cy: 70;  opacity: 1; r: 22; }
  100% { cx: 280; cy: 70;  opacity: 0; r: 36; }
}

/* Trail line — drawn in sync behind the orb */
.centre-pent-overlay .tree-return-trail {
  stroke: #ffffff;
  stroke-width: 2.2;
  fill: none;
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  opacity: 0;
  filter: drop-shadow(0 0 3px rgba(255,255,255,1))
          drop-shadow(0 0 8px rgba(168,200,248,0.95))
          drop-shadow(0 0 18px rgba(168,200,248,0.55))
          drop-shadow(0 0 36px rgba(200,224,252,0.28));
}
.dawn-approach.iframe-ready .centre-pent-overlay .tree-return-trail {
  animation: tree-trail-draw 2.0s cubic-bezier(0.4, 0, 0.2, 1) 6.55s forwards;
}
@keyframes tree-trail-draw {
  0%   { stroke-dashoffset: 600; opacity: 0; }
  4%   { opacity: 1; }
  93%  { opacity: 1; stroke-dashoffset: 0; }
  100% { opacity: 0; stroke-dashoffset: 0; }
}

/* Trailing sparkles — bright flashes that pop in the wake of the orb */
.centre-pent-overlay .tree-return-spark {
  fill: rgba(255,255,255,1);
  opacity: 0;
  filter: drop-shadow(0 0 3px rgba(255,255,255,1))
          drop-shadow(0 0 9px rgba(168,200,248,1))
          drop-shadow(0 0 20px rgba(168,200,248,0.65))
          drop-shadow(0 0 36px rgba(200,224,252,0.35));
}
.dawn-approach.iframe-ready .centre-pent-overlay .tree-return-spark {
  animation: tree-return-spark-flash 0.45s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.dawn-approach.iframe-ready .centre-pent-overlay .spark-y-590 { animation-delay: 6.89s; }
.dawn-approach.iframe-ready .centre-pent-overlay .spark-y-470 { animation-delay: 7.29s; }
.dawn-approach.iframe-ready .centre-pent-overlay .spark-y-340 { animation-delay: 7.73s; }
.dawn-approach.iframe-ready .centre-pent-overlay .spark-y-220 { animation-delay: 8.13s; }
.dawn-approach.iframe-ready .centre-pent-overlay .spark-y-120 { animation-delay: 8.46s; }
@keyframes tree-return-spark-flash {
  0%   { opacity: 0; r: 1.5; }
  25%  { opacity: 1; r: 6; }
  55%  { opacity: 0.65; r: 9; }
  100% { opacity: 0; r: 13; }
}
```

---

## Restoring

If you bring the tree back later:

1. Reintroduce the state vars `$treeFlashed` and `$opusViaTree` to
   StoryInit (around line 88).
2. Restore the `dssToggleSefirot` JS function in the main `<script>`
   block in the head (around the dssRevealPentangleOnMap function).
3. In both Dawn Approach passages (White uses `cpVig`, Black uses
   `cpVig2`), restore the `_treeAllVisited` setup block at the top of the
   passage and append the `(if: _treeAllVisited)[...lightning markup...]`
   block to the centre-pent-overlay SVG _pv string (right after the
   closing `</g>` of `.pent-lilies`, before the final
   `</svg><div class='centre-pent-gawain'>` closing).
4. Restore `(set: $treeFlashed to true)\` at the top of White page and
   Black page (above the existing tree-flashed comment, which can be
   removed since it explains the workaround).
5. In `Build Notebook`, restore the `_treeAllVisited` / `_queue tree` /
   `_treeCls` setup; restore the TREE tab in the `<div class="nb-tabs">`
   markup; restore the `nb-panel-tree` block; restore the
   `<g class='map-tree-lightning'>` block in the map SVG; restore the
   Hebrew sefirot `<text>` labels inside each venue marker.
6. In `header header`, restore `or $opusViaTree is true` in all 7
   `$haunts's length >= 12` conditions.
7. Append the Soho-map Tree CSS and the Dawn-Approach Tree CSS back to
   the UserStylesheet (place after the existing `.dawn-approach` /
   `.soho-map` rules).
