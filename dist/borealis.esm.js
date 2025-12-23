/**
 * Borealis - Interactive Animated Background
 * @version 1.0.1
 * @license MIT
 */
/**
 * Borealis - Interactive Animated Background
 * A canvas-based particle animation system with noise patterns and effects
 * 
 * @author Borealis
 * @version 1.0.0
 */

class SimplexNoise {
    constructor(seed = Math.random()) {
        this.p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) this.p[i] = i;
        
        for (let i = 255; i > 0; i--) {
            seed = (seed * 16807) % 2147483647;
            const j = seed % (i + 1);
            [this.p[i], this.p[j]] = [this.p[j], this.p[i]];
        }
        
        this.perm = new Uint8Array(512);
        for (let i = 0; i < 512; i++) this.perm[i] = this.p[i & 255];
    }

    noise2D(x, y) {
        const F2 = 0.5 * (Math.sqrt(3) - 1);
        const G2 = (3 - Math.sqrt(3)) / 6;
        
        const s = (x + y) * F2;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = x - X0;
        const y0 = y - Y0;
        
        const i1 = x0 > y0 ? 1 : 0;
        const j1 = x0 > y0 ? 0 : 1;
        
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1 + 2 * G2;
        const y2 = y0 - 1 + 2 * G2;
        
        const ii = i & 255;
        const jj = j & 255;
        
        const grad = (hash, x, y) => {
            const h = hash & 7;
            const u = h < 4 ? x : y;
            const v = h < 4 ? y : x;
            return ((h & 1) ? -u : u) + ((h & 2) ? -2 * v : 2 * v);
        };
        
        let n0 = 0, n1 = 0, n2 = 0;
        
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
            t0 *= t0;
            n0 = t0 * t0 * grad(this.perm[ii + this.perm[jj]], x0, y0);
        }
        
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
            t1 *= t1;
            n1 = t1 * t1 * grad(this.perm[ii + i1 + this.perm[jj + j1]], x1, y1);
        }
        
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
            t2 *= t2;
            n2 = t2 * t2 * grad(this.perm[ii + 1 + this.perm[jj + 1]], x2, y2);
        }
        
        return 70 * (n0 + n1 + n2);
    }
}

class Borealis {
    /**
     * Default options for Borealis
     */
    static get defaultOptions() {
        return {
            // Container & Size
            container: document.body,
            width: null,                    // Canvas width (null = auto from container/window)
            height: null,                   // Canvas height (null = auto from container/window)
            fullscreen: true,               // If true, uses fixed positioning to cover viewport
            zIndex: 0,                      // Canvas z-index (can be any integer)
            initiallyHidden: false,         // If true, starts collapsed/hidden
            
            // Grid settings
            density: 50,                    // Grid density (10-100)
            dotSize: 5,                     // Dot size (0-10, 0=smallest)
            solidPattern: false,            // Solid pattern without gaps/circles
            densityMinCell: 2,              // Cell size at max density
            densityMaxCell: 8,              // Cell size at min density
            densityMinGap: 1,               // Gap at max density
            densityMaxGap: 4,               // Gap at min density
            
            // Pattern settings
            patternScale: 0.001,            // Noise scale (smaller = larger patterns)
            patternAurora: false,           // Use aurora colors for pattern
            warpScale: 0.5,                 // Domain warp frequency multiplier
            warpAmount: 20,                 // Domain warp intensity
            animationSpeed: 0.00002,        // Animation speed multiplier
            ridgePower: 2,                  // Ridge sharpness (higher = sharper lines)
            minOpacity: 0,                  // Minimum opacity (0-1)
            maxOpacity: 1,                  // Maximum opacity (0-1)
            waveFrequency: 3,               // Wave oscillation frequency
            waveAmplitude: 0.5,             // Wave intensity (0-1)
            
            // Effect settings (unified structure)
            effect: {
                type: 'wave',               // 'none', 'wave', 'twinkle'
                aurora: false,              // Use aurora colors for effect
                deadzone: 20,               // Center dead zone size (0-100)
                // Wave-specific options
                speed: 0.0008,              // Diagonal line speed
                width: 120,                 // Width of the wave band
                chance: 0.08,               // Chance of a cell sparkling (0-1)
                intensity: 1,               // Max brightness
                delayMin: 1000,             // Min delay between sweeps (ms)
                delayMax: 3000,             // Max delay between sweeps (ms)
                combineSparkle: false,      // Add sparkles that get boosted by wave
                sparkleBaseOpacity: 0,      // Sparkle base opacity when wave not passing (0-100)
                // Twinkle-specific options
                mode: 'sparkle',            // 'sparkle' (random) or 'wave' (flowing waves)
                combined: false,            // Combine sparkle with wave (sparkles boosted by wave)
                baseOpacity: 30,            // Base opacity when wave is not passing (0-100)
                twinkleSpeed: 50,           // Twinkle animation speed (10-100)
                size: 50,                   // Pattern size (10-100)
                density: 50,                // Star density (0-100)
            },
            
            // Aurora colors
            auroraColor1: [0, 255, 128],    // Cyan-green
            auroraColor2: [148, 0, 211],    // Violet
            colorScale: 0.003,              // Color variation scale
            
            // Collapse settings
            collapseSpeed: 0.1,             // Collapse animation speed
            collapseWaveWidth: 0.4,         // Width of the collapse transition
            
            // Animation
            autoStart: true,                // Start animation automatically
            
            // Callbacks
            onShow: null,                   // Called when show animation completes
            onHide: null,                   // Called when hide animation completes
        };
    }

