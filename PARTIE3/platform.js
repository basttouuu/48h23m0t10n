/**
 * Mini-jeu de survie "pare-feu nerveux".
 * Exporté séparément pour alléger le fichier principal.
 */

/**
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLElement} statusEl
 * @param {number} durationSec
 * @param {boolean} hard
 * @param {(won: boolean) => void} done
 */
export function runSurvival(canvas, statusEl, durationSec, hard, done) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const groundY = H - 36;
  const player = { x: W * 0.45, y: groundY - 40, w: 28, h: 40, vy: 0, onGround: true };
  const gravity = 0.65;
  const jump = -11;
  const speed = hard ? 5 : 4;
  const keys = { left: false, right: false, jump: false };

  const hazards = [];
  let elapsed = 0;
  let last = performance.now();
  let ended = false;
  const spawnRate = hard ? 520 : 800;

  function spawn() {
    const roll = Math.random();
    if (roll < 0.45) {
      hazards.push({
        type: "fire",
        x: Math.random() * (W - 24),
        y: -20,
        r: 12 + Math.random() * 8,
        vy: 2.5 + Math.random() * (hard ? 2.5 : 1.5),
      });
    } else {
      hazards.push({
        type: "spike",
        x: Math.random() * (W - 40),
        y: H + 10,
        w: 30,
        h: 22,
        vy: -(2 + Math.random() * (hard ? 2 : 1.2)),
      });
    }
  }

  let nextSpawn = last + spawnRate;

  function onKeyDown(e) {
    if (e.code === "ArrowLeft") keys.left = true;
    if (e.code === "ArrowRight") keys.right = true;
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      keys.jump = true;
    }
  }
  function onKeyUp(e) {
    if (e.code === "ArrowLeft") keys.left = false;
    if (e.code === "ArrowRight") keys.right = false;
    if (e.code === "Space" || e.code === "ArrowUp") keys.jump = false;
  }
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  function loop(ts) {
    if (ended) return;
    const dt = Math.min(32, ts - last);
    last = ts;
    elapsed += dt / 1000;

    if (keys.left) player.x -= (speed * dt) / 16;
    if (keys.right) player.x += (speed * dt) / 16;
    player.x = Math.max(8, Math.min(W - player.w - 8, player.x));

    if (keys.jump && player.onGround) {
      player.vy = jump;
      player.onGround = false;
    }
    player.vy += (gravity * dt) / 16;
    player.y += (player.vy * dt) / 16;
    if (player.y >= groundY - player.h) {
      player.y = groundY - player.h;
      player.vy = 0;
      player.onGround = true;
    }

    if (ts >= nextSpawn) {
      spawn();
      nextSpawn = ts + spawnRate * (0.7 + Math.random() * 0.5);
    }

    for (const h of hazards) {
      h.y += (h.vy * dt) / 16;
    }
    for (let i = hazards.length - 1; i >= 0; i--) {
      const h = hazards[i];
      if (h.type === "fire" && h.y > H + 40) hazards.splice(i, 1);
      if (h.type === "spike" && h.y < -40) hazards.splice(i, 1);
    }

    let hit = false;
    const px = player.x,
      py = player.y,
      pw = player.w,
      ph = player.h;
    for (const h of hazards) {
      if (h.type === "fire") {
        const cx = h.x + h.r,
          cy = h.y + h.r;
        const closestX = Math.max(px, Math.min(cx, px + pw));
        const closestY = Math.max(py, Math.min(cy, py + ph));
        const dx = cx - closestX,
          dy = cy - closestY;
        if (dx * dx + dy * dy < h.r * h.r) hit = true;
      } else {
        if (px < h.x + h.w && px + pw > h.x && py < h.y && py + ph > h.y - h.h) hit = true;
      }
    }

    ctx.fillStyle = "#030504";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = hard ? "#0f1815" : "#1a1a1d";
    ctx.fillRect(0, groundY, W, H - groundY);
    ctx.fillStyle = hard ? "#1f4a3a" : "#94a3b8";
    for (let x = 0; x < W; x += 40) {
      ctx.fillRect(x, groundY, 20, 4);
    }

    for (const h of hazards) {
      if (h.type === "fire") {
        ctx.beginPath();
        ctx.arc(h.x + h.r, h.y + h.r, h.r, 0, Math.PI * 2);
        ctx.fillStyle = "#f97316";
        ctx.fill();
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(h.x + h.r, h.y + h.r, h.r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#64748b";
        ctx.beginPath();
        ctx.moveTo(h.x, h.y);
        ctx.lineTo(h.x + h.w / 2, h.y - h.h);
        ctx.lineTo(h.x + h.w, h.y);
        ctx.fill();
      }
    }

    ctx.fillStyle = hard ? "#6effc9" : "#38bdf8";
    ctx.fillRect(player.x, player.y, player.w, player.h);

    const left = Math.max(0, durationSec - elapsed);
    statusEl.textContent = hit ? "Touché — tu as perdu." : `Temps : ${left.toFixed(1)} s`;

    if (hit) {
      ended = true;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      done(false);
      return;
    }
    if (elapsed >= durationSec) {
      ended = true;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      statusEl.textContent = "Séquence survécue. Accès rétabli.";
      done(true);
      return;
    }
    requestAnimationFrame(loop);
  }

