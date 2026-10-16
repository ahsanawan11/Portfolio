"use strict";

/* ==============================
   Configuration
============================== */

// Replace this with your real email address.
const CONTACT_EMAIL = "your-email@example.com";

const projectDetails = {
  tech: {
    title: "Aima Store",
    description:
      "A responsive shopping interface for Led Moddules, Led Strip Lights, " +
      "Aluminium, Promotional Display & Accessories, with clear product " +
      "layouts.",
    tags: ["HTML", "CSS", "JavaScript", "Next.js"]
  },

  agency: {
    title: "Digital Promotix",
    description:
      "A digital Promotix featuring services, " +
      "case studies and contact sections. Designed to present " +
      "business information clearly across screen sizes.",
    tags: ["HTML", "CSS", "JavaScript", "React.js"]
  },

  business: {
    title: "BaBa Hub",
    description:
      "A professional company website concept built around editable content, " +
      "product presentation and straightforward navigation. " +
      "Replace this description with your actual project details.",
    tags: ["WordPress", "Elementor", "WooCommerce", "UI Design"]
  }
};

/* ==============================
   Footer year
============================== */

document.querySelector("#year").textContent =
  new Date().getFullYear();

/* ==============================
   Missing image placeholders
============================== */

document.querySelectorAll("img[data-fallback]").forEach((image) => {
  const showPlaceholder = () => {
    const fallbackClass = image.dataset.fallback;
    const placeholder = image.parentElement.querySelector(
      `.${fallbackClass}`
    );

    image.hidden = true;

    if (placeholder) {
      placeholder.hidden = false;
    }
  };

  image.addEventListener("error", showPlaceholder);

  // Handle an image that failed before this script loaded.
  if (image.complete && image.naturalWidth === 0) {
    showPlaceholder();
  }
});

/* ==============================
   Mobile navigation
============================== */

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
const mobileViewport = window.matchMedia("(max-width: 600px)");

function closeMenu() {
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  menuToggle.textContent = "☰";
}

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("is-open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );

  menuToggle.textContent = isOpen ? "×" : "☰";
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".header-inner")) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

mobileViewport.addEventListener("change", () => {
  closeMenu();
});

/* ==============================
   Theme toggle
============================== */

const themeToggle = document.querySelector(".theme-toggle");

function applyTheme(theme) {
  const isLight = theme === "light";

  document.body.classList.toggle("light-theme", isLight);

  themeToggle.textContent = isLight ? "☾" : "☀";

  themeToggle.setAttribute("aria-pressed", String(isLight));

  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark theme" : "Switch to light theme"
  );
}

try {
  applyTheme(localStorage.getItem("portfolio-theme") || "dark");
} catch {
  applyTheme("dark");
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light-theme")
    ? "dark"
    : "light";

  applyTheme(nextTheme);

  try {
    localStorage.setItem("portfolio-theme", nextTheme);
  } catch {
    // Theme switching still works if browser storage is unavailable.
  }
});

/* ==============================
   Project filters
============================== */

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;

      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });

    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");

      card.hidden =
        selectedFilter !== "all" &&
        !categories.includes(selectedFilter);
    });
  });
});

/* ==============================
   Project details dialog
============================== */

const projectDialog = document.querySelector("#project-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogDescription = document.querySelector(
  "#dialog-description"
);
const dialogTags = document.querySelector("#dialog-tags");
const dialogClose = document.querySelector(".dialog-close");

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => {
    const project = projectDetails[button.dataset.project];

    if (!project) return;

    dialogTitle.textContent = project.title;
    dialogDescription.textContent = project.description;
    dialogTags.replaceChildren();

    project.tags.forEach((tag) => {
      const badge = document.createElement("span");

      badge.className = "badge";
      badge.textContent = tag;

      dialogTags.appendChild(badge);
    });

    projectDialog.setAttribute("aria-labelledby", "dialog-title");
    projectDialog.setAttribute(
      "aria-describedby",
      "dialog-description"
    );

    projectDialog.showModal();
    document.body.classList.add("dialog-open");
  });
});

dialogClose.addEventListener("click", () => {
  projectDialog.close();
});

projectDialog.addEventListener("click", (event) => {
  const bounds = projectDialog.getBoundingClientRect();

  const clickedOutside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (event.target === projectDialog && clickedOutside) {
    projectDialog.close();
  }
});

projectDialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
});

/* ==============================
   Share portfolio
============================== */

const shareButton = document.querySelector("#share-button");
const shareStatus = document.querySelector("#share-status");

shareButton.addEventListener("click", async () => {
  shareStatus.textContent = "";

  if (!["http:", "https:"].includes(window.location.protocol)) {
    shareStatus.textContent =
      "Publish your portfolio first to share its website link.";
    return;
  }

  const shareData = {
    title: document.title,
    text: "Take a look at my portfolio.",
    url: window.location.href.split("#")[0]
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(shareData.url);
      shareStatus.textContent = "Portfolio link copied!";
    } else {
      shareStatus.textContent =
        "Copy your website address from the browser to share it.";
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      shareStatus.textContent =
        "Please copy your website address from the browser.";
    }
  }
});

/* ==============================
   Contact form
============================== */

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  if (CONTACT_EMAIL === "your-email@example.com") {
    formStatus.textContent =
      "Add your email address to CONTACT_EMAIL in script.js first.";
    return;
  }

  const formData = new FormData(contactForm);

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !subject || !message) {
    formStatus.textContent =
      "Please complete every field with your details.";
    return;
  }

  const emailBody = [
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    message
  ].join("\n");

  const mailtoUrl =
    `mailto:${CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(emailBody)}`;

  formStatus.textContent =
    "Opening your email app. Send the prepared message from there.";

  window.location.href = mailtoUrl;
});