    /**
     * Create a new Borealis instance
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        // Deep merge for effect object
        const defaultEffect = Borealis.defaultOptions.effect;
        const userEffect = options.effect || {};
        
        this.options = { 
            ...Borealis.defaultOptions, 
            ...options,
            effect: { ...defaultEffect, ...userEffect }
        };
        this._init();
    }

    /**
     * Initialize the Borealis instance
     * @private
     */
    _init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        
        // Set canvas styles based on mode
        const zIndex = this.options.zIndex;
        if (this.options.fullscreen) {
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: ${zIndex};
            `;
        } else {
            this.canvas.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: ${zIndex};
            `;
        }
        
        // Add to container
        const container = this.options.container;
        if (container === document.body && this.options.fullscreen) {
            document.body.insertBefore(this.canvas, document.body.firstChild);
        } else {
            // Ensure container has position for absolute positioning
            const containerStyle = window.getComputedStyle(container);
            if (containerStyle.position === 'static') {
                container.style.position = 'relative';
            }
            container.appendChild(this.canvas);
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.noise = new SimplexNoise(Math.random() * 10000);
        this.randomOffset = Math.random() * 1000;
        
        // Internal state
        this._cellSize = 4;
        this._gap = 2;
        this._gridSize = 6;
        this._sparkleMap = {};
        this._animTime = 0;
        this._twinkleTime = 0;
        this._lastFrameTime = 0;
        this._sparkleWaiting = false;
        this._sparkleWaitUntil = 0;
        this._diagPos = 0;
        this._isCollapsing = this.options.initiallyHidden;  // Stay collapsed until manual show() call
        this._collapseProgress = this.options.initiallyHidden ? 1 + this.options.collapseWaveWidth : 0;  // Start fully hidden if initiallyHidden is true
        this._isRunning = false;
        this._animationId = null;
        
        // Computed twinkle values
        this._twinkleThreshold = 0.8;
        this._twinkleSpeedValue = 3;
        this._twinkleScaleValue = 0.01;
        this._deadzoneValue = 0.2;
        
        // Apply initial options
        this._updateDensity(this.options.density);
        this._updateTwinkleSettings();
        this._updateDeadzone();
        
        // Bind methods
        this._draw = this._draw.bind(this);
        this._resize = this._resize.bind(this);
        
        // Setup event listeners
        window.addEventListener('resize', this._resize);
        
        // Initial resize
        this._resize();
        
        // Auto start
        if (this.options.autoStart) {
            this.start();
        }
    }

    /**
     * Update density settings
     * @private
     */
    _updateDensity(value) {
        const t = (100 - value) / 90;
        const baseCell = this.options.densityMinCell + t * (this.options.densityMaxCell - this.options.densityMinCell);
        // Apply dotSize multiplier (0 = 0.3x, 5 = 1x, 10 = 2x)
        const sizeMultiplier = 0.3 + (this.options.dotSize / 10) * 1.7;
        this._cellSize = baseCell * sizeMultiplier;
        this._gap = this.options.densityMinGap + t * (this.options.densityMaxGap - this.options.densityMinGap);
        this._gridSize = this._cellSize + this._gap;
    }

    /**
     * Update twinkle settings from options
     * @private
     */
    _updateTwinkleSettings() {
        const effect = this.options.effect;
        // Speed: 10-100 maps to 1-6
        this._twinkleSpeedValue = 1 + (effect.twinkleSpeed - 10) / 90 * 5;
        // Size: 10-100 maps to 0.5-0.001 (inverted, much wider range)
        this._twinkleScaleValue = 0.5 - (effect.size - 10) / 90 * 0.499;
        // Density: 0-100 maps to threshold 1.0-0.1
        this._twinkleThreshold = 1 - effect.density / 100 * 0.9;
    }

    /**
     * Update deadzone setting (applies to all effects)
     * @private
     */
    _updateDeadzone() {
        // Deadzone: 0-100 maps to 0-1 (percentage of diagonal distance from center to corner)
        this._deadzoneValue = this.options.effect.deadzone / 100;
    }

