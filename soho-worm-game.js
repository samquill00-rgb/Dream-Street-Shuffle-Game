/* Soho Square's municipal pest-control game. Mounted by the Twee passage. */
(function () {
  'use strict';
  var root = document.querySelector('tw-passage:last-of-type #dss-worm-game');
  if (!root || root.dataset.mounted) return;
  root.dataset.mounted = 'yes';
  var holes = Array.from(root.querySelectorAll('.worm-hole'));
  var score = 0, elapsed = 0, nextSpawn = 0, running = false, ended = false;
  var last = 0, frame = 0, audio;
  var status = root.querySelector('.worm-status'), start = root.querySelector('.worm-start');
  var scoreLabel = root.querySelector('.worm-score'), timeLabel = root.querySelector('.worm-time');
  var active = holes.map(function () { return 0; });
  function sound(hit) {
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      var o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime;
      o.type = 'sine'; o.frequency.setValueAtTime(hit ? 380 : 110, t);
      o.frequency.exponentialRampToValueAtTime(hit ? 130 : 65, t + .12);
      g.gain.setValueAtTime(.045, t); g.gain.exponentialRampToValueAtTime(.001, t + .15);
      o.connect(g); g.connect(audio.destination); o.start(t); o.stop(t + .16);
    } catch (_) {}
  }
  function hide(i) { active[i] = 0; holes[i].classList.remove('up'); holes[i].setAttribute('aria-label', 'Hole ' + (i + 1) + ': empty'); }
  function hit(i) {
    if (!running || document.hidden) return;
    if (active[i] > elapsed) {
      hide(i); score++; scoreLabel.textContent = score;
      holes[i].classList.remove('struck'); void holes[i].offsetWidth; holes[i].classList.add('struck');
      sound(true);
    } else sound(false);
  }
  function finish() {
    running = false; ended = true; cancelAnimationFrame(frame); active.forEach(function (_, i) { hide(i); });
    var won = score >= 18;
    status.textContent = won ? 'GLORY!' : 'LA PETITE MORT!';
    status.classList.add(won ? 'worm-win' : 'worm-loss');
    root.querySelector('.worm-tally').textContent = score + ' worms sent back to Soho Square.';
    var target = root.querySelector('[data-outcome="' + (won ? (score >= 28 ? 'excellent' : 'win') : 'loss') + '"] tw-link');
    if (target) target.click();
    root.querySelector('.worm-payment').classList.add('revealed');
    cleanup();
  }
  function tick(now) {
    if (!root.isConnected) { cleanup(); return; }
    var dt = Math.min(100, now - last); last = now;
    if (!document.hidden) {
      elapsed += dt; timeLabel.textContent = Math.ceil(Math.max(0, 30000 - elapsed) / 1000);
      active.forEach(function (until, i) { if (until && until <= elapsed) hide(i); });
      if (elapsed >= 30000) { finish(); return; }
      if (elapsed >= nextSpawn) {
        var empty = active.map(function (v, i) { return v ? -1 : i; }).filter(function (i) { return i >= 0; });
        if (empty.length) {
          var i = empty[Math.floor(Math.random() * empty.length)];
          active[i] = elapsed + 1450 - 600 * elapsed / 30000;
          holes[i].classList.remove('struck'); holes[i].classList.add('up');
          holes[i].setAttribute('aria-label', 'Hole ' + (i + 1) + ': hit the worm');
        }
        nextSpawn = elapsed + 850 - 420 * elapsed / 30000;
      }
    }
    frame = requestAnimationFrame(tick);
  }
  function key(e) {
    if (!running || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^[1-6]$/.test(e.key)) { e.preventDefault(); hit(Number(e.key) - 1); }
  }
  function cleanup() {
    running = false; cancelAnimationFrame(frame); document.removeEventListener('keydown', key);
    observer.disconnect(); if (audio) { audio.close().catch(function () {}); audio = null; }
  }
  holes.forEach(function (hole, i) { hole.addEventListener('click', function () { hit(i); }); });
  start.addEventListener('click', function () {
    if (running || ended) return;
    running = true; start.hidden = true; status.textContent = 'Keep the worms out.';
    document.addEventListener('keydown', key); last = performance.now(); frame = requestAnimationFrame(tick);
  });
  var observer = new MutationObserver(function () { if (!root.isConnected) cleanup(); });
  observer.observe(root.parentNode.parentNode, { childList: true, subtree: true });
})();
