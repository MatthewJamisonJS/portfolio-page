/* ============================================================================
   EPIC POKEMON BATTLE - PARTICLE SYSTEM
   Canvas-based particle effects for fire embers, water droplets, ice crystals
   ============================================================================ */

/**
 * Particle class - represents a single particle (ember, droplet, crystal, spark)
 */
class Particle {
    constructor(config) {
        this.type = config.type;
        this.x = config.x;
        this.y = config.y;
        this.vx = config.vx || 0;
        this.vy = config.vy || 0;
        this.life = config.life || 1.0;
        this.maxLife = config.life || 1.0;
        this.size = config.size || 3;
        this.color = config.color || '#ffffff';
        this.gravity = config.gravity !== undefined ? config.gravity : 0.1;
        this.alpha = 1.0;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    }

    update(deltaTime) {
        // Apply velocity
        this.x += this.vx * deltaTime / 16;
        this.y += this.vy * deltaTime / 16;

        // Apply gravity
        this.vy += this.gravity * deltaTime / 16;

        // Apply rotation
        this.rotation += this.rotationSpeed;

        // Decrease life
        this.life -= deltaTime / 1000;

        // Calculate alpha based on remaining life
        this.alpha = Math.max(0, this.life / this.maxLife);

        return this.life > 0;
    }

    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        switch (this.type) {
            case 'fire-ember':
                this.renderFireEmber(ctx);
                break;
            case 'water-droplet':
                this.renderWaterDroplet(ctx);
                break;
            case 'ice-crystal':
                this.renderIceCrystal(ctx);
                break;
            case 'electric-spark':
                this.renderElectricSpark(ctx);
                break;
            case 'ghost-wisp':
                this.renderGhostWisp(ctx);
                break;
            default:
                this.renderDefault(ctx);
        }

