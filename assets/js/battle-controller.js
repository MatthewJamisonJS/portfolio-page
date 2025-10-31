/* ============================================================================
   EPIC POKEMON BATTLE - CONTROLLER
   Orchestrates 12-second continuous battle choreography
   ============================================================================ */

/**
 * BattleController - manages attack sequences, timing, and Pokemon reactions
 */
class BattleController {
    constructor() {
        this.active = false;
        this.particleSystem = null;
        this.currentPhase = 0;
        this.attackTimers = [];
        this.loopTimer = null;

        // Pokemon sprite references
        this.pokemon = {
            // Left side (back sprites)
            pikachu: { element: null, type: 'electric', side: 'left' },
            jolteon: { element: null, type: 'electric', side: 'left' },
            magneton: { element: null, type: 'electric', side: 'left' },
            electabuzz: { element: null, type: 'electric', side: 'left' },
            blastoise: { element: null, type: 'water', side: 'left' },
            gengar: { element: null, type: 'ghost', side: 'left' },

            // Right side (front sprites)
            charizard: { element: null, type: 'fire', side: 'right' },
            moltres: { element: null, type: 'fire', side: 'right' },
            dragonite: { element: null, type: 'flying', side: 'right' },
            pidgeot: { element: null, type: 'flying', side: 'right' },
            aerodactyl: { element: null, type: 'flying', side: 'right' },
            articuno: { element: null, type: 'ice', side: 'right' },
            zapdos: { element: null, type: 'electric', side: 'right' }
        };

        // SVG path references for attacks
        this.attackPaths = {};

        // 12-second battle timeline
        this.battleTimeline = this.createBattleTimeline();
    }

    /**
     * Initialize particle system and cache Pokemon sprite references
     */
    init() {
        // Initialize particle system
        this.particleSystem = new ParticleSystem('battle-particle-canvas');

        // Cache Pokemon sprite elements
        Object.keys(this.pokemon).forEach(name => {
            const element = document.querySelector(`.pokemon-battle.${name}`);
            if (element) {
                this.pokemon[name].element = element;
                // Add type and side classes for CSS animations
                element.classList.add(this.pokemon[name].type);
                element.classList.add(this.pokemon[name].side + '-side');
            }
        });

        // Cache attack path elements
        this.cacheAttackPaths();

        console.log('🎮 Battle Controller initialized');
    }

    /**
     * Cache SVG attack path elements
     */
    cacheAttackPaths() {
        const bolts = document.querySelectorAll('.lightning-bolt');
        const streams = document.querySelectorAll('.water-stream');
        const flames = document.querySelectorAll('.fire-breath');
        const beams = document.querySelectorAll('.ice-beam');

        bolts.forEach((bolt, i) => {
            this.attackPaths[`bolt-${i + 1}`] = bolt;
        });

        streams.forEach((stream, i) => {
            this.attackPaths[`stream-${i + 1}`] = stream;
        });

        flames.forEach((flame, i) => {
            this.attackPaths[`flame-${i + 1}`] = flame;
        });

        beams.forEach((beam, i) => {
            this.attackPaths[`beam-${i + 1}`] = beam;
        });
    }

