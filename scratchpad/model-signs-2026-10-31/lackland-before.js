var modelCardTex = makeCanvasTexture(512, 192, function(cx, w, h) {
cx.fillStyle = '#ece6d4'; cx.fillRect(0, 0, w, h);
cx.fillStyle = 'rgba(120, 100, 60, 0.10)'; cx.fillRect(0, h - 28, w, 28);
cx.fillStyle = 'rgba(240, 236, 220, 0.55)'; cx.fillRect(w * 0.36, 0, w * 0.28, 24);
cx.fillStyle = '#9a1c22'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
cx.font = 'italic 600 68px Georgia'; cx.fillText('Model', w / 2, h * 0.42);
cx.fillStyle = '#26306a'; cx.font = '36px Georgia'; cx.fillText('2nd FLOOR', w / 2, h * 0.78);
});