        ctx.restore();
    }

    renderFireEmber(ctx) {
        // Gradient from white hot center to orange/red edges
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, '#ffeb3b');
        gradient.addColorStop(0.6, '#ff6b00');
        gradient.addColorStop(1, '#f44336');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = '#ff6b00';
        ctx.fill();
    }

    renderWaterDroplet(ctx) {
        // Blue droplet with white highlight
        const gradient = ctx.createRadialGradient(-this.size * 0.3, -this.size * 0.3, 0, 0, 0, this.size);
        gradient.addColorStop(0, '#e3f2fd');
        gradient.addColorStop(0.4, '#03a9f4');
        gradient.addColorStop(1, '#1976d2');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow
        ctx.shadowBlur = this.size;
        ctx.shadowColor = '#03a9f4';
        ctx.fill();
    }

    renderIceCrystal(ctx) {
        // Hexagonal ice crystal
        ctx.strokeStyle = '#b3e5fc';
        ctx.fillStyle = 'rgba(179, 229, 252, 0.6)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = Math.cos(angle) * this.size;
            const y = Math.sin(angle) * this.size;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Inner star
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -this.size * 0.5);
        ctx.moveTo(0, 0);
        ctx.lineTo(this.size * 0.43, -this.size * 0.25);
        ctx.moveTo(0, 0);
        ctx.lineTo(this.size * 0.43, this.size * 0.25);
        ctx.stroke();

        // Glow
        ctx.shadowBlur = this.size * 1.5;
        ctx.shadowColor = '#b3e5fc';
        ctx.stroke();
    }

    renderElectricSpark(ctx) {
        // Jagged electric spark
        ctx.strokeStyle = '#ffeb3b';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        const segments = 4;
        ctx.beginPath();
        ctx.moveTo(-this.size, 0);
        for (let i = 1; i <= segments; i++) {
            const x = (-this.size + (this.size * 2 * i / segments));
            const y = (Math.random() - 0.5) * this.size * 0.8;
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Bright glow
        ctx.shadowBlur = this.size * 3;
        ctx.shadowColor = '#ffeb3b';
        ctx.stroke();
    }

    renderGhostWisp(ctx) {
        // Purple ethereal wisp with blur
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 1.5);
        gradient.addColorStop(0, 'rgba(156, 39, 176, 0.8)');
        gradient.addColorStop(0.5, 'rgba(156, 39, 176, 0.4)');
        gradient.addColorStop(1, 'rgba(26, 26, 26, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Extra blur for ghostly effect
        ctx.shadowBlur = this.size * 4;
        ctx.shadowColor = '#9c27b0';
        ctx.fill();
    }

    renderDefault(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * ParticleSystem - manages all particles and Canvas rendering
 */
class ParticleSystem {
    constructor(canvasId = 'battle-particle-canvas') {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas element #${canvasId} not found`);
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particlePool = [];
        this.running = false;
        this.lastTime = 0;
        this.isLowEnd = this.detectLowEnd();

        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    detectLowEnd() {
        // Detect low-end devices
        const isMobile = /Mobile|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
        const hasLowConcurrency = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        return isMobile || hasLowConcurrency;
    }

    /**
     * Emit particles from origin point to target
     */
    emit(type, originX, originY, targetX, targetY, count) {
        // Reduce particle count on low-end devices
        if (this.isLowEnd) {
            count = Math.floor(count * 0.4);
        }

        const config = this.getParticleConfig(type);

        for (let i = 0; i < count; i++) {
            const particle = this.getParticleFromPool();

            // Calculate direction from origin to target
            const dx = targetX - originX;
            const dy = targetY - originY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);

            // Add some randomness to particle position and velocity
            const spreadAngle = (Math.random() - 0.5) * config.spread;
            const speed = config.speed * (0.7 + Math.random() * 0.6);

            particle.type = type;
            particle.x = originX + (Math.random() - 0.5) * 20;
            particle.y = originY + (Math.random() - 0.5) * 20;
            particle.vx = Math.cos(angle + spreadAngle) * speed;
            particle.vy = Math.sin(angle + spreadAngle) * speed;
            particle.life = config.life * (0.8 + Math.random() * 0.4);
            particle.maxLife = particle.life;
            particle.size = config.size * (0.7 + Math.random() * 0.6);
            particle.gravity = config.gravity;
            particle.alpha = 1.0;
            particle.rotation = Math.random() * Math.PI * 2;
            particle.rotationSpeed = (Math.random() - 0.5) * 0.2;

            this.particles.push(particle);
        }

        if (!this.running) {
            this.start();
        }
    }

    getParticleConfig(type) {
        const configs = {
            'fire-ember': {
                speed: 2,
                spread: Math.PI / 4,
                life: 1200,
                size: 4,
                gravity: -0.15
            },
            'water-droplet': {
                speed: 4,
                spread: Math.PI / 3,
                life: 800,
                size: 3,
                gravity: 0.2
            },
            'ice-crystal': {
                speed: 3,
                spread: Math.PI / 6,
                life: 1000,
                size: 3.5,
                gravity: 0.05
            },
            'electric-spark': {
                speed: 6,
                spread: Math.PI / 2,
                life: 400,
                size: 4,
                gravity: 0
            },
            'ghost-wisp': {
                speed: 1.5,
                spread: Math.PI / 4,
                life: 1500,
                size: 5,
                gravity: -0.05
            }
        };

        return configs[type] || configs['fire-ember'];
    }

    getParticleFromPool() {
        if (this.particlePool.length > 0) {
            return this.particlePool.pop();
        }
        return new Particle({ type: 'default', x: 0, y: 0 });
    }

    releaseParticleToPool(particle) {
        if (this.particlePool.length < 500) {
            this.particlePool.push(particle);
        }
    }

    update(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Update all particles
        this.particles = this.particles.filter(particle => {
            const alive = particle.update(deltaTime);
            if (!alive) {
                this.releaseParticleToPool(particle);
            }
            return alive;
        });
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render all particles
        this.particles.forEach(particle => {
            particle.render(this.ctx);
        });
    }

    animate(currentTime) {
        if (!this.running) return;

        this.update(currentTime);
        this.render();

        if (this.particles.length > 0) {
            requestAnimationFrame((time) => this.animate(time));
        } else {
            this.running = false;
        }
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.animate(time));
    }

    stop() {
        this.running = false;
    }

    clear() {
        this.particles.forEach(p => this.releaseParticleToPool(p));
        this.particles = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.stop();
    }
}

// Export for use in battle-controller.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleSystem;
}
