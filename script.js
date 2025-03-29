document.addEventListener("DOMContentLoaded", function () {
  // Data for hotspots and items
  const hotspotData = [
    {
      id: "bread",
      x: 140,
      y: 155,
      width: 40,
      height: 30,
      description:
        "Bread (Pani): Various types of bread, a staple in Renaissance diet",
    },
    {
      id: "wine",
      x: 128,
      y: 190,
      width: 45,
      height: 38,
      description:
        "Wine jug (Vino): Fine wine was commonly consumed with meals",
    },
    {
      id: "fish",
      x: 170,
      y: 330,
      width: 90,
      height: 30,
      description: "Fish: Fresh fish was an important protein source",
    },
    {
      id: "vegetables",
      x: 160,
      y: 235,
      width: 100,
      height: 60,
      description: "Vegetables: Local seasonal produce",
    },
    {
      id: "salad",
      x: 115,
      y: 120,
      width: 80,
      height: 30,
      description: "Salad: Fresh greens and herbs",
    },
    {
      id: "plates",
      x: 110,
      y: 30,
      width: 40,
      height: 52,
      description: "Plates and bowls for serving the meal",
    },
  ];

  // Create hotspots
  const documentElement = document.querySelector(".document");
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  documentElement.appendChild(tooltip);

  // Function to adjust hotspot positions for different screen sizes
  function adjustHotspotsForScreenSize() {
    const containerWidth = documentElement.offsetWidth;
    const scaleRatio = containerWidth / 400;
    document.querySelectorAll(".hotspot").forEach((hotspot) => {
      const id = hotspot.dataset.id;
      const spot = hotspotData.find((s) => s.id === id);
      const minSize = window.innerWidth < 768 ? 30 : 0; // Minimum 30px on mobile
      hotspot.style.left = `${spot.x * scaleRatio}px`;
      hotspot.style.top = `${spot.y * scaleRatio}px`;
      hotspot.style.width = `${Math.max(spot.width * scaleRatio, minSize)}px`;
      hotspot.style.height = `${Math.max(spot.height * scaleRatio, minSize)}px`;
    });
  }

  // Create hotspots
  hotspotData.forEach((spot) => {
    const hotspot = document.createElement("div");
    hotspot.classList.add("hotspot");
    hotspot.dataset.id = spot.id;

    // Initial position will be adjusted by the function
    hotspot.style.left = `${spot.x}px`;
    hotspot.style.top = `${spot.y}px`;
    hotspot.style.width = `${spot.width}px`;
    hotspot.style.height = `${spot.height}px`;

    // Use touchstart/touchend for mobile and mouseover/mouseout for desktop
    const showTooltip = function (e) {
      hotspot.classList.add("active");
      const touch = e.type.startsWith("touch") ? e.touches[0] : e;
      const rect = documentElement.getBoundingClientRect();

      tooltip.textContent = spot.description;

      // Position tooltip appropriately, avoid edges
      let leftPos =
        (e.type.startsWith("touch") ? touch.pageX : e.pageX) - rect.left + 10;
      let topPos =
        (e.type.startsWith("touch") ? touch.pageY : e.pageY) - rect.top - 30;

      // Keep tooltip on screen
      const tooltipWidth = 200; // max-width in CSS
      if (leftPos + tooltipWidth > rect.width) {
        leftPos = rect.width - tooltipWidth - 10;
      }

      tooltip.style.left = `${leftPos}px`;
      tooltip.style.top = `${topPos}px`;
      tooltip.style.visibility = "visible";
      tooltip.style.opacity = "1";

      // Highlight corresponding item in the list
      document.querySelectorAll(".item").forEach((item) => {
        item.classList.remove("active");
        if (item.dataset.id === spot.id) {
          item.classList.add("active");

          // On mobile, scroll to the active item
          if (window.innerWidth <= 768) {
            item.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }
      });
    };

    const hideTooltip = function () {
      hotspot.classList.remove("active");
      tooltip.style.visibility = "hidden";
      tooltip.style.opacity = "0";

      // Remove highlighting with a delay to improve touch experience
      setTimeout(() => {
        document.querySelectorAll(".item").forEach((item) => {
          item.classList.remove("active");
        });
      }, 500);
    };

    // Add both mouse and touch events
    hotspot.addEventListener("mouseover", showTooltip);
    hotspot.addEventListener("mouseout", hideTooltip);
    hotspot.addEventListener("touchstart", showTooltip);
    hotspot.addEventListener("touchend", hideTooltip);

    documentElement.appendChild(hotspot);
  });

  // Adjust hotspots on load and resize
  adjustHotspotsForScreenSize();
  window.addEventListener("resize", adjustHotspotsForScreenSize);

  // Item click event - optimized for both mouse and touch
  document.querySelectorAll(".item").forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent any default behavior
      const id = this.dataset.id;

      // Highlight this item
      document
        .querySelectorAll(".item")
        .forEach((i) => i.classList.remove("active"));
      this.classList.add("active");

      // Find corresponding hotspot and show tooltip
      const hotspot = document.querySelector(`.hotspot[data-id="${id}"]`);
      if (hotspot) {
        const rect = hotspot.getBoundingClientRect();
        const docRect = documentElement.getBoundingClientRect();

        tooltip.textContent = hotspotData.find(
          (spot) => spot.id === id
        ).description;

        // Position tooltip with better mobile experience
        let leftPos = rect.left - docRect.left + rect.width / 2;
        const tooltipWidth = 200; // max-width from CSS

        // Keep tooltip on screen
        if (leftPos + tooltipWidth / 2 > docRect.width) {
          leftPos = docRect.width - tooltipWidth - 10;
        } else if (leftPos - tooltipWidth / 2 < 0) {
          leftPos = 10;
        }

        tooltip.style.left = `${leftPos}px`;
        tooltip.style.top = `${rect.top - docRect.top - 30}px`;
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = "1";

        // Scroll hotspot into view with smooth animation
        documentElement.scrollIntoView({ behavior: "smooth" });

        // Make sure hotspot is visible
        const scrollNeeded =
          rect.top < window.innerHeight * 0.2 ||
          rect.bottom > window.innerHeight * 0.8;

        if (scrollNeeded) {
          hotspot.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }

        // Hide tooltip after a delay - longer on mobile for better reading
        const hideDelay = window.innerWidth <= 768 ? 5000 : 3000;
        setTimeout(() => {
          tooltip.style.visibility = "hidden";
          tooltip.style.opacity = "0";

          // Remove active class after tooltip disappears
          setTimeout(() => {
            document
              .querySelectorAll(".item")
              .forEach((i) => i.classList.remove("active"));
          }, 300);
        }, hideDelay);
      }
    });
  });

  // Toggle between original and translated view
  const toggleButton = document.querySelector(".toggle-mode");
  let translationMode = false;

  toggleButton.addEventListener("click", function () {
    translationMode = !translationMode;

    if (translationMode) {
      document.querySelectorAll(".hotspot").forEach((spot) => {
        spot.style.backgroundColor = "rgba(105, 74, 56, 0.3)";
        spot.style.border = "2px solid rgba(105, 74, 56, 0.8)";
      });
      toggleButton.textContent = "Switch to Original View";
    } else {
      document.querySelectorAll(".hotspot").forEach((spot) => {
        spot.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        spot.style.border = "2px dashed rgba(105, 74, 56, 0.5)";
      });
      toggleButton.textContent = "Switch to Translation View";
    }
  });
});
