declare module '@diabolic/borealis' {
    export interface EffectOptions {
        /** Effect type: 'none', 'wave', or 'twinkle' */
        type?: 'none' | 'wave' | 'twinkle';
        /** Use aurora colors for effect */
        aurora?: boolean;
        /** Center dead zone size (0-100) */
        deadzone?: number;
        
        // Wave-specific options
        /** Diagonal line speed */
        speed?: number;
        /** Width of the wave band */
        width?: number;
        /** Chance of a cell sparkling (0-1) */
        chance?: number;
        /** Max brightness */
        intensity?: number;
        /** Min delay between sweeps (ms) */
        delayMin?: number;
        /** Max delay between sweeps (ms) */
        delayMax?: number;
        /** Add sparkles that get boosted by wave */
        combineSparkle?: boolean;
        /** Sparkle base opacity when wave not passing (0-100) */
        sparkleBaseOpacity?: number;
        
        // Twinkle-specific options
        /** 'sparkle' (random) or 'wave' (flowing waves) */
        mode?: 'sparkle' | 'wave';
        /** Combine sparkle with wave (sparkles boosted by wave) */
        combined?: boolean;
        /** Base opacity when wave is not passing (0-100) */
        baseOpacity?: number;
        /** Twinkle animation speed (10-100) */
        twinkleSpeed?: number;
        /** Pattern size (10-100) */
        size?: number;
        /** Star density (0-100) */
        density?: number;
    }

    export interface BorealisOptions {
        /** Container element (default: document.body) */
        /** Container element (default: document.body) */
        container?: HTMLElement;
        /** Canvas width in pixels (null = auto from container/window) */
        width?: number | null;
        /** Canvas height in pixels (null = auto from container/window) */
        height?: number | null;
        /** If true, uses fixed positioning to cover viewport (default: true) */
        fullscreen?: boolean;
        
        // Grid settings
        /** Grid density (10-100) */
        density?: number;
        /** Dot size (0-10, 0=smallest) */
        dotSize?: number;
        /** Solid pattern without gaps/circles */
        solidPattern?: boolean;
        /** Cell size at max density */
        densityMinCell?: number;
        /** Cell size at min density */
        densityMaxCell?: number;
        /** Gap at max density */
        densityMinGap?: number;
        /** Gap at min density */
        densityMaxGap?: number;
        
        // Pattern settings
        /** Noise scale (smaller = larger patterns) */
        patternScale?: number;
        /** Use aurora colors for pattern */
        patternAurora?: boolean;
        /** Domain warp frequency multiplier */
        warpScale?: number;
        /** Domain warp intensity */
        warpAmount?: number;
        /** Animation speed multiplier */
        animationSpeed?: number;
        /** Ridge sharpness (higher = sharper lines) */
        ridgePower?: number;
        /** Minimum opacity (0-1) */
        minOpacity?: number;
        /** Maximum opacity (0-1) */
        maxOpacity?: number;
        /** Wave oscillation frequency */
        waveFrequency?: number;
        /** Wave intensity (0-1) */
        waveAmplitude?: number;
        
        // Effect settings
        /** Effect configuration */
        effect?: EffectOptions;
        
        // Aurora colors
        /** First aurora color [r, g, b] */
        auroraColor1?: [number, number, number];
        /** Second aurora color [r, g, b] */
        auroraColor2?: [number, number, number];
        /** Color variation scale */
        colorScale?: number;
        
        // Collapse settings
        /** Collapse animation speed */
        collapseSpeed?: number;
        /** Width of the collapse transition */
        collapseWaveWidth?: number;
        
        // Animation
        /** Start animation automatically */
        autoStart?: boolean;
        
        // Callbacks
        /** Called when show animation completes */
        onShow?: () => void;
        /** Called when hide animation completes */
        onHide?: () => void;
    }

    export default class Borealis {
        /** Default options for Borealis */
        static readonly defaultOptions: BorealisOptions;
        
        /** Current options */
        options: BorealisOptions;
        
        /** Canvas element */
        canvas: HTMLCanvasElement | null;
        
        /**
         * Create a new Borealis instance
         * @param options - Configuration options
         */
        constructor(options?: BorealisOptions);
        
        /**
         * Start the animation
         * @returns this instance for chaining
         */
        start(): this;
        
        /**
         * Stop the animation
         * @returns this instance for chaining
         */
        stop(): this;
        
        /**
         * Manually trigger a resize (useful when container size changes)
         * @param width - Optional new width
         * @param height - Optional new height
         * @returns this instance for chaining
         */
        resize(width?: number, height?: number): this;
        
        /**
         * Force a single frame redraw (useful when animation is stopped)
         * @returns this instance for chaining
         */
        redraw(): this;
        
        /**
         * Show the pattern (expand from center)
         * @param callback - Called when animation completes
         * @returns this instance for chaining
         */
        show(callback?: () => void): this;
        
        /**
         * Hide the pattern (collapse to center)
         * @param callback - Called when animation completes
         * @returns this instance for chaining
         */
        hide(callback?: () => void): this;
        
        /**
         * Toggle between show and hide
         * @param callback - Called when animation completes
         * @returns this instance for chaining
         */
        toggle(callback?: () => void): this;
        
        /**
         * Check if currently visible (not collapsed)
         */
        isVisible(): boolean;
        
        /**
         * Check if currently hidden (fully collapsed)
         */
        isHidden(): boolean;
        
        /**
         * Set a single option
         * @param key - Option key
         * @param value - Option value
         * @returns this instance for chaining
         */
        setOption<K extends keyof BorealisOptions>(key: K, value: BorealisOptions[K]): this;
        
        /**
         * Set effect type and options
         * @param type - Effect type: 'none', 'wave', or 'twinkle'
         * @param effectOptions - Effect-specific options
         * @returns this instance for chaining
         */
        setEffect(type: 'none' | 'wave' | 'twinkle' | null, effectOptions?: Omit<EffectOptions, 'type'>): this;
        
        /**
         * Get current effect configuration
         */
        getEffect(): EffectOptions;
        
        /**
         * Set multiple options at once
         * @param options - Options object
         * @returns this instance for chaining
         */
        setOptions(options: Partial<BorealisOptions>): this;
        
        /**
         * Get current options
         */
        getOptions(): BorealisOptions;
        
        /**
         * Get a specific option value
         * @param key - Option key
         */
        getOption<K extends keyof BorealisOptions>(key: K): BorealisOptions[K];
        
        /**
         * Destroy the instance and clean up
         */
        destroy(): void;
    }
}