    /**
     * Generate sparkle map
     * @private
     */
    _generateSparkles(cols, rows) {
        this._sparkleMap = {};
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (Math.random() < this.options.effect.chance) {
                    this._sparkleMap[`${x},${y}`] = Math.random();
                }
            }
        }
    }

    /**
     * Resize handler
     * @private
     */
    _resize() {
        // Determine dimensions
        let width, height;
        
        if (this.options.width !== null && this.options.height !== null) {
            // Use explicit dimensions
            width = this.options.width;
            height = this.options.height;
        } else if (this.options.fullscreen) {
            // Use window dimensions
            width = window.innerWidth;
            height = window.innerHeight;
        } else {
            // Use container dimensions
            const container = this.options.container;
            width = this.options.width !== null ? this.options.width : container.clientWidth;
            height = this.options.height !== null ? this.options.height : container.clientHeight;
        }
        
        this.canvas.width = width;
        this.canvas.height = height;
        const cols = Math.ceil(this.canvas.width / this._gridSize);
        const rows = Math.ceil(this.canvas.height / this._gridSize);
        this._generateSparkles(cols, rows);
        // Clear offscreen canvas cache on resize
        this._offscreenCanvas = null;
        this._offscreenCtx = null;
    }

    /**
     * Main draw loop
     * @private
     */
    _draw(time) {
        if (!this._isRunning) return;
        
        const delta = time - this._lastFrameTime;
        
        this._animTime += delta * this.options.animationSpeed;
        this._twinkleTime += delta * 0.001;
        
        // Handle wave timing
        const effect = this.options.effect;
        if (!this._sparkleWaiting) {
            this._diagPos += delta * effect.speed * 100;
            
            const cols = Math.ceil(this.canvas.width / this._gridSize);
            const rows = Math.ceil(this.canvas.height / this._gridSize);
            const maxDiag = cols + rows;
            
            if (this._diagPos > maxDiag + effect.width) {
                this._sparkleWaiting = true;
                const delay = effect.delayMin + Math.random() * (effect.delayMax - effect.delayMin);
                this._sparkleWaitUntil = time + delay;
                this._generateSparkles(cols, rows);
            }
        } else {
            if (time >= this._sparkleWaitUntil) {
                this._sparkleWaiting = false;
                this._diagPos = -effect.width;
            }
        }
        
        this._lastFrameTime = time;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const cols = Math.ceil(this.canvas.width / this._gridSize);
        const rows = Math.ceil(this.canvas.height / this._gridSize);
        
        // For solid pattern, use offscreen canvas for pixel-perfect base pattern
        if (this.options.solidPattern) {
            // Create or reuse offscreen canvas at grid resolution
            if (!this._offscreenCanvas || this._offscreenCanvas.width !== cols || this._offscreenCanvas.height !== rows) {
                this._offscreenCanvas = document.createElement('canvas');
                this._offscreenCanvas.width = cols;
                this._offscreenCanvas.height = rows;
                this._offscreenCtx = this._offscreenCanvas.getContext('2d');
            }
            
            const offCtx = this._offscreenCtx;
            const imageData = offCtx.createImageData(cols, rows);
            const data = imageData.data;
            
            // Draw only base pattern to ImageData (no effects)
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const cellData = this._calculateCellData(x, y, cols, rows);
                    
                    const idx = (y * cols + x) * 4;
                    data[idx] = cellData.r;
                    data[idx + 1] = cellData.g;
                    data[idx + 2] = cellData.b;
                    data[idx + 3] = Math.round(cellData.opacity * 255);
                }
            }
            
            offCtx.putImageData(imageData, 0, 0);
            
            // Scale up to full canvas size with smooth interpolation
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = 'high';
            this.ctx.drawImage(this._offscreenCanvas, 0, 0, this.canvas.width, this.canvas.height);
            
            // Draw effects on top using regular canvas API (crisp circles)
            if (this.options.effect.type !== 'none') {
                for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                        this._drawEffect(x, y, cols, rows);
                    }
                }
            }
        } else {
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    this._drawCell(x, y, cols, rows);
                }
            }
        }
        
        // Update collapse
        this._updateCollapse();
        
        this._animationId = requestAnimationFrame(this._draw);
    }

    /**
     * Calculate cell data for solid pattern (used for ImageData rendering)
     * @private
     */
    _calculateCellData(x, y, cols, rows) {
        const { options, noise, randomOffset, _animTime } = this;
        
        // Oscillating wave effect
        const wave1 = Math.sin(_animTime * options.waveFrequency + x * options.patternScale * 10) * options.waveAmplitude;
        const wave2 = Math.cos(_animTime * options.waveFrequency * 0.7 + y * options.patternScale * 10) * options.waveAmplitude;
        
        // Domain warping
        const warpX = noise.noise2D(x * options.patternScale * options.warpScale + wave1 + randomOffset, y * options.patternScale * options.warpScale + _animTime + randomOffset) * options.warpAmount;
        const warpY = noise.noise2D(x * options.patternScale * options.warpScale + 100 + randomOffset, y * options.patternScale * options.warpScale + _animTime + wave2 + randomOffset) * options.warpAmount;
        
        const noiseVal = noise.noise2D(
            (x + warpX) * options.patternScale + wave2 * 0.5 + randomOffset,
            (y + warpY) * options.patternScale + wave1 * 0.5 + randomOffset
        );
        
        // Ridge noise
        const ridge = 1 - Math.abs(noiseVal);
        const rawOpacity = Math.pow(ridge, options.ridgePower);
        let opacity = options.minOpacity + rawOpacity * (options.maxOpacity - options.minOpacity);
        
        // Pattern color (no effects in solid pattern base - effects drawn separately)
        let r, g, b;
        if (options.patternAurora) {
            const colorNoise = noise.noise2D(x * options.colorScale + randomOffset * 0.5, y * options.colorScale + _animTime * 0.5 + randomOffset * 0.5);
            const colorBlend = (colorNoise + 1) / 2;
            r = Math.round(options.auroraColor1[0] + (options.auroraColor2[0] - options.auroraColor1[0]) * colorBlend);
            g = Math.round(options.auroraColor1[1] + (options.auroraColor2[1] - options.auroraColor1[1]) * colorBlend);
            b = Math.round(options.auroraColor1[2] + (options.auroraColor2[2] - options.auroraColor1[2]) * colorBlend);
        } else {
            r = g = b = 255;
        }
        
        // Apply collapse (only base pattern, no effect)
        if (this._collapseProgress > 0) {
            const collapseResult = this._applyCollapse(x, y, cols, rows, opacity, 0);
            opacity = collapseResult.opacity;
        }
        
        return { r, g, b, opacity };
    }

    /**
     * Draw only effect for a cell (used in solid pattern mode)
     * @private
     */
    _drawEffect(x, y, cols, rows) {
        const effect = this.options.effect;
        
        let effectColor = [255, 255, 255];
        let effectOpacity = 0;
        
        // Wave effect
        if (effect.type === 'wave' && !this._sparkleWaiting) {
            const result = this._calculateWaveEffect(x, y, cols, rows);
            effectColor = result.color;
            effectOpacity = result.opacity;
        }
        
        // Twinkle effect
        if (effect.type === 'twinkle') {
            const result = this._calculateTwinkleEffect(x, y, cols, rows);
            effectColor = result.color;
            effectOpacity = result.opacity;
        }
        
        // Apply collapse
        if (this._collapseProgress > 0) {
            const collapseResult = this._applyCollapse(x, y, cols, rows, 0, effectOpacity);
            effectOpacity = collapseResult.effectOpacity;
        }
        
        // Draw effect circle if visible
        if (effectOpacity > 0) {
            this.ctx.fillStyle = `rgba(${effectColor[0]}, ${effectColor[1]}, ${effectColor[2]}, ${effectOpacity})`;
            this.ctx.beginPath();
            this.ctx.arc(x * this._gridSize + this._cellSize / 2, y * this._gridSize + this._cellSize / 2, this._cellSize / 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    /**
     * Draw a single cell
     * @private
     */
    _drawCell(x, y, cols, rows) {
        const { options, noise, randomOffset, _animTime, _twinkleTime } = this;
        
        // Oscillating wave effect
        const wave1 = Math.sin(_animTime * options.waveFrequency + x * options.patternScale * 10) * options.waveAmplitude;
        const wave2 = Math.cos(_animTime * options.waveFrequency * 0.7 + y * options.patternScale * 10) * options.waveAmplitude;
        
        // Domain warping
        const warpX = noise.noise2D(x * options.patternScale * options.warpScale + wave1 + randomOffset, y * options.patternScale * options.warpScale + _animTime + randomOffset) * options.warpAmount;
        const warpY = noise.noise2D(x * options.patternScale * options.warpScale + 100 + randomOffset, y * options.patternScale * options.warpScale + _animTime + wave2 + randomOffset) * options.warpAmount;
        
        const noiseVal = noise.noise2D(
            (x + warpX) * options.patternScale + wave2 * 0.5 + randomOffset,
            (y + warpY) * options.patternScale + wave1 * 0.5 + randomOffset
        );
        
        // Ridge noise
        const ridge = 1 - Math.abs(noiseVal);
        const rawOpacity = Math.pow(ridge, options.ridgePower);
        let opacity = options.minOpacity + rawOpacity * (options.maxOpacity - options.minOpacity);
        
        // Effect variables
        let effectColor = [255, 255, 255];
        let effectOpacity = 0;
        
        // Wave effect
        if (options.effect.type === 'wave' && !this._sparkleWaiting) {
            const result = this._calculateWaveEffect(x, y, cols, rows);
            effectColor = result.color;
            effectOpacity = result.opacity;
        }
        
        // Twinkle effect
        if (options.effect.type === 'twinkle') {
            const result = this._calculateTwinkleEffect(x, y, cols, rows);
            effectColor = result.color;
            effectOpacity = result.opacity;
        }
        
        // Pattern color
        let r, g, b;
        if (options.patternAurora) {
            const colorNoise = noise.noise2D(x * options.colorScale + randomOffset * 0.5, y * options.colorScale + _animTime * 0.5 + randomOffset * 0.5);
            const colorBlend = (colorNoise + 1) / 2;
            r = Math.round(options.auroraColor1[0] + (options.auroraColor2[0] - options.auroraColor1[0]) * colorBlend);
            g = Math.round(options.auroraColor1[1] + (options.auroraColor2[1] - options.auroraColor1[1]) * colorBlend);
            b = Math.round(options.auroraColor1[2] + (options.auroraColor2[2] - options.auroraColor1[2]) * colorBlend);
        } else {
            r = g = b = 255;
        }
        
        // Apply collapse
        if (this._collapseProgress > 0) {
            const collapseResult = this._applyCollapse(x, y, cols, rows, opacity, effectOpacity);
            opacity = collapseResult.opacity;
            effectOpacity = collapseResult.effectOpacity;
        }
        
        // Skip rendering if both opacities are 0 (performance optimization)
        if (opacity <= 0 && effectOpacity <= 0) {
            return;
        }
        
        // Draw base pattern
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        if (this.options.solidPattern) {
            // Solid mode: fill entire cell without gaps (add 0.5px overlap to prevent gaps)
            const px = Math.floor(x * this._gridSize);
            const py = Math.floor(y * this._gridSize);
            this.ctx.fillRect(px, py, Math.ceil(this._gridSize) + 1, Math.ceil(this._gridSize) + 1);
        } else {
            // Circle mode
            this.ctx.beginPath();
            this.ctx.arc(x * this._gridSize + this._cellSize / 2, y * this._gridSize + this._cellSize / 2, this._cellSize / 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Draw effect on top (always circles)
        if (effectOpacity > 0) {
            this.ctx.fillStyle = `rgba(${effectColor[0]}, ${effectColor[1]}, ${effectColor[2]}, ${effectOpacity})`;
            this.ctx.beginPath();
            this.ctx.arc(x * this._gridSize + this._cellSize / 2, y * this._gridSize + this._cellSize / 2, this._cellSize / 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    /**
     * Calculate wave effect
     * @private
     */
    _calculateWaveEffect(x, y, cols, rows) {
        const { options, noise, randomOffset, _animTime, _twinkleTime } = this;
        const effect = options.effect;
        let color = [255, 255, 255];
        let opacity = 0;
        
        // Dead zone calculation (using diagonal distance to corner)
        const centerX = cols / 2;
        const centerY = rows / 2;
        const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const maxDist = Math.sqrt(centerX ** 2 + centerY ** 2); // Distance from center to corner
        const maxRadius = maxDist * this._deadzoneValue;
        const fadeZone = maxRadius * 0.3;
        
        let centerFade = 1;
        if (distFromCenter < maxRadius) {
            centerFade = 0;
        } else if (distFromCenter < maxRadius + fadeZone) {
            const t = (distFromCenter - maxRadius) / fadeZone;
            centerFade = t * t * (3 - 2 * t);
        }
        
        // Combined sparkle mode - sparkles that get boosted by wave
        if (effect.combineSparkle && centerFade > 0) {
            // Calculate wave proximity (0-1, 1 = wave is here)
            const cellDiag = x + y;
            const distFromLine = Math.abs(cellDiag - this._diagPos);
            // Narrower wave effect zone for more dramatic boost
            const waveProximity = Math.max(0, 1 - distFromLine / effect.width);
            // Sharper falloff - wave effect drops quickly
            const smoothWaveProximity = Math.pow(waveProximity, 0.5);
            
            // Calculate sparkle
            const hash1 = Math.sin(x * 12.9898 + y * 78.233 + randomOffset) * 43758.5453;
            const rand1 = hash1 - Math.floor(hash1);
            const hash2 = Math.sin(x * 93.9898 + y * 67.345 + randomOffset * 2) * 23421.6312;
            const rand2 = hash2 - Math.floor(hash2);
            
            // Use twinkle density for sparkle distribution
            const sparkleThreshold = 1 - effect.density / 100 * 0.9;
            
            if (rand1 > sparkleThreshold) {
                const phase = rand2 * Math.PI * 2;
                const sparkleSpeed = 0.1 + (effect.twinkleSpeed / 100) * 0.4;
                const twinkleWave = Math.sin(_twinkleTime * sparkleSpeed + phase);
                const sparkle = Math.max(0, twinkleWave);
                
                // Base opacity is limited, wave boosts it to full
                const baseOpacity = effect.sparkleBaseOpacity / 100;
                const maxBoost = 1 - baseOpacity;
                const finalOpacity = baseOpacity + (maxBoost * smoothWaveProximity);
                
                opacity = sparkle * finalOpacity * centerFade;
                
                if (effect.aurora) {
                    const colorRand = Math.sin(x * 45.123 + y * 89.456 + randomOffset) * 12345.6789;
                    const colorBlend = colorRand - Math.floor(colorRand);
                    color = [
                        Math.round(options.auroraColor1[0] + (options.auroraColor2[0] - options.auroraColor1[0]) * colorBlend),
                        Math.round(options.auroraColor1[1] + (options.auroraColor2[1] - options.auroraColor1[1]) * colorBlend),
                        Math.round(options.auroraColor1[2] + (options.auroraColor2[2] - options.auroraColor1[2]) * colorBlend)
                    ];
                }
            }
            
            return { color, opacity };
        }
        
        const cellDiag = x + y;
        const distFromLine = Math.abs(cellDiag - this._diagPos);
        
        if (distFromLine < effect.width && this._sparkleMap[`${x},${y}`] !== undefined) {
            const normalizedDist = distFromLine / effect.width;
            const sparkle = Math.cos(normalizedDist * Math.PI * 0.5) * effect.intensity;
            
            // Cylinder effect
            const fullDiagonalLength = Math.min(cols, rows);
            const diagStartX = Math.max(0, Math.floor(this._diagPos) - (rows - 1));
            const diagEndX = Math.min(cols - 1, Math.floor(this._diagPos));
            const currentLineLength = Math.max(1, diagEndX - diagStartX + 1);
            
            let cylinderFade = 1;
            if (currentLineLength >= fullDiagonalLength && currentLineLength > 1) {
                const posAlongLine = (x - diagStartX) / (currentLineLength - 1);
                const clampedPos = Math.max(0, Math.min(1, posAlongLine));
                cylinderFade = 0.3 + 0.7 * Math.sin(clampedPos * Math.PI);
            } else if (currentLineLength > 1) {
                const completeness = currentLineLength / fullDiagonalLength;
                const posAlongLine = (x - diagStartX) / (currentLineLength - 1);
                const clampedPos = Math.max(0, Math.min(1, posAlongLine));
                const baseFade = Math.sin(clampedPos * Math.PI);
                cylinderFade = Math.max(0.3, 1 - (1 - baseFade) * completeness * 0.7);
            }
            
            opacity = sparkle * this._sparkleMap[`${x},${y}`] * Math.max(0, cylinderFade) * centerFade;
            
            // Color
            if (effect.aurora) {
                const colorNoise = noise.noise2D(x * options.colorScale * 2 + randomOffset, y * options.colorScale * 2 + _animTime + randomOffset);
                const colorBlend = (colorNoise + 1) / 2;
                color = [
                    Math.round(options.auroraColor1[0] + (options.auroraColor2[0] - options.auroraColor1[0]) * colorBlend),
                    Math.round(options.auroraColor1[1] + (options.auroraColor2[1] - options.auroraColor1[1]) * colorBlend),
                    Math.round(options.auroraColor1[2] + (options.auroraColor2[2] - options.auroraColor1[2]) * colorBlend)
                ];
            }
        }
        
        return { color, opacity };
    }

    /**
     * Calculate twinkle effect
     * @private
     */
    _calculateTwinkleEffect(x, y, cols, rows) {
        const { options, noise, randomOffset, _twinkleTime } = this;
        const effect = options.effect;
        let color = [255, 255, 255];
        let opacity = 0;
        
        // Dead zone calculation (using diagonal distance to corner)
        const centerX = cols / 2;
        const centerY = rows / 2;
        const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const maxDist = Math.sqrt(centerX ** 2 + centerY ** 2); // Distance from center to corner
        const maxRadius = maxDist * this._deadzoneValue;
        const fadeZone = maxRadius * 0.3;
        
        let centerFade = 1;
        if (distFromCenter < maxRadius) {
            centerFade = 0;
        } else if (distFromCenter < maxRadius + fadeZone) {
            const t = (distFromCenter - maxRadius) / fadeZone;
            centerFade = t * t * (3 - 2 * t);
        }
        
        if (centerFade > 0) {
            // Combined mode - sparkles that get boosted by passing waves
            if (effect.combined) {
                // Calculate wave intensity first
                const baseScale = 0.0005 + (1 - this._twinkleScaleValue) * 0.003;
                const waveSpeed = this._twinkleSpeedValue * 0.15;
                
                const wave1 = noise.noise2D(
                    x * baseScale + _twinkleTime * waveSpeed,
                    y * baseScale + _twinkleTime * waveSpeed * 0.5 + randomOffset
                );
                const wave2 = noise.noise2D(
                    x * baseScale * 0.5 + _twinkleTime * waveSpeed * 0.3 + 50,
                    y * baseScale * 0.7 - _twinkleTime * waveSpeed * 0.2 + randomOffset + 50
                );
                const wave3 = noise.noise2D(
                    (x + y * 0.5) * baseScale * 0.8 + _twinkleTime * waveSpeed * 0.4,
                    (y - x * 0.3) * baseScale * 0.8 + randomOffset + 100
                );
                
                const combined = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2);
                const smoothWave = (Math.sin(combined * Math.PI * 2) + 1) / 2;
                const waveIntensity = Math.pow(smoothWave, 0.5); // Smoother wave
                
                // Calculate sparkle
                const hash1 = Math.sin(x * 12.9898 + y * 78.233 + randomOffset) * 43758.5453;
                const rand1 = hash1 - Math.floor(hash1);
                const hash2 = Math.sin(x * 93.9898 + y * 67.345 + randomOffset * 2) * 23421.6312;
                const rand2 = hash2 - Math.floor(hash2);
                
                if (rand1 > this._twinkleThreshold) {
                    const phase = rand2 * Math.PI * 2;
                    const twinkleWave = Math.sin(_twinkleTime * this._twinkleSpeedValue * 2 + phase);
                    const sparkle = Math.max(0, twinkleWave);
                    
                    // Base opacity is limited, wave boosts it to full
                    const baseOpacity = effect.baseOpacity / 100;
                    const maxBoost = 1 - baseOpacity;
                    const finalOpacity = baseOpacity + (maxBoost * waveIntensity);
                    
                    opacity = sparkle * finalOpacity * effect.intensity * centerFade;
                    
                    if (effect.aurora) {
                        const colorRand = Math.sin(x * 45.123 + y * 89.456 + randomOffset) * 12345.6789;
                        const colorBlend = colorRand - Math.floor(colorRand);
                        color = [
                            Math.round(options.auroraColor1[0] + (options.auroraColor2[0] - options.auroraColor1[0]) * colorBlend),
                            Math.round(options.auroraColor1[1] + (options.auroraColor2[1] - options.auroraColor1[1]) * colorBlend),
                            Math.round(options.auroraColor1[2] + (options.auroraColor2[2] - options.auroraColor1[2]) * colorBlend)
                        ];
                    }
                }
            }
            // Wave mode - flowing waves that boost opacity to 100%
            else if (effect.mode === 'wave') {
                // Create smooth, wide flowing light bands
                // Size controls the width of the bands
                const baseScale = 0.0005 + (1 - this._twinkleScaleValue) * 0.003;
                const waveSpeed = this._twinkleSpeedValue * 0.15;
                
                // Slow, smooth primary wave - creates wide bands
                const wave1 = noise.noise2D(
                    x * baseScale + _twinkleTime * waveSpeed,
                    y * baseScale + _twinkleTime * waveSpeed * 0.5 + randomOffset
                );
                
                // Very slow secondary wave for organic variation
                const wave2 = noise.noise2D(
                    x * baseScale * 0.5 + _twinkleTime * waveSpeed * 0.3 + 50,
                    y * baseScale * 0.7 - _twinkleTime * waveSpeed * 0.2 + randomOffset + 50
                );
                
                // Third wave for extra organic feel
                const wave3 = noise.noise2D(
                    (x + y * 0.5) * baseScale * 0.8 + _twinkleTime * waveSpeed * 0.4,
                    (y - x * 0.3) * baseScale * 0.8 + randomOffset + 100
                );
                
                // Combine waves smoothly
                const combined = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2);
                
                // Smooth sine-based intensity (no harsh ridges)
                const smoothWave = (Math.sin(combined * Math.PI * 2) + 1) / 2;
                
                // Apply density as band width control
                const densityFactor = 0.3 + this._twinkleThreshold * 0.7;
                const intensity = Math.pow(smoothWave, 1 / densityFactor);
                
                // Smooth the final output
                opacity = intensity * effect.intensity * centerFade;
                
                // Aurora colors for wave mode
                if (effect.aurora && opacity > 0) {
                    const colorWave = noise.noise2D(
                        x * baseScale * 0.3 + _twinkleTime * waveSpeed * 0.1 + randomOffset,
                        y * baseScale * 0.3 + randomOffset
                    );
                    const colorBlend = (colorWave + 1) / 2;
                    color = [
                        Math.round(options.auroraColor1[0] + (options.auroraColor2[0] - options.auroraColor1[0]) * colorBlend),
                        Math.round(options.auroraColor1[1] + (options.auroraColor2[1] - options.auroraColor1[1]) * colorBlend),
                        Math.round(options.auroraColor1[2] + (options.auroraColor2[2] - options.auroraColor1[2]) * colorBlend)
                    ];
                }
            } else {
                // Sparkle mode - original random twinkling
                const hash1 = Math.sin(x * 12.9898 + y * 78.233 + randomOffset) * 43758.5453;
                const rand1 = hash1 - Math.floor(hash1);
                
                const hash2 = Math.sin(x * 93.9898 + y * 67.345 + randomOffset * 2) * 23421.6312;
                const rand2 = hash2 - Math.floor(hash2);
                
                if (rand1 > this._twinkleThreshold) {
                    const phase = rand2 * Math.PI * 2;
                    const twinkleWave = Math.sin(_twinkleTime * this._twinkleSpeedValue + phase);
                    const baseBrightness = Math.max(0, twinkleWave);
                    
                    const groupWave = noise.noise2D(
                        x * this._twinkleScaleValue + _twinkleTime * 0.2 + randomOffset,
                        y * this._twinkleScaleValue + randomOffset
                    );
                    const maxOpacity = 0.2 + (groupWave + 1) / 2 * 0.8;
                    
                    opacity = baseBrightness * maxOpacity * effect.intensity * centerFade;
                    
                    if (effect.aurora) {
                        const colorRand = Math.sin(x * 45.123 + y * 89.456 + randomOffset) * 12345.6789;
                        const colorBlend = colorRand - Math.floor(colorRand);
                        color = [
                            Math.round(options.auroraColor1[0] + (options.auroraColor2[0] - options.auroraColor1[0]) * colorBlend),
                            Math.round(options.auroraColor1[1] + (options.auroraColor2[1] - options.auroraColor1[1]) * colorBlend),
                            Math.round(options.auroraColor1[2] + (options.auroraColor2[2] - options.auroraColor1[2]) * colorBlend)
                        ];
                    }
                }
            }
        }
        
        return { color, opacity };
    }

    /**
     * Apply collapse effect
     * @private
     */
    _applyCollapse(x, y, cols, rows, opacity, effectOpacity) {
        const centerX = cols / 2;
        const centerY = rows / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
        const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const normalizedDist = distFromCenter / maxRadius;
        
        const collapseAt = 1 - normalizedDist;
        
        if (this._collapseProgress > collapseAt + this.options.collapseWaveWidth) {
            opacity = 0;
            effectOpacity = 0;
        } else if (this._collapseProgress > collapseAt) {
            const t = 1 - (this._collapseProgress - collapseAt) / this.options.collapseWaveWidth;
            const smoothFade = t * t * (3 - 2 * t);
            opacity *= smoothFade;
            effectOpacity *= smoothFade;
        }
        
        return { opacity, effectOpacity };
    }

    /**
     * Update collapse animation
     * @private
     */
    _updateCollapse() {
        const collapseEnd = 1 + this.options.collapseWaveWidth;
        
        if (this._isCollapsing && this._collapseProgress < collapseEnd) {
            this._collapseProgress += this.options.collapseSpeed;
            if (this._collapseProgress >= collapseEnd) {
                this._collapseProgress = collapseEnd;
                if (this.options.onHide) {
                    this.options.onHide();
                }
            }
        } else if (!this._isCollapsing && this._collapseProgress > 0) {
            this._collapseProgress -= this.options.collapseSpeed;
            if (this._collapseProgress <= 0) {
                this._collapseProgress = 0;
                if (this.options.onShow) {
                    this.options.onShow();
                }
            }
        }
    }

    // ==================== PUBLIC API ====================

    /**
     * Start the animation
     * @returns {Borealis} this instance for chaining
     */
    start() {
        if (!this._isRunning) {
            this._isRunning = true;
            this._lastFrameTime = performance.now();
            this._animationId = requestAnimationFrame(this._draw);
        }
        return this;
    }

    /**
     * Stop the animation
     * @returns {Borealis} this instance for chaining
     */
    stop() {
        this._isRunning = false;
        if (this._animationId) {
            cancelAnimationFrame(this._animationId);
            this._animationId = null;
        }
        return this;
    }

    /**
     * Manually trigger a resize (useful when container size changes)
     * @param {number} [width] - Optional new width
     * @param {number} [height] - Optional new height
     * @returns {Borealis} this instance for chaining
     */
    resize(width, height) {
        if (width !== undefined) {
            this.options.width = width;
        }
        if (height !== undefined) {
            this.options.height = height;
        }
        this._resize();
        return this;
    }

    /**
     * Force a single frame redraw (useful when animation is stopped)
     * @returns {Borealis} this instance for chaining
     */
    redraw() {
        const time = performance.now();
        const wasRunning = this._isRunning;
        this._isRunning = true;
        this._lastFrameTime = time - 16; // Simulate ~60fps frame
        
        // Draw single frame without requesting next
        const delta = 16;
        this._animTime += delta * this.options.animationSpeed;
        this._twinkleTime += delta * 0.001;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const cols = Math.ceil(this.canvas.width / this._gridSize);
        const rows = Math.ceil(this.canvas.height / this._gridSize);
        
        if (this.options.solidPattern) {
            if (!this._offscreenCanvas || this._offscreenCanvas.width !== cols || this._offscreenCanvas.height !== rows) {
                this._offscreenCanvas = document.createElement('canvas');
                this._offscreenCanvas.width = cols;
                this._offscreenCanvas.height = rows;
                this._offscreenCtx = this._offscreenCanvas.getContext('2d');
            }
            
            const offCtx = this._offscreenCtx;
            const imageData = offCtx.createImageData(cols, rows);
            const data = imageData.data;
            
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const cellData = this._calculateCellData(x, y, cols, rows);
                    const idx = (y * cols + x) * 4;
                    data[idx] = cellData.r;
                    data[idx + 1] = cellData.g;
                    data[idx + 2] = cellData.b;
                    data[idx + 3] = Math.round(cellData.opacity * 255);
                }
            }
            
            offCtx.putImageData(imageData, 0, 0);
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = 'high';
            this.ctx.drawImage(this._offscreenCanvas, 0, 0, this.canvas.width, this.canvas.height);
            
            if (this.options.effect.type !== 'none') {
                for (let y = 0; y < rows; y++) {
                    for (let x = 0; x < cols; x++) {
                        this._drawEffect(x, y, cols, rows);
                    }
                }
            }
        } else {
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    this._drawCell(x, y, cols, rows);
                }
            }
        }
        
        this._isRunning = wasRunning;
        return this;
    }

    /**
     * Show the pattern (expand from center)
     * @param {Function} [callback] - Called when animation completes
     * @returns {Borealis} this instance for chaining
     */
    show(callback) {
        this._isCollapsing = false;
        if (callback) {
            const originalCallback = this.options.onShow;
            this.options.onShow = () => {
                callback();
                this.options.onShow = originalCallback;
            };
        }
        return this;
    }

    /**
     * Hide the pattern (collapse to center)
     * @param {Function} [callback] - Called when animation completes
     * @returns {Borealis} this instance for chaining
     */
    hide(callback) {
        this._isCollapsing = true;
        if (callback) {
            const originalCallback = this.options.onHide;
            this.options.onHide = () => {
                callback();
                this.options.onHide = originalCallback;
            };
        }
        return this;
    }

    /**
     * Toggle between show and hide
     * @param {Function} [callback] - Called when animation completes
     * @returns {Borealis} this instance for chaining
     */
    toggle(callback) {
        if (this._isCollapsing) {
            return this.show(callback);
        } else {
            return this.hide(callback);
        }
    }

    /**
     * Check if currently visible (not collapsed)
     * @returns {boolean}
     */
    isVisible() {
        return !this._isCollapsing && this._collapseProgress === 0;
    }

    /**
     * Check if currently hidden (fully collapsed)
     * @returns {boolean}
     */
    isHidden() {
        return this._isCollapsing && this._collapseProgress >= 1 + this.options.collapseWaveWidth;
    }

    /**
     * Set a single option
     * @param {string} key - Option key
     * @param {*} value - Option value
     * @returns {Borealis} this instance for chaining
     */
    setOption(key, value) {
        // Handle effect as special case (use setEffect instead)
        if (key === 'effect') {
            if (typeof value === 'object') {
                return this.setEffect(value.type, value);
            }
            return this;
        }
        
        this.options[key] = value;
        
        // Handle special cases that need resize/recalculation
        const needsResize = [
            'density', 'dotSize', 'solidPattern', 'patternAurora', 
            'maxOpacity', 'minOpacity'
        ];
        
        if (needsResize.includes(key)) {
            this._updateDensity(this.options.density);
            this._resize();
        }
        
        return this;
    }

    /**
     * Set effect type and options
     * @param {string} type - Effect type: 'none', 'wave', or 'twinkle'
     * @param {Object} [effectOptions] - Effect-specific options
     * @returns {Borealis} this instance for chaining
     */
    setEffect(type, effectOptions = {}) {
        // Update effect type
        if (type) {
            this.options.effect.type = type;
        }
        
        // Merge effect options
        Object.keys(effectOptions).forEach(key => {
            if (key !== 'type') {
                this.options.effect[key] = effectOptions[key];
            }
        });
        
        // Update internal computed values
        this._updateTwinkleSettings();
        this._updateDeadzone();
        this._resize();
        
        return this;
    }

    /**
     * Get current effect configuration
     * @returns {Object} Effect configuration with type and options
     */
    getEffect() {
        return { ...this.options.effect };
    }

    /**
     * Set multiple options at once
     * @param {Object} options - Options object
     * @returns {Borealis} this instance for chaining
     */
    setOptions(options) {
        Object.keys(options).forEach(key => {
            this.setOption(key, options[key]);
        });
        return this;
    }

    /**
     * Get current options
     * @returns {Object} Current options
     */
    getOptions() {
        return { ...this.options };
    }

    /**
     * Get a specific option value
     * @param {string} key - Option key
     * @returns {*} Option value
     */
    getOption(key) {
        return this.options[key];
    }

    /**
     * Destroy the instance and clean up
     */
    destroy() {
        this.stop();
        window.removeEventListener('resize', this._resize);
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        this.canvas = null;
        this.ctx = null;
        this.noise = null;
    }
}

export { Borealis as default };
