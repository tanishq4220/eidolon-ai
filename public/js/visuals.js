/**
 * Eidolon AI - Spectral Visuals & Particle Simulation
 * Animates floating ethereal spirit orbs and falling Día de los Muertos marigold petals.
 */

class SpectralCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.petals = [];
    this.mouse = { x: -1000, y: -1000 };

    this._resize();
    this._initParticles();
    this._bindEvents();
    this._animate();
  }

  _resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  _initParticles() {
    this.particles = [];
    this.petals = [];

    // Spectral Orbs (rising up)
    const orbCount = Math.min(45, Math.floor(window.innerWidth / 30));
    for (let i = 0; i < orbCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2.2 + 0.8,
        speedY: -(Math.random() * 0.45 + 0.15),
        speedX: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.5 ? '#00FF88' : '#A855F7'
      });
    }

    // Marigold Petals (drifting down slowly)
    const petalCount = Math.min(25, Math.floor(window.innerWidth / 50));
    for (let i = 0; i < petalCount; i++) {
      this.petals.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 5 + 3,
        speedY: Math.random() * 0.5 + 0.2,
        speedX: Math.sin(Math.random() * Math.PI) * 0.4,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.02,
        color: Math.random() > 0.3 ? '#FF9900' : '#FFCC00'
      });
    }
  }

  _bindEvents() {
    window.addEventListener('resize', () => {
      this._resize();
      this._initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  _animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw & Update Spectral Orbs
    for (const p of this.particles) {
      p.y += p.speedY;
      p.x += p.speedX;

      // Mouse gentle repulsion
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        p.x += (dx / dist) * force * 1.5;
        p.y += (dy / dist) * force * 1.5;
      }

      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 2. Draw & Update Marigold Petals (Día de los Muertos)
    for (const pet of this.petals) {
      pet.y += pet.speedY;
      pet.x += pet.speedX + Math.sin(pet.y * 0.02) * 0.3;
      pet.angle += pet.angleSpeed;

      if (pet.y > this.height + 10) {
        pet.y = -10;
        pet.x = Math.random() * this.width;
      }

      this.ctx.save();
      this.ctx.translate(pet.x, pet.y);
      this.ctx.rotate(pet.angle);
      this.ctx.fillStyle = pet.color;
      this.ctx.globalAlpha = 0.55;
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, pet.size, pet.size * 0.5, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    requestAnimationFrame(() => this._animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.SpectralSim = new SpectralCanvas('particleCanvas');
});