    /**
     * Create the 12-second battle choreography timeline
     */
    createBattleTimeline() {
        return [
            // PHASE 1 (0-2s): Left Side Attacks
            { time: 0,    attacker: 'pikachu',   target: 'charizard', type: 'electric', duration: 900,  particles: 30 },
            { time: 600,  attacker: 'jolteon',   target: 'moltres',   type: 'electric', duration: 900,  particles: 30 },
            { time: 1200, attacker: 'blastoise', target: 'dragonite', type: 'water',    duration: 1300, particles: 35 },

            // PHASE 2 (2-4s): Right Side Counterattacks
            { time: 2000, attacker: 'charizard', target: 'pikachu',   type: 'fire',     duration: 1200, particles: 45 },
            { time: 2500, attacker: 'articuno',  target: 'blastoise', type: 'ice',      duration: 1000, particles: 25 },
            { time: 3000, attacker: 'moltres',   target: 'jolteon',   type: 'fire',     duration: 1200, particles: 45 },

            // PHASE 3 (4-6s): Simultaneous Exchange
            { time: 4000, attacker: 'magneton',  target: 'zapdos',    type: 'electric', duration: 1000, particles: 30 },
            { time: 4000, attacker: 'zapdos',    target: 'magneton',  type: 'electric', duration: 1000, particles: 30 },
            { time: 4800, attacker: 'gengar',    target: 'aerodactyl', type: 'ghost',   duration: 1200, particles: 20 },
            { time: 5400, attacker: 'dragonite', target: 'gengar',    type: 'flying',   duration: 800,  particles: 15 },

            // PHASE 4 (6-8s): Right Side Offensive
            { time: 6000, attacker: 'pidgeot',   target: 'electabuzz', type: 'flying',  duration: 800,  particles: 15 },
            { time: 6600, attacker: 'zapdos',    target: 'pikachu',   type: 'electric', duration: 1000, particles: 30 },
            { time: 7200, attacker: 'charizard', target: 'blastoise', type: 'fire',     duration: 1200, particles: 45 },

            // PHASE 5 (8-10s): Left Side Counterattacks
            { time: 8000, attacker: 'electabuzz', target: 'articuno',  type: 'electric', duration: 1000, particles: 30 },
            { time: 8700, attacker: 'pikachu',    target: 'moltres',   type: 'electric', duration: 1100, particles: 30 },
            { time: 8700, attacker: 'jolteon',    target: 'moltres',   type: 'electric', duration: 1100, particles: 30 },
            { time: 9300, attacker: 'gengar',     target: 'zapdos',    type: 'ghost',    duration: 1200, particles: 20 },

            // PHASE 6 (10-12s): EPIC SIMULTANEOUS BARRAGE
            { time: 10500, attacker: 'pikachu',   target: 'charizard',  type: 'electric', duration: 1500, particles: 40, epic: true },
            { time: 10500, attacker: 'jolteon',   target: 'dragonite',  type: 'electric', duration: 1500, particles: 40, epic: true },
            { time: 10500, attacker: 'magneton',  target: 'moltres',    type: 'electric', duration: 1500, particles: 40, epic: true },
            { time: 10500, attacker: 'electabuzz', target: 'pidgeot',   type: 'electric', duration: 1500, particles: 40, epic: true },
            { time: 10500, attacker: 'blastoise', target: 'aerodactyl', type: 'water',    duration: 1500, particles: 50, epic: true },
            { time: 10500, attacker: 'gengar',    target: 'articuno',   type: 'ghost',    duration: 1500, particles: 30, epic: true }
        ];
    }

    /**
     * Start the continuous battle animation
     */
    start() {
        if (this.active) return;

        console.log('⚔️ Battle started!');
        this.active = true;
        document.body.classList.add('battle-mode');

        // Initialize if not already done
        if (!this.particleSystem) {
            this.init();
        }

        // Start the battle loop
        this.runBattleLoop();
    }

    /**
     * Stop all battle animations
     */
    stop() {
        console.log('🛑 Battle stopped');
        this.active = false;
        document.body.classList.remove('battle-mode');

        // Clear all timers
        this.attackTimers.forEach(timer => clearTimeout(timer));
        this.attackTimers = [];

        if (this.loopTimer) {
            clearTimeout(this.loopTimer);
            this.loopTimer = null;
        }

        // Clear particle system
        if (this.particleSystem) {
            this.particleSystem.clear();
        }

        // Clear all Pokemon states
        Object.values(this.pokemon).forEach(p => {
            if (p.element) {
                p.element.removeAttribute('data-charging');
                p.element.removeAttribute('data-attacking');
                p.element.removeAttribute('data-hit');
                p.element.removeAttribute('data-hit-by');
            }
        });
    }

    /**
     * Run a single 12-second battle loop
     */
    runBattleLoop() {
        if (!this.active) return;

        console.log('🔄 Starting battle loop');

        // Schedule all attacks in the timeline
        this.battleTimeline.forEach(attack => {
            const timer = setTimeout(() => {
                if (this.active) {
                    this.executeAttack(attack);
                }
            }, attack.time);

            this.attackTimers.push(timer);
        });

        // Check for Phase 6 (epic finale with screen shake)
        const phase6Timer = setTimeout(() => {
            if (this.active) {
                document.body.setAttribute('data-phase', '6');
                console.log('💥 PHASE 6: EPIC FINALE!');
            }
        }, 10500);
        this.attackTimers.push(phase6Timer);

        // Clear Phase 6 after effects
        const clearPhase6Timer = setTimeout(() => {
            document.body.removeAttribute('data-phase');
        }, 12000);
        this.attackTimers.push(clearPhase6Timer);

        // Loop after 12 seconds
        this.loopTimer = setTimeout(() => {
            if (this.active) {
                this.attackTimers = [];
                this.runBattleLoop();
            }
        }, 12000);
    }

    /**
     * Execute a single attack
     */
    executeAttack(attack) {
        const attacker = this.pokemon[attack.attacker];
        const target = this.pokemon[attack.target];

        if (!attacker || !attacker.element || !target || !target.element) {
            console.warn(`Attack failed: ${attack.attacker} -> ${attack.target}`);
            return;
        }

        console.log(`⚡ ${attack.attacker} attacks ${attack.target} with ${attack.type}!`);

        // Step 1: Energy buildup (0.5s before attack)
        this.energyBuildup(attacker, 500);

        // Step 2: Launch attack after buildup
        setTimeout(() => {
            this.launchAttack(attacker, target, attack);
        }, 500);

        // Step 3: Impact effect
        setTimeout(() => {
            this.impactEffect(target, attack.type, attack.duration - 500);
        }, 500 + attack.duration * 0.7);
    }

