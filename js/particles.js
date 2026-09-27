/**
 * Romantic Particle & Confetti Canvas Engine
 * Renders floating petals, glowing hearts, cursor sparkle trails, and fireworks.
 */
class RomanticParticles {
  constructor(canvasId = 'particle-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.trailParticles = [];
    this.confettiParticles = [];
    this.width = 0;
    this.height = 0;
    this.animationFrame = null;
    this.theme = 'sakura'; // 'sakura' or 'hearts'
    this.mouseX = -100;
    this.mouseY = -100;
    this.lastSparkleTime = 0;

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse & Touch movement sparkle trail
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.addSparkle(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.mouseX = e.touches[0].clientX;
        this.mouseY = e.touches[0].clientY;
        this.addSparkle(this.mouseX, this.mouseY);
      }
    }, { passive: true });

    this.initBackgroundParticles();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  initBackgroundParticles() {
    this.particles = [];
    const count = Math.min(Math.floor(this.width / 35), 45); // Responsive count
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(true));
    }
  }

  createParticle(randomY = false) {
    const isPetal = this.theme === 'sakura' ? Math.random() > 0.3 : Math.random() > 0.7;
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -30,
      size: Math.random() * 12 + 8,
      speedX: (Math.random() - 0.5) * 1.2 + 0.6,
      speedY: Math.random() * 1.4 + 0.8,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      oscillation: Math.random() * Math.PI * 2,
      oscSpeed: Math.random() * 0.02 + 0.01,
      opacity: Math.random() * 0.4 + 0.5,
      type: isPetal ? 'petal' : 'heart',
      color: isPetal
        ? ['#bae6fd', '#7dd3fc', '#38bdf8', '#e0f2fe'][Math.floor(Math.random() * 4)]
        : ['#0284c7', '#0ea5e9', '#38bdf8', '#60a5fa'][Math.floor(Math.random() * 4)]
    };
  }

  addSparkle(x, y) {
    const now = performance.now();
    if (now - this.lastSparkleTime < 35) return; // Throttle sparkles
    this.lastSparkleTime = now;

    for (let i = 0; i < 2; i++) {
      this.trailParticles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        size: Math.random() * 8 + 4,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5 - 0.5,
        life: 1.0,
        decay: Math.random() * 0.03 + 0.02,
        color: ['#38bdf8', '#bae6fd', '#ffd166', '#ffffff'][Math.floor(Math.random() * 4)],
        isHeart: Math.random() > 0.5
      });
    }

    if (this.trailParticles.length > 50) {
      this.trailParticles.shift();
    }
  }

  // Celebration Fireworks / Confetti explosion
  burstConfetti(originX = this.width / 2, originY = this.height / 2, count = 100) {
    const colors = ['#0284c7', '#38bdf8', '#00b4d8', '#6366f1', '#ffd166', '#06d6a0', '#93c5fd'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      this.confettiParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: Math.random() * 10 + 6,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 15,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
        decay: Math.random() * 0.012 + 0.008,
        gravity: 0.22,
        isHeart: Math.random() > 0.4
      });
    }
  }

  drawHeart(ctx, x, y, size, color, opacity, rotation = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.beginPath();
    const d = size;
    ctx.moveTo(0, d / 4);
    ctx.bezierCurveTo(-d / 2, -d / 3, -d, d / 3, 0, d);
    ctx.bezierCurveTo(d, d / 3, d / 2, -d / 3, 0, d / 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawPetal(ctx, x, y, size, color, opacity, rotation = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.8, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawSparkle(ctx, x, y, size, color, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.beginPath();
    // 4-point glittering star
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(0, 0, size, 0);
    ctx.quadraticCurveTo(0, 0, 0, size);
    ctx.quadraticCurveTo(0, 0, -size, 0);
    ctx.quadraticCurveTo(0, 0, 0, -size);
    ctx.fill();
    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render Background Floating Petals & Hearts
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.oscillation += p.oscSpeed;
      p.x += Math.sin(p.oscillation) * 0.8 + p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;

      if (p.type === 'heart') {
        this.drawHeart(this.ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
      } else {
        this.drawPetal(this.ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
      }

      // Recycle when offscreen
      if (p.y > this.height + 40 || p.x > this.width + 40 || p.x < -40) {
        this.particles[i] = this.createParticle(false);
      }
    }

    // 2. Render Trail Particles (Sparkles from cursor)
    for (let i = this.trailParticles.length - 1; i >= 0; i--) {
      const t = this.trailParticles[i];
      t.x += t.speedX;
      t.y += t.speedY;
      t.life -= t.decay;

      if (t.life <= 0) {
        this.trailParticles.splice(i, 1);
        continue;
      }

      if (t.isHeart) {
        this.drawHeart(this.ctx, t.x, t.y, t.size * t.life, t.color, t.life * 0.8);
      } else {
        this.drawSparkle(this.ctx, t.x, t.y, t.size * t.life, t.color, t.life * 0.9);
      }
    }

    // 3. Render Confetti & Fireworks
    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const c = this.confettiParticles[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.rotation += c.rotSpeed;
      c.life -= c.decay;

      if (c.life <= 0 || c.y > this.height + 50) {
        this.confettiParticles.splice(i, 1);
        continue;
      }

      if (c.isHeart) {
        this.drawHeart(this.ctx, c.x, c.y, c.size, c.color, c.life, (c.rotation * Math.PI) / 180);
      } else {
        this.ctx.save();
        this.ctx.translate(c.x, c.y);
        this.ctx.rotate((c.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = c.life;
        this.ctx.fillStyle = c.color;
        this.ctx.fillRect(-c.size / 2, -c.size / 3, c.size, c.size * 0.6);
        this.ctx.restore();
      }
    }

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  setTheme(theme) {
    this.theme = theme;
    this.initBackgroundParticles();
  }
}

window.romanticParticles = null;
window.addEventListener('DOMContentLoaded', () => {
  window.romanticParticles = new RomanticParticles('particle-canvas');
});
