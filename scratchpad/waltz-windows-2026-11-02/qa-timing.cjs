const assert=require("node:assert/strict");var window={};
  var BPM = 90;
  var EZ = window.dssEase ? window.dssEase.level('waltz') : 0; /* 2026-10-28 (dssEase): lost waltzes widen the next one's timing; the music's tempo stays */
  var WIN_MS = 220 + EZ * 45, ZONE = 1 + EZ * 0.25;
  var BEAT_MS = 60000 / BPM;        /* 666.67 */
  var BAR_MS  = BEAT_MS * 3;        /* 2000 */
  var TOTAL_MS = BAR_MS * 18;       /* 36000: count-in, then a full approach before the first step */


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


var APPROACH_MS=BAR_MS;var countdownEnd=BAR_MS * 4;
const first=notes[0].beatIdx*BEAT_MS,last=notes.at(-1).beatIdx*BEAT_MS;assert(first-APPROACH_MS>=countdownEnd-0.001);assert(first-WIN_MS>countdownEnd);assert(last+WIN_MS<TOTAL_MS);console.log(JSON.stringify({countdownEnd,firstVisible:first-APPROACH_MS,firstHit:first,earliestPress:first-WIN_MS,lastHit:last,total:TOTAL_MS}));
