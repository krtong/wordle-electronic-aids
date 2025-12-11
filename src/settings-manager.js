/**
 * Settings Manager - Handles localStorage persistence for all user preferences
 */

const SettingsManager = {
    // Default settings
    defaults: {
        allowProbeToggle: false,
        excludeGreenToggle: false,
        excludeYellowToggle: false,
        perPositionToggle: true,
        autofillToggle: true,
        advancedModeToggle: false
    },

    /**
     * Load all settings from localStorage
     */
    loadSettings() {
        const settings = {};
        for (const [key, defaultValue] of Object.entries(this.defaults)) {
            const saved = localStorage.getItem(key);
            settings[key] = saved !== null ? saved === 'true' : defaultValue;
        }
        return settings;
    },

    /**
     * Save a single setting to localStorage
     */
    saveSetting(key, value) {
        localStorage.setItem(key, value.toString());
    },

    /**
     * Apply settings to the DOM
     */
    applySettings(settings, silent = false) {
        for (const [key, value] of Object.entries(settings)) {
            const element = document.getElementById(key);
            if (element && element.type === 'checkbox') {
                element.checked = value;

                // Trigger change event to apply any side effects (unless silent mode)
                if (!silent) {
                    element.dispatchEvent(new Event('change'));
                }
            }
        }
    },

    /**
     * Initialize settings management
     */
    init() {
        const settings = this.loadSettings();

        // Apply settings silently (don't trigger change events yet)
        this.applySettings(settings, true);

        // Add listeners to save settings when they change
        for (const key of Object.keys(this.defaults)) {
            const element = document.getElementById(key);
            if (element && element.type === 'checkbox') {
                element.addEventListener('change', (e) => {
                    this.saveSetting(key, e.target.checked);
                });
            }
        }

        return settings;
    },

    /**
     * Reset all settings to defaults
     */
    resetToDefaults() {
        for (const [key, value] of Object.entries(this.defaults)) {
            this.saveSetting(key, value);
        }
        this.applySettings(this.defaults);
    }
};

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsManager;
} else if (typeof window !== 'undefined') {
    window.SettingsManager = SettingsManager;
}
