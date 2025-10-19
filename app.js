
  initializeApp();
  setupDeleteModal();

  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-primary') && 
        (e.target.textContent.includes('View Details') || e.target.closest('.btn-primary')?.textContent.includes('View Details'))) {
      
      const button = e.target.classList.contains('btn-primary') ? e.target : e.target.closest('.btn-primary');
      if (button) {
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes('showEventDetail')) {
          const match = onclickAttr.match(/showEventDetail\((\d+)\)/);
          if (match && match[1]) {
            const eventId = parseInt(match[1]);
            showEventDetail(eventId);
          }
        } else {
          const eventId = button.getAttribute('data-event-id');
          if (eventId) {
            showEventDetail(parseInt(eventId));
          }
        }
      }
    }
  });
});

async function initializeApp() {
  await loadCategories();
  await loadAllEvents();
  showPage("home");
}

function showPage(pageName) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => (page.style.display = "none"));

  const pageElement = document.getElementById(pageName + "-page");
  if (pageElement) {
    pageElement.style.display = "block";
    if (pageName === "home") {
      displayEventsByCategory();
    } else if (pageName === "search") {
      const resultsContainer = document.getElementById("search-results");
      if (resultsContainer) {
        resultsContainer.innerHTML = "";
      }
    } else if (pageName === "event-detail") {

    const detailContent = document.getElementById("event-detail-content");
      if (detailContent && detailContent.innerHTML.trim() === '') {
        setTimeout(() => {
          if (detailContent.innerHTML.trim() === '') {
            showPage('home');
          }
        }, 100);
      }
    }
  }

  updateActiveNavLink(pageName);
}

function updateActiveNavLink(pageName) {
  const navLinks = document.querySelectorAll(".nav-menu a");
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("onclick") && link.getAttribute("onclick").includes(`'${pageName}'`)) {
      link.classList.add("active");
    }
  });
}

async function loadCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    categories = await response.json();
    
    const categorySelect = document.getElementById("category");
    if (categorySelect) {
      categorySelect.innerHTML = '<option value="">All Categories</option>';
      
      categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categorySelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

async function loadAllEvents() {
  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    allEvents = await response.json();
  } catch (error) {
    console.error("Error loading events:", error);
  }
}
function displayEventsByCategory() {
  const container = document.getElementById("events-container");
  if (!container) return;
  
  container.innerHTML = "";
  
  const eventsByCategory = {};
  allEvents.forEach((event) => {
    if (!eventsByCategory[event.category]) {
      eventsByCategory[event.category] = [];
    }
    eventsByCategory[event.category].push(event);
  });

  Object.keys(eventsByCategory)
    .sort()
    .forEach((category) => {
      const categorySection = createCategorySection(
        category,
        eventsByCategory[category]
      );
      container.appendChild(categorySection);
    });
}

function createCategorySection(category, events) {
  const section = document.createElement("div");
  section.className = "category-section";

  const header = document.createElement("div");
  header.className = "category-header";
  header.innerHTML = `
        <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
        <span class="toggle-icon">▼</span>
    `;
  header.onclick = () => toggleCategory(section);

  const eventsContainer = document.createElement("div");
  eventsContainer.className = "category-events";

  events.forEach((event) => {
    const eventCard = createEventCard(event);
    eventsContainer.appendChild(eventCard);
  });

  section.appendChild(header);
  section.appendChild(eventsContainer);

  return section;
}

function toggleCategory(categorySection) {
  const eventsContainer = categorySection.querySelector(".category-events");
  const toggleIcon = categorySection.querySelector(".toggle-icon");

  if (eventsContainer.classList.contains("active")) {
    eventsContainer.classList.remove("active");
    toggleIcon.textContent = "▼";
  } else {
    eventsContainer.classList.add("active");
    toggleIcon.textContent = "▲";
  }
}
