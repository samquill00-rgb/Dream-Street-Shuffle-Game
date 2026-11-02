
(function(){var __boot=function(){
  /* ===========================================================
     CECIL COURT WALTZ — three-lane rhythm minigame, no win state.
     90 BPM, 3/4. 16 bars total: 2 bars intro + 1 count-in bar
     + 12 bars of dance (six bars LDR, two bars RDL variation,
     four bars LDR) + 1 bar outro. Total ~32 seconds.

     Hits glow; misses are silent. Like the Sketch — the dance
     is the point, not the score.
     =========================================================== */
  var canvas = document.getElementById('waltz-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var crossing=document.getElementById('wk-glass-crossing');if(crossing){requestAnimationFrame(function(){var r=canvas.getBoundingClientRect();crossing.style.left=r.left+'px';crossing.style.top=r.top+'px';crossing.style.width=r.width+'px';crossing.style.height=r.height+'px';crossing.style.opacity='0';});}
  var W = canvas.width, H = canvas.height;

  /* ── Music timing ── */
  var BPM = 90;
  var EZ = window.dssEase ? window.dssEase.level('waltz') : 0; /* 2026-10-28 (dssEase): lost waltzes widen the next one's timing; the music's tempo stays */
  var WIN_MS = 220 + EZ * 45, ZONE = 1 + EZ * 0.25;
  var BEAT_MS = 60000 / BPM;        /* 666.67 */
  var BAR_MS  = BEAT_MS * 3;        /* 2000 */
  var TOTAL_MS = BAR_MS * 18;       /* 36000: count-in, then a full approach before the first step */

  /* ── Lanes ── */
  var LANES = [
    { key: 'ArrowLeft',  alt: 'a', x: W * 0.18, glyph: '←', label: 'LEFT'  },
    { key: 'ArrowDown',  alt: 's', x: W * 0.50, glyph: '↓', label: 'DOWN'  },
    { key: 'ArrowRight', alt: 'd', x: W * 0.82, glyph: '→', label: 'RIGHT' }
  ];
  /* The street runs UP the canvas: the player's feet are at TARGET_Y
     near the bottom, and marks first appear at SPAWN_Y near the top
     (the distance / vanishing line) and drift DOWN toward the player as
     the player "walks forward". */
  var TARGET_Y = H - 78;
  var SPAWN_Y  = 36;
  var VAN_X    = W / 2;       /* vanishing-point x — directly ahead */
  var VAN_NARROW = 0.30;      /* lane spread at the vanishing line, relative to player line */
  var APPROACH_MS = BAR_MS;   /* one bar of lead-in before a mark reaches the player */
  var PIXELS_PER_MS = (TARGET_Y - SPAWN_Y) / APPROACH_MS;

  /* tFactor: 0 at the vanishing line (top), 1 at the player line (bottom). */
  function tFactor(y) {
    var t = (y - SPAWN_Y) / (TARGET_Y - SPAWN_Y);
    return t < 0 ? 0 : t > 1.05 ? 1.05 : t;
  }
  /* Lane x at a given y, with perspective convergence. At the player line
     lanes sit at full spread; at the vanishing line they pull toward VAN_X. */
  function laneXAt(laneIdx, y) {
    var t = tFactor(y);
    var spread = VAN_NARROW + (1 - VAN_NARROW) * t;
    return VAN_X + (LANES[laneIdx].x - VAN_X) * spread;
  }
  /* Mark size scales with depth — small in the distance, full at your feet. */
  function sizeAt(y) {
    return 0.46 + 0.54 * tFactor(y);
  }

  /* ── Beat schedule ──
     Beats 0-5:   bars 1-2, intro music, no notes (4s).
     Beats 6-8:   bar 3, count-in (visual 1-2-3, no playable notes) (2s).
     Beats 9-44:  bars 4-15, twelve bars of dance (24s).
     Beat  45:    bar 16 beat 1, a single RIGHT step — the finality
                  cadence; the last step of bar 15 echoes once on the
                  downbeat of the outro bar, then silence holds.
     Beats 46-47: rest of bar 16, silence (~1.3s). */
  var notes = [];  /* { beatIdx, lane, hit:false, missed:false } */
  function pushPattern(barStart, lanesByBeat) {
    for (var b = 0; b < 3; b++) {
      var ln = lanesByBeat[b];
      if (ln === null || ln === undefined) continue;
      notes.push({ beatIdx: barStart * 3 + b, lane: ln, hit: false, missed: false });
    }
  }
  /* 2026-10-14 (Sam: "the waltz steps change slightly with every play through"): the first two bars always teach
     LEFT, DOWN, RIGHT; the ten after are drawn fresh each time as waltz phrases, a figure held for two bars, then a
     turn, so it reads as a dance and not as noise. The closing RIGHT stays. */
  var FIG = [[0, 1, 2], [2, 1, 0], [0, 2, 1], [2, 0, 1], [1, 0, 2], [1, 2, 0], [0, 1, 0], [2, 1, 2]];
  function pick(not) { var f; do { f = FIG[Math.floor(Math.random() * FIG.length)]; } while (not && f === not); return f; }
  pushPattern(3, [0, 1, 2]); pushPattern(4, [0, 1, 2]);
  var prevFig = FIG[0];
  for (var bar = 5; bar <= 14; bar += 2) { var fg = pick(prevFig); pushPattern(bar, fg); if (bar + 1 <= 14) pushPattern(bar + 1, Math.random() < 0.7 ? fg : pick(fg)); prevFig = fg; }
  /* Bar 16 beat 1: one final RIGHT — the last step echoes onto the
     downbeat of the outro bar, then the dance settles. */
  pushPattern(15, [2, null, null]);
  notes.forEach(function(n){n.beatIdx+=6;}); // first step at 10s; first note appears at 8s, after the count-in

  /* ── Audio ── */
  var carry=window._dssWaltzCarry;window._dssWaltzCarry=null;
  if(carry && performance.now()-carry.at>4000){if(carry.music)carry.music.stop();carry=null;}
  if(carry && carry.music)carry.music.claimed=true;
  var audioBase=0, audioPrevious=0, audioTravel=0, inheritedMusic=carry&&carry.music||null;
  var audioEl = null;
  var audioStarted = false;
  var muteWatcher = null;
  function isGameMuted() {
    return !!(window.dssAudio && window.dssAudio.isMuted && window.dssAudio.isMuted());
  }
  function startAudio() {
    if (audioStarted) return;
    audioStarted = true;
    if(carry && carry.music && carry.music.el){inheritedMusic=carry.music;inheritedMusic.claimed=true;audioEl=inheritedMusic.el;audioBase=Math.floor(audioEl.currentTime/2)*2;audioPrevious=audioEl.currentTime;audioTravel=audioPrevious-audioBase;inheritedMusic.open();return;}
    var src = window._waltzMiniDataUri || '';
    /* If the placeholder hasn't been replaced (track still parked), the URI
       starts with __DSS_; in that case skip audio and play silently. */
    if (!src || src.indexOf('__DSS_') === 0) return;
    try {
      audioEl = new Audio(src);
      audioEl.volume = 0.42;
      audioEl.loop = true;
      audioEl.muted = isGameMuted();
      audioEl.play().catch(function(){});
      /* Track the global mute toggle so unmute/mute mid-waltz works. */
      muteWatcher = setInterval(function(){
        if (!audioEl) return;
        var m = isGameMuted();
        if (audioEl.muted !== m) audioEl.muted = m;
      }, 250);
    } catch (e) {}
  }
  function stopAudio() {
    if (muteWatcher) { clearInterval(muteWatcher); muteWatcher = null; }
    if(inheritedMusic){inheritedMusic.stop();inheritedMusic=null;audioEl=null;return;}
    if (!audioEl) return;
    try { audioEl.pause(); audioEl.src = ''; } catch (e) {}
    audioEl = null;
  }
  /* Stop audio if the player navigates away mid-game. The gen snapshot is
     deferred one tick because Harlowe runs passage <script> tags
     synchronously during rendering, BEFORE the MutationObserver
     increments _passageGen for this passage — same race fix as Dawn
     wheel / dual ring heartbeat. Without the defer the very first frame
     trips the navigated-away guard and the canvas stays blank.

     pgGen stays null until the deferred snapshot lands, and the frame
     loop treats null as "still mounting, don't bail". */
  var pgGen = null;
  setTimeout(function(){
    pgGen = window._passageGen;
    var watchGen = setInterval(function(){
      if (window._passageGen !== pgGen) { document.removeEventListener('keydown',onKey);if(hitAudio)hitAudio.close().catch(function(){});stopAudio(); clearInterval(watchGen); }
    }, 300);
  }, 0);

  /* ── State ── */
  var startedAt = 0;        /* performance.now() at first user gesture */
  var running = false;
  var ended = false;
  var hitFlash = [0, 0, 0]; /* per-lane hit timestamp */
  var ripples = [];         /* {x, y, t0} */
  var sparks  = [];         /* {x, y, vx, vy, t0, life} — gold sparks on hit */
  var still=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var enchant=.25, lastMiss=-10000;
  var danceStreak = 0, bestStreak = 0, streakGlow = 0;

  /* ── Hit ding ──
     Short procedural triangle-wave tone on each clean hit, so the
     player feels they're laying percussion over the waltz. Pitched
     per lane in a soft F-major triad — LEFT = F5, DOWN = A5, RIGHT = C6
     — so a clean LEFT-DOWN-RIGHT bar sounds like a rising arpeggio
     against the music. */
  var hitAudio = null;
  function playDing(laneIdx) {
    if(isGameMuted())return;
    try {
      if (!hitAudio) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        hitAudio = new AC();
      }
      var ac = hitAudio;
      var pitches = [698.46, 880.00, 1046.50];
      var freq = pitches[laneIdx] || 880;
      var now = ac.currentTime;
      /* Main triangle tone — short, soft attack, fast decay */
      var osc = ac.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      var g = ac.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.18, now + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0008, now + 0.22);
      osc.connect(g); g.connect(ac.destination);
      osc.start(now); osc.stop(now + 0.24);
      /* Octave shimmer — adds a little bell-like sparkle */
      var osc2 = ac.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = freq * 2;
      var g2 = ac.createGain();
      g2.gain.setValueAtTime(0.0001, now);
      g2.gain.exponentialRampToValueAtTime(0.06, now + 0.004);
      g2.gain.exponentialRampToValueAtTime(0.0006, now + 0.14);
      osc2.connect(g2); g2.connect(ac.destination);
      osc2.start(now); osc2.stop(now + 0.16);
    } catch (e) {}
  }

  // 2026-10-14 (Sam: the first steps came before you could press them): the clock started on the tap, but the track
  // needs a moment to load and start, so the steps ran ahead of the music. Now the music is the clock: hold at 0 until
  // it is playing (up to 2.5 s), then follow its own time; with no track, the old wall clock.
  function elapsedMs() {
    if (!running) return 0;
    if (audioEl) {
      if (!audioEl.paused && audioEl.currentTime > 0) {var step=audioEl.currentTime-audioPrevious;if(step<0)step+=audioEl.duration||0;audioTravel+=step;audioPrevious=audioEl.currentTime;return audioTravel*1000;}
      if (audioEl.currentTime === 0 && performance.now() - startedAt < 2500) return 0;
      if (audioEl.ended) return Math.max(audioEl.duration * 1000 || 0, performance.now() - startedAt);
    }
    return performance.now() - startedAt;
  }

  /* ── Input ── */
  function laneForKey(k) {
    var lower = k.toLowerCase();
    for (var i = 0; i < LANES.length; i++) {
      if (k === LANES[i].key || lower === LANES[i].alt) return i;
    }
    return -1;
  }
  function tryHit(laneIdx) {
    var t = elapsedMs();
    var bestIdx = -1, bestDelta = 9999;
    for (var i = 0; i < notes.length; i++) {
      var n = notes[i];
      if (n.hit || n.missed || n.lane !== laneIdx) continue;
      var noteT = n.beatIdx * BEAT_MS;
      var delta = Math.abs(t - noteT);
      if (delta < bestDelta) { bestDelta = delta; bestIdx = i; }
    }
    /* ±220ms hit window */
    if (bestIdx >= 0 && bestDelta <= WIN_MS) {
      enchant=Math.min(1,enchant+.075);
      notes[bestIdx].hit = true;
      notes[bestIdx].hitDelta = bestDelta;
      if (bestDelta <= 80) { danceStreak++; bestStreak = Math.max(bestStreak, danceStreak); streakGlow = 1; }
      else danceStreak = 0;
      var now = performance.now();
      hitFlash[laneIdx] = now;
      ripples.push({ x: LANES[laneIdx].x, y: TARGET_Y, t0: now });
      /* A step landed dead on the beat earns a second, trailing ring —
         quiet acknowledgement, no score talk. */
      if (bestDelta <= 80) ripples.push({ x: LANES[laneIdx].x, y: TARGET_Y, t0: now + 130 });
      playDing(laneIdx);
      /* Burst gold sparks outward — a small flourish for hitting in time. */
      var sparkCount = bestDelta <= 80 ? 16 : 10;
      var sparkX = LANES[laneIdx].x;
      var sparkY = TARGET_Y;
      for (var k = 0; k < sparkCount; k++) {
        var ang = (Math.PI * 2) * (k / 10) + (Math.random() - 0.5) * 0.5;
        var spd = 90 + Math.random() * 120;        /* px/sec */
        sparks.push({
          x:  sparkX,
          y:  sparkY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 40,            /* slight upward bias */
          t0: now,
          life: 500 + Math.random() * 350           /* ms */
        });
      }
    }
  }
  function onKey(e) {
    var lane = laneForKey(e.key);
    if (lane < 0) return;
    e.preventDefault();
    if (!running) {
      running = true;
      startedAt = performance.now();
      startAudio();
      return;
    }
    if (ended) return;
    tryHit(lane);
  }
  document.addEventListener('keydown', onKey);
  /* Click/tap to start; once running, click or TAP a lane (mapped by X to the nearest
     lane) to hit its note — so the rhythm game is playable on touch, not keyboard-only.
     Mirrors the cow-ride touch pattern (getBoundingClientRect + scale by W/r.width). */
  function _waltzLaneForX(cx) {
    var best = 0, bestD = 1e9;
    for (var i = 0; i < LANES.length; i++) { var d = Math.abs(cx - LANES[i].x); if (d < bestD) { bestD = d; best = i; } }
    return best;
  }
  function _waltzPointer(clientX) {
    if (!running) { running = true; startedAt = performance.now(); startAudio(); return; }
    if (ended) return;
    var r = canvas.getBoundingClientRect();
    var cx = (clientX - r.left) * (W / r.width);
    tryHit(_waltzLaneForX(cx));
  }
  canvas.addEventListener('click', function(e){ _waltzPointer(e.clientX); });
  canvas.addEventListener('touchstart', function(e){ e.preventDefault(); if (e.touches && e.touches[0]) _waltzPointer(e.touches[0].clientX); }, { passive: false });

  /* Effective scroll time — equals real elapsedMs() during play, but
     decelerates smoothly over the last bar (2s) and then locks. So at
     the end the pavement comes to rest with you standing in the amber
     pool, rather than carrying on past it. */
  function scrollTimeAt(realT) {
    var slowStart = TOTAL_MS - 2000;
    if (realT <= slowStart) return realT;
    var p = Math.min(1, (realT - slowStart) / 2000);
    var ease = 1 - Math.pow(1 - p, 3);              /* cubic ease-out */
    return slowStart + 2000 * ease;
  }

  /* ── Drawing ── */
  function drawBackground() {
    var t=elapsedMs(), dissolve=Math.min(1,t/(still?1200:8000)), opening=dissolve*dissolve*(3-2*dissolve);
    var strength=enchant*(t-lastMiss<650?.15:1)*Math.min(1,Math.max(0,(TOTAL_MS-t)/1800));
    window.dssWaltzGlass(canvas,t+(carry?carry.at-carry.born:0),opening,strength,still,1,t/TOTAL_MS);
  }
  /* The waltzing pair — two long soft shadows cast up the street from
     behind you, swaying in 3/4 time. The dance made visible without
     breaking the first-person walk. */
  function drawShadows() {}

  /* Small coloured pools of light cast on the pavement from unseen shop
     windows — they scroll past at the same rate as the cobblestones, so
     each one is rigidly placed in the world and you walk through it.
     The big amber at the end is O'Flatterly's scrumpy amber arrival. */
  var POOLS = [
    /* t = ms when the pool reaches the player line. x is the pool's
       horizontal centre at the player line (perspective narrows it in
       the distance). col is "r,g,b". r is base radius at the player line. */
    { t:  5500, x: W * 0.28, r: 125, col: '208, 80, 70'   },  /* red shop */
    { t:  9000, x: W * 0.72, r: 125, col: '110,170, 90'   },  /* green */
    { t: 12500, x: W * 0.22, r: 120, col: '120,140,210'   },  /* blue */
    { t: 16000, x: W * 0.78, r: 122, col: '178,108,188'   },  /* violet */
    { t: 19500, x: W * 0.32, r: 125, col: '212,124, 78'   },  /* warm red */
    { t: 23000, x: W * 0.68, r: 200, col: ' 96,184,176'   }   /* teal — bigger still, transitions you into the amber */
  ];
  function drawPools() {
    // Scroll time, not wall time — the pools are world-fixed like the
    // cobbles and windows, so they must decelerate and stop with them
    var t = running ? scrollTimeAt(elapsedMs()) : 0;
    for (var i = 0; i < POOLS.length; i++) {
      var p = POOLS[i];
      var delta = p.t - t;
      if (delta > APPROACH_MS + 400) continue;     /* hasn't appeared yet */
      if (delta < -APPROACH_MS) continue;          /* long passed */
      var y = TARGET_Y - delta * PIXELS_PER_MS;
      if (y < SPAWN_Y - 20 || y > H + 80) continue;
      var tf = tFactor(y);
      /* Perspective-narrow the pool's centre x same way lanes narrow */
      var spread = VAN_NARROW + (1 - VAN_NARROW) * tf;
      var px = VAN_X + (p.x - VAN_X) * spread;
      var rad = p.r * (0.35 + 0.65 * tf);
      /* Soften pools that are far ahead OR sailing past behind you */
      var alphaBase = 0.55;
      if (delta < 0) alphaBase *= Math.max(0.25, 1 + delta / APPROACH_MS);
      var grad = ctx.createRadialGradient(px, y, 0, px, y, rad);
      grad.addColorStop(0,   'rgba(' + p.col + ',' + (alphaBase * 0.7) + ')');
      grad.addColorStop(0.45,'rgba(' + p.col + ',' + (alphaBase * 0.30) + ')');
      grad.addColorStop(1,   'rgba(' + p.col + ',0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }
  }
  /* The destination amber — O'Flatterly's lit-late window. Doesn't
     scroll past; it grows under you as you arrive. Fades in over the
     last 8 seconds, so by Onward you're standing inside it. */
  function drawDestinationAmber() {
    var t = elapsedMs();
    var fadeStart = TOTAL_MS - 8000;
    if (t < fadeStart) return;
    var p = Math.min(1, (t - fadeStart) / 8000);
    var ease = p * p;                              /* slow, then bloom */
    var rad = 110 + 360 * ease;
    var alpha = 0.62 * ease;
    var grad = ctx.createRadialGradient(VAN_X, TARGET_Y + 14, 0, VAN_X, TARGET_Y + 14, rad);
    grad.addColorStop(0,   'rgba(248,208,128,' + alpha + ')');
    grad.addColorStop(0.45,'rgba(218,160, 70,' + (alpha * 0.55) + ')');
    grad.addColorStop(1,   'rgba(160,108, 38,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }
  function drawLanes() {
    /* Three converging chalk lines — the dance lanes drawn on the
       pavement, perspective-narrowed toward the vanishing point. */
    for (var i = 0; i < LANES.length; i++) {
      var topX = laneXAt(i, SPAWN_Y);
      var botX = laneXAt(i, H - 8);
      ctx.strokeStyle = 'rgba(220,196,158,0.18)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 7]);
      ctx.beginPath();
      ctx.moveTo(topX, SPAWN_Y);
      ctx.lineTo(botX, H - 8);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    /* Player line — three chalk circles where your feet will pass over
       each lane. These are the "now" zone: marks that reach this line
       are hit. */
    /* The rings breathe in 3/4 — a deeper swell on the ONE. */
    var bt = elapsedMs();
    var beatInBar = Math.floor((bt % BAR_MS) / BEAT_MS);
    var beatPhase = (bt % BEAT_MS) / BEAT_MS;
    var pulse = (running && !ended) ? (1 - beatPhase) * (beatInBar === 0 ? 3.2 : 1.3) : 0;
    for (var j = 0; j < LANES.length; j++) {
      var L = LANES[j];
      var sinceHit = performance.now() - hitFlash[j];
      var glow = sinceHit < 500 ? Math.max(0, 1 - sinceHit / 500) : 0;
      ctx.strokeStyle = 'rgba(220,196,158,' + (0.45 + 0.5 * glow + 0.08 * (pulse / 3.2)) + ')';
      ctx.lineWidth = 1.4 + 1.6 * glow;
      ctx.beginPath();
      ctx.arc(L.x, TARGET_Y, 26 + pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(232,220,196,' + (0.55 + 0.4 * glow) + ')';
      ctx.font = '22px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(L.glyph, L.x, TARGET_Y);
    }
    /* Faint horizon bar at the vanishing line — gives the eye a "far end"
       to the street. */
    ctx.strokeStyle = 'rgba(220,196,158,0.22)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(W * 0.32, SPAWN_Y);
    ctx.lineTo(W * 0.68, SPAWN_Y);
    ctx.stroke();
    if (running && !ended) {
      streakGlow = Math.max(0, streakGlow - 0.035);
      ctx.textAlign = 'center'; ctx.font = '10px Georgia, serif';
      ctx.fillStyle = 'rgba(248,208,128,' + (0.52 + streakGlow * 0.4) + ')';
      ctx.fillText(danceStreak ? ('CLEAN STEPS  ' + danceStreak) : 'KEEP THE THREE-STEP', W / 2, H - 18);
    }
  }
  function drawNotes() {
    var t = elapsedMs();
    for (var i = 0; i < notes.length; i++) {
      var n = notes[i];
      if (n.hit) continue;
      var noteT = n.beatIdx * BEAT_MS;
      var delta = noteT - t;
      /* Auto-mark missed if it sails past the player by 250ms */
      if (delta < -(WIN_MS + 30) && !n.missed) { n.missed = true; danceStreak = 0; enchant=Math.max(.12,enchant-.11);lastMiss=t; }
      /* Visible window: from spawn (delta = APPROACH_MS, near vanishing
         line) until shortly after the player line (delta = -400ms). */
      if (delta > APPROACH_MS || delta < -400) continue;
      /* Position along the street: delta=APPROACH_MS → SPAWN_Y; delta=0 →
         TARGET_Y; delta<0 → past the player (off the bottom). */
      var y = TARGET_Y - delta * PIXELS_PER_MS;
      var x = laneXAt(n.lane, y);
      var sz = sizeAt(y);
      var L = LANES[n.lane];
      var alpha = n.missed ? 0.14 : 0.92;
      ctx.save();
      ctx.translate(x, y);
      if (n.missed) {
        /* Missed marks smudge — a spread chalk ghost drifting past */
        ctx.fillStyle = 'rgba(232,220,196,' + alpha + ')';
        ctx.beginPath();
        ctx.arc(0, 0, 21 * sz, 0, Math.PI * 2);
        ctx.fill();
      } else {
        /* Gilt medallion: parchment disc, shaded, in a gold rim */
        var med = ctx.createRadialGradient(-4 * sz, -5 * sz, 2, 0, 0, 19 * sz);
        med.addColorStop(0, 'rgba(246,238,214,' + alpha + ')');
        med.addColorStop(0.75, 'rgba(226,210,178,' + alpha + ')');
        med.addColorStop(1, 'rgba(200,180,140,' + alpha + ')');
        ctx.fillStyle = med;
        ctx.beginPath();
        ctx.arc(0, 0, 18 * sz, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(212,176,96,' + (alpha * 0.95) + ')';
        ctx.lineWidth = 2.1 * sz;
        ctx.stroke();
        ctx.strokeStyle = 'rgba(150,118,58,' + (alpha * 0.5) + ')';
        ctx.lineWidth = 0.8 * sz;
        ctx.beginPath();
        ctx.arc(0, 0, 14.5 * sz, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(28,22,18,' + (alpha * 0.85) + ')';
      ctx.font = 'bold ' + Math.round(22 * sz) + 'px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(L.glyph, 0, 1);
      ctx.restore();
    }
  }
  function drawRipples() {
    var now = performance.now();
    for (var i = ripples.length - 1; i >= 0; i--) {
      var r = ripples[i];
      var age = now - r.t0;
      if (age < 0) continue; /* trailing ring not born yet */
      if (age > 700) { ripples.splice(i, 1); continue; }
      var p = age / 700;
      var radius = 18 + p * 50;
      /* Gold ring — matches the destination amber palette. */
      ctx.strokeStyle = 'rgba(248,208,128,' + (0.78 * (1 - p)) + ')';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  function drawSparks() {
    var now = performance.now();
    for (var i = sparks.length - 1; i >= 0; i--) {
      var s = sparks[i];
      var age = now - s.t0;
      if (age >= s.life) { sparks.splice(i, 1); continue; }
      var p = age / s.life;                       /* 0..1 */
      /* Integrate position with mild gravity */
      var dt = age / 1000;
      var px = s.x + s.vx * dt;
      var py = s.y + s.vy * dt + 110 * dt * dt;   /* gravity */
      var alpha = 0.95 * (1 - p);
      /* Two-tone gold: bright core + warmer halo. */
      ctx.fillStyle = 'rgba(252,232,164,' + alpha + ')';
      ctx.beginPath();
      ctx.arc(px, py, 1.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(248,192, 96,' + (alpha * 0.55) + ')';
      ctx.beginPath();
      ctx.arc(px, py, 3.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function drawCountIn() {
    var t = elapsedMs();
    /* Count in at 6–8s. Notes only begin their two-second approach afterwards.
       Counts UP — 1, 2, 3 — the way a musician counts in. */
    var countinStart = BAR_MS * 3;
    var countinEnd   = BAR_MS * 4;
    if (t < countinStart || t >= countinEnd) return;
    var beatInBar = Math.floor((t - countinStart) / BEAT_MS);  /* 0..2 */
    var num = beatInBar + 1;                /* 1, 2, 3 */
    var beatProgress = ((t - countinStart) % BEAT_MS) / BEAT_MS;
    var alpha = Math.max(0, 1 - beatProgress);
    ctx.fillStyle = 'rgba(232,220,196,' + (0.85 * alpha) + ')';
    ctx.font = 'bold 88px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(num), W / 2, H / 2);
  }
  function drawIdle() {
    /* Pre-start prompt — large chalk text */
    ctx.fillStyle = 'rgba(232,220,196,0.78)';
    ctx.font = '20px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Press a key, or click here, to begin.', W / 2, H / 2 - 14);
    /* control hint removed — the rules popup teaches the lanes/keys */
  }
  function drawEnd() {
    /* Intentionally empty — the canvas keeps its final pavement/lanes
       state and the Onward link fades in below it. No outro copy. */
  }

  /* Auto-start: drop the "press a key to begin" prompt and roll the
     waltz the moment the canvas mounts. A small grace delay lets the
     pavement paint in first so the audio doesn't kick in over a blank
     canvas. The pgGen guard prevents auto-start firing into a stale
     passage if the player navigated away in the same tick. */
  setTimeout(function(){
    if (pgGen !== null && window._passageGen !== pgGen) return;
    if (running || ended) return;
    running = true;
    startedAt = performance.now();
    startAudio();
  }, 450);

  /* ── Main loop ── */
  function frame() {
    /* pgGen is null until the deferred snapshot lands — keep rendering
       through the mounting window instead of bailing. */
    if (pgGen !== null && window._passageGen !== pgGen) return;
    drawBackground();
    if (running) { drawPools(); drawShadows(); }
    drawLanes();
    if (!running) {
      drawIdle();
    } else if (ended) {
      drawDestinationAmber();
      drawEnd();
    } else {
      drawNotes();
      drawDestinationAmber();
      drawCountIn();
      drawRipples();
      drawSparks();
      if (elapsedMs() >= TOTAL_MS) {
        ended = true;
        /* Performance scoring — average how close each hit was to perfect,
           weight by zone, then nudge morale & sobriety asymptotically.
             Perfect ≤60ms  : 1.00 credit
             Good   ≤150ms  : 0.75 credit
             Late   ≤220ms  : 0.50 credit
             Miss / no hit  : 0    credit
           Score 0..1. At 0.5 (neutral) no stat change; above lifts both,
           below penalises both. Mirrors the asymptotic $statGain/$statLoss
           formula so it composes with the rest of the game's stat curve. */
        try {
          var total = 0, weighted = 0, kept = 0, clean = 0;
          for (var ni = 0; ni < notes.length; ni++) {
            var nn = notes[ni];
            total++;
            if (nn.hit) {
              var hd = (typeof nn.hitDelta === 'number') ? nn.hitDelta : 0; kept++; if (hd <= 60 * ZONE) clean++;
              weighted += (hd <= 60 * ZONE) ? 1.0 : (hd <= 150 * ZONE) ? 0.75 : 0.5;
            }
          }
          var score = total > 0 ? weighted / total : 0;
          /* Linear map: score 1 → morale +20 / sob +8;
                          score 0.5 → 0 / 0;
                          score 0 → morale −15 / sob −10. */
          var moraleN = (score - 0.5) * 40;   /* −20..+20 */
          var sobN    = (score - 0.5) * 20;   /* −10..+10 */
          // window.Harlowe isn't exposed for JS writes, so the stat change can't
          // be applied here. Pick a performance bucket from moraleN; the nav block
          // below routes to a Harlowe result passage that applies the (set:).
          // Thresholds tunable here; magnitudes live in Waltz Result Up/Down.
          window._waltzOutcome = (moraleN > 6) ? 'up' : (moraleN < -6) ? 'down' : 'neutral';
          window._dssWaltzReport = { kept: kept, clean: clean, total: total, outcome: window._waltzOutcome, at: Date.now() }; /* 2026-10-29: read on Approach O'Flatterly */
        } catch (e) {}
        /* Waltz lands → apply the performance result in Harlowe, then land at
           O'Flatterly's shop. Route by bucket (window._waltzOutcome): the Up/Down
           result passages apply the (set:) and forward; neutral goes straight on.
           window.Engine isn't exposed, so navigate by clicking the matching hidden
           link (display:none, so the player never sees it). */
        /* 2026-10-28 (Sam: "Easier each retry"): a waltz that went badly offers TRY AGAIN (a gentler one, the page entered afresh) or MOVE ON (the result as before) */
        if (window._waltzOutcome === 'down' && window.dssEase) {
          window.dssEase.lost('waltz');
          setTimeout(function(){
            if (!canvas.isConnected) return;
            function go(id){ var h = document.getElementById(id), l = h && h.querySelector('tw-link'); if (l) ['mousedown','mouseup','click'].forEach(function(t){ l.dispatchEvent(new MouseEvent(t, { bubbles: true })); }); }
            window.dssEase.offer(canvas.parentElement, { onAgain: function(){ go('waltz-again'); }, onMove: function(){ go('waltz-down'); } });
          }, 700);
        } else
        setTimeout(function(){
          var outcome = window._waltzOutcome || 'neutral';
          var id = (outcome === 'up') ? 'waltz-up' : (outcome === 'down') ? 'waltz-down' : 'waltz-onward';
          var holder = document.getElementById(id);
          var link = holder && holder.querySelector('tw-link');
          if (link) ['mousedown','mouseup','click'].forEach(function(t){
            link.dispatchEvent(new MouseEvent(t, { bubbles: true }));
          });
        }, 700);
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};((window._dssWaltzCarry && performance.now()-window._dssWaltzCarry.at<4000)?function(o){o.onPlay(); /* 2026-10-31 (Sam, playtest note 14: "do you ever get instructions on how the game works?"): not on the way in from Watkins, where the rules card is skipped so the music carries on; the rule now sits over the canvas through the six-second intro instead */ var cv=document.getElementById('waltz-canvas'); if(cv){var hw=document.createElement('div'); hw.className='waltz-howto'; hw.innerHTML=o.lines[0]; cv.parentNode.insertBefore(hw,cv); setTimeout(function(){hw.classList.add('waltz-howto-out');},6200); setTimeout(function(){if(hw.parentNode)hw.parentNode.removeChild(hw);},7600);}}:(window.dssShowMinigameRules||function(o){o.onPlay()}))({key:'waltz',play:'Take this waltz',title:'CECIL COURT WALTZ',lines:[((window.matchMedia&&window.matchMedia('(hover: none) and (pointer: coarse)').matches)?"Tap the lanes":"Press &larr; &darr; &rarr; or A&nbsp;S&nbsp;D, or tap the lanes,")+" as each note reaches the line."],onPlay:__boot});})();
