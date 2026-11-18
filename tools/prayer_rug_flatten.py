"""The rug photo -> a flat, square-on texture with its fringe, the floor keyed out. blender -b --python rugwarp.py -- photo.jpg out-dir"""
import bpy, sys, numpy as np
src, outdir = sys.argv[sys.argv.index('--') + 1:][:2]
im = bpy.data.images.load(src); w, h = im.size
S = np.array(im.pixels[:], np.float32).reshape(h, w, 4)[::-1, :, :3]
TL, TR, BR, BL = (193, 41), (744, 33), (940, 1074), (11, 1082)     # the woven corners, found by keying the floor (rugprobe3.py)
# the rug's true proportions from the one view (Zhang's rectangle method, principal point at the centre)
m1, m2, m3, m4 = [np.array([x, y, 1.0]) for x, y in (TL, TR, BL, BR)]
k2 = np.dot(np.cross(m1, m4), m3) / np.dot(np.cross(m2, m4), m3); k3 = np.dot(np.cross(m1, m4), m2) / np.dot(np.cross(m3, m4), m2)
n2 = k2 * m2 - m1; n3 = k3 * m3 - m1; u0, v0 = w / 2, h / 2
f2 = -((n2[0] * n3[0] - (n2[0] * n3[2] + n2[2] * n3[0]) * u0 + n2[2] * n3[2] * u0 * u0) + (n2[1] * n3[1] - (n2[1] * n3[2] + n2[2] * n3[1]) * v0 + n2[2] * n3[2] * v0 * v0)) / (n2[2] * n3[2])
K = np.array([[np.sqrt(abs(f2)), 0, u0], [0, np.sqrt(abs(f2)), v0], [0, 0, 1]]); A = np.linalg.inv(K @ K.T)
ratio = np.sqrt((n3 @ A @ n3) / (n2 @ A @ n2))   # length over width
print('focal %.0f px, length/width %.3f' % (np.sqrt(abs(f2)), ratio))
ratio = float(np.clip(ratio, 1.45, 2.0))
# homography: unit square (u across, v down) -> photo
def hom(src_pts, dst_pts):
    M = []
    for (x, y), (X, Y) in zip(src_pts, dst_pts):
        M.append([x, y, 1, 0, 0, 0, -X * x, -X * y, -X]); M.append([0, 0, 0, x, y, 1, -Y * x, -Y * y, -Y])
    _, _, V = np.linalg.svd(np.array(M)); return V[-1].reshape(3, 3)
H = hom([(0, 0), (1, 0), (1, 1), (0, 1)], [TL, TR, BR, BL])
MX, MT, MB = 0.012, 0.035, 0.035        # margins: a little past the sides, the fringe at each end
W_ = 1024; H_ = int(round(W_ * ratio * (1 + MT + MB) / (1 + 2 * MX) / 8) * 8)
u = (np.arange(W_) + 0.5) / W_ * (1 + 2 * MX) - MX; v = (np.arange(H_) + 0.5) / H_ * (1 + MT + MB) - MT
U, V = np.meshgrid(u, v); P = np.stack([U, V, np.ones_like(U)], -1) @ H.T; X = P[..., 0] / P[..., 2]; Y = P[..., 1] / P[..., 2]
def sample(img, X, Y):
    x0 = np.clip(np.floor(X).astype(int), 0, img.shape[1] - 2); y0 = np.clip(np.floor(Y).astype(int), 0, img.shape[0] - 2); fx = np.clip(X - x0, 0, 1)[..., None]; fy = np.clip(Y - y0, 0, 1)[..., None]
    return (img[y0, x0] * (1 - fx) + img[y0, x0 + 1] * fx) * (1 - fy) + (img[y0 + 1, x0] * (1 - fx) + img[y0 + 1, x0 + 1] * fx) * fy
C = sample(S, X, Y)
R_, G_, B_ = C[..., 0] * 255, C[..., 1] * 255, C[..., 2] * 255
floor = (R_ > 165) & (G_ > 115) & (B_ > 80) & (R_ - G_ < 62) & (G_ - B_ > 18) & (G_ - B_ < 70)
inside = (U > 0.004) & (U < 0.996) & (V > 0.003) & (V < 0.997)
alpha = (~floor | inside).astype(np.float32)
alpha[(U < -0.002) | (U > 1.002)] = 0
alpha[(X < 1) | (X > w - 2) | (Y < 1) | (Y > h - 2)] = 0          # nothing from past the photo's own edges                      # nothing past the woven sides (the photo's shadow there)
# soften by one pixel
alpha = (alpha * 4 + np.roll(alpha, 1, 0) + np.roll(alpha, -1, 0) + np.roll(alpha, 1, 1) + np.roll(alpha, -1, 1)) / 8
# the photo's light falls off toward the top: even the rug's brightness out along its length (body only)
lum = C.mean(2); rows = np.array([np.median(lum[i][inside[i]]) if inside[i].any() else np.nan for i in range(H_)])
ok = ~np.isnan(rows); idx = np.arange(H_); fit = np.polyval(np.polyfit(idx[ok], rows[ok], 2), idx); gain = np.clip(np.nanmedian(rows) / fit, 0.8, 1.25)
C = np.clip(C * gain[:, None, None], 0, 1)
def save(arr, path, fmt, q=None):     # raw bytes; tools Pillow writes the file (Blender's own save runs its colour transform)
    a = np.clip(np.round(arr * 255), 0, 255).astype(np.uint8); open(path + '.raw', 'wb').write(a.tobytes()); open(path + '.size', 'w').write('%d %d %s %s' % (a.shape[1], a.shape[0], 'RGB' if a.ndim == 3 else 'L', q or ''))
save(C, outdir + '/prayer-rug.jpg', 'JPEG', 86); save(alpha, outdir + '/prayer-rug-a.png', 'PNG')
print('WROTE %dx%d, body length/width %.3f, margins x %.3f top %.3f bottom %.3f, gain %.2f..%.2f' % (W_, H_, ratio, MX, MT, MB, gain.min(), gain.max()))