    /**
     * Energy buildup animation on attacker
     */
    energyBuildup(attacker, duration) {
        if (!attacker.element) return;

        attacker.element.setAttribute('data-charging', 'true');

        setTimeout(() => {
            attacker.element.removeAttribute('data-charging');
        }, duration);
    }

    /**
     * Launch attack from attacker to target
     */
    launchAttack(attacker, target, attack) {
        if (!attacker.element || !target.element) return;

        // Attacker thrust animation
        attacker.element.setAttribute('data-attacking', 'true');
        setTimeout(() => {
            attacker.element.removeAttribute('data-attacking');
        }, 600);

        // Get positions
        const attackerRect = attacker.element.getBoundingClientRect();
        const targetRect = target.element.getBoundingClientRect();

        // Calculate origin and target positions (center of sprites)
        const originX = attackerRect.left + attackerRect.width / 2;
        const originY = attackerRect.top + attackerRect.height / 2;
        const targetX = targetRect.left + targetRect.width / 2;
        const targetY = targetRect.top + targetRect.height / 2;

        // Emit particles
        if (this.particleSystem && attack.particles) {
            const particleType = this.getParticleType(attack.type);
            this.particleSystem.emit(particleType, originX, originY, targetX, targetY, attack.particles);
        }

        // Trigger CSS animation on corresponding SVG path
        this.animateAttackPath(attack);
    }

    /**
     * Get particle type for attack type
     */
    getParticleType(attackType) {
        const mapping = {
            'electric': 'electric-spark',
            'fire': 'fire-ember',
            'water': 'water-droplet',
            'ice': 'ice-crystal',
            'ghost': 'ghost-wisp',
            'flying': 'electric-spark' // Reuse sparks for air effects
        };
        return mapping[attackType] || 'fire-ember';
    }

    /**
     * Animate SVG attack path
     */
    animateAttackPath(attack) {
        // Find best matching path for this attack type
        let pathClass = '';

        switch (attack.type) {
            case 'electric':
                pathClass = 'lightning-bolt';
                break;
            case 'fire':
                pathClass = 'fire-breath';
                break;
            case 'water':
                pathClass = 'water-stream';
                break;
            case 'ice':
                pathClass = 'ice-beam';
                break;
            default:
                pathClass = 'lightning-bolt';
        }

        // Get all paths of this type and pick one randomly
        const paths = document.querySelectorAll(`.${pathClass}`);
        if (paths.length > 0) {
            const randomPath = paths[Math.floor(Math.random() * paths.length)];

            // Trigger animation by applying appropriate animation class
            const animationClass = `animate-${attack.type}`;
            randomPath.classList.add(animationClass);

            // Remove class after animation completes
            setTimeout(() => {
                randomPath.classList.remove(animationClass);
            }, attack.duration);
        }
    }

    /**
     * Impact effect on target
     */
    impactEffect(target, attackType, duration) {
        if (!target.element) return;

        target.element.setAttribute('data-hit', 'true');
        target.element.setAttribute('data-hit-by', attackType);

        setTimeout(() => {
            target.element.removeAttribute('data-hit');
            target.element.removeAttribute('data-hit-by');
        }, duration);
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBattleSystem);
} else {
    initBattleSystem();
}

function initBattleSystem() {
    console.log('🎮 Initializing Battle System...');

    // Create global battle controller instance
    window.battleController = new BattleController();

    // Find Battle Button (assuming it exists based on context)
    // The button might be added dynamically, so we'll set up a MutationObserver
    const setupBattleButton = () => {
        const battleBtn = document.getElementById('battle-toggle-btn') ||
                         document.querySelector('.battle-toggle') ||
                         document.querySelector('[data-battle-toggle]');

        if (battleBtn) {
            console.log('🎮 Battle button found, attaching listener');

            battleBtn.addEventListener('click', function(e) {
                e.preventDefault();

                if (window.battleController.active) {
                    window.battleController.stop();
                    this.textContent = this.textContent.replace('Stop', 'Start').replace('stop', 'start');
                } else {
                    window.battleController.start();
                    this.textContent = this.textContent.replace('Start', 'Stop').replace('start', 'stop');
                }
            });

            return true;
        }

        return false;
    };

    // Try to setup immediately
    if (!setupBattleButton()) {
        // If button not found, watch for it
        const observer = new MutationObserver((mutations) => {
            if (setupBattleButton()) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// Pause animations when page is hidden (battery saving)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.classList.remove('page-visible');
        if (window.battleController && window.battleController.active) {
            // Pause but don't stop completely
            if (window.battleController.particleSystem) {
                window.battleController.particleSystem.stop();
            }
        }
    } else {
        document.body.classList.add('page-visible');
        if (window.battleController && window.battleController.active) {
            // Resume particles if battle is active
            if (window.battleController.particleSystem) {
                window.battleController.particleSystem.start();
            }
        }
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BattleController;
}
