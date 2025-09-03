(function () {
  "use strict";

  // Configuration endpoint - reads from GitHub Pages (instant updates)
  const CONFIG_URL = "https://lonie12.github.io/red-i-cdn/config.json";

  // Default configuration (fallback)
  const DEFAULT_CONFIG = {
    home: true,
    about: false,
    services: false,
    projects: false,
    contact: false,
    newsletter: false,
    chat: false,
  };

  // Initialize Red International Controller
  window.RedInternational = {
    config: DEFAULT_CONFIG,
    initialized: false,

    // Initialize the system
    init: function () {
      if (this.initialized) return;

      console.log("[Red International] Initializing...");
      this.loadConfig();
      this.initialized = true;
    },

    // Load configuration from dashboard
    loadConfig: function () {
      // Try to load from localStorage first (for development)
      const localConfig = localStorage.getItem("red-international-config");
      if (localConfig) {
        try {
          this.config = JSON.parse(localConfig);
          console.log(
            "[Red International] Config loaded from localStorage",
            this.config
          );
          this.applyConfig();
          return;
        } catch (e) {
          console.warn("[Red International] Invalid localStorage config");
        }
      }

      // Load from remote endpoint
      fetch(CONFIG_URL)
        .then((response) => response.json())
        .then((config) => {
          this.config = config;
          console.log(
            "[Red International] Config loaded from remote",
            this.config
          );
          this.applyConfig();
        })
        .catch((error) => {
          console.warn(
            "[Red International] Failed to load remote config, using defaults",
            error
          );
          this.applyConfig();
        });
    },

    // Apply configuration to the page
    applyConfig: function () {
      Object.keys(this.config).forEach((serviceId) => {
        const isActive = this.config[serviceId];

        // Hide/show elements by data attribute
        const elements = document.querySelectorAll(
          `[data-red-service="${serviceId}"]`
        );
        elements.forEach((element) => {
          if (isActive) {
            element.style.display = "";
            element.classList.remove("red-inactive");
            element.classList.add("red-active");
          } else {
            element.style.display = "none";
            element.classList.remove("red-active");
            element.classList.add("red-inactive");
          }
        });

        // Hide/show by ID
        const elementById = document.getElementById(`red-${serviceId}`);
        if (elementById) {
          if (isActive) {
            elementById.style.display = "";
            elementById.classList.remove("red-inactive");
            elementById.classList.add("red-active");
          } else {
            elementById.style.display = "none";
            elementById.classList.remove("red-active");
            elementById.classList.add("red-inactive");
          }
        }

        // Hide/show by class
        const elementsByClass = document.querySelectorAll(`.red-${serviceId}`);
        elementsByClass.forEach((element) => {
          if (isActive) {
            element.style.display = "";
            element.classList.remove("red-inactive");
            element.classList.add("red-active");
          } else {
            element.style.display = "none";
            element.classList.remove("red-active");
            element.classList.add("red-inactive");
          }
        });
      });

      console.log("[Red International] Configuration applied");
    },

    // Check if a service is active
    isActive: function (serviceId) {
      return this.config[serviceId] || false;
    },

    // Manually refresh configuration
    refresh: function () {
      console.log("[Red International] Refreshing configuration...");
      this.loadConfig();
    },
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      window.RedInternational.init();
    });
  } else {
    window.RedInternational.init();
  }

  // Also apply config when new elements are added to DOM
  const observer = new MutationObserver(function (mutations) {
    let shouldReapply = false;
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 1) {
          // Element node
          if (
            node.hasAttribute &&
            (node.hasAttribute("data-red-service") ||
              (node.id && node.id.startsWith("red-")) ||
              (node.className && node.className.includes("red-")))
          ) {
            shouldReapply = true;
          }
        }
      });
    });

    if (shouldReapply && window.RedInternational.initialized) {
      setTimeout(() => window.RedInternational.applyConfig(), 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();

/*
USAGE EXAMPLES:

1. Hide/show by data attribute:
   <div data-red-service="newsletter">Newsletter popup content</div>

2. Hide/show by ID:
   <div id="red-chat">Live chat widget</div>

3. Hide/show by class:
   <section class="red-services">Services section</section>

4. Check status in JavaScript:
   if (RedInternational.isActive('contact')) {
     // Show contact form
   }

5. Refresh config manually:
   RedInternational.refresh();
*/
