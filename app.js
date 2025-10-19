
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
function createEventCard(event) {
  const card = document.createElement("div");
  card.className = "event-card";
  card.setAttribute('data-event-id', event.id); // 添加数据属性用于调试

  const statusClass = `status-${event.status}`;
  const progress = event.goal_amount
    ? Math.round((event.current_amount / event.goal_amount) * 100)
    : 0;

  card.innerHTML = `
        <img src="${event.image_url}" alt="${event.name}" class="event-image">
        <div class="event-content">
            <span class="event-category">${event.category}</span>
            <h3 class="event-title">${event.name}</h3>
            <div class="event-status ${statusClass}">${event.status.toUpperCase()}</div>
            <div class="event-meta">
                <span><i class="fas fa-calendar"></i> ${formatDate(event.event_start_date)}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
            </div>
            <p class="event-description">${event.description ? event.description.substring(0, 100) + '...' : 'No description available.'}</p>
            ${event.ticket_price > 0 ? `<div class="event-price">$${event.ticket_price} per ticket</div>` : ''}
            <div class="event-actions">
                <button class="btn btn-primary view-details-btn" onclick="showEventDetail(${event.id})" data-event-id="${event.id}">View Details</button>
                <button class="btn btn-danger delete-btn" onclick="confirmDelete(${event.id}, '${event.name.replace(/'/g, "\\'")}')">Delete</button>
            </div>
        </div>
    `;

  return card;
}
async function showEventDetail(eventId) {
  console.log('Attempting to show event details for ID:', eventId);
  
  if (!eventId || isNaN(eventId)) {
    console.error('Invalid event ID:', eventId);
    showAlert('Invalid event ID. Please try again.');
    return;
  }

  try {
    const container = document.getElementById("event-detail-content");
    if (container) {
      container.innerHTML = '<div class="loading">Loading event details...</div>';
    }

    const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const event = await response.json();
    console.log('Event data loaded successfully:', event);
    
    let registrations = [];
    try {
      const registrationsResponse = await fetch(`${API_BASE_URL}/events/${eventId}/registrations`);
      if (registrationsResponse.ok) {
        registrations = await registrationsResponse.json();
      }
    } catch (regError) {
      console.warn('Could not load registrations:', regError);
    
    }
    
    displayEventDetail(event, registrations);
    showPage("event-detail");
    
  } catch (error) {
    console.error("Error loading event details:", error);
    
  
    const errorMessage = error.message.includes('HTTP error') 
      ? `Server error: ${error.message}` 
      : 'Error loading event details. Please check your connection and try again.';
    
    showAlert(errorMessage);
    
    
    const container = document.getElementById("event-detail-content");
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <h3>Error Loading Event Details</h3>
          <p>${errorMessage}</p>
          <button class="btn btn-primary" onclick="showPage('home')">Return to Home</button>
        </div>
      `;
      showPage("event-detail");
    }
  }
}

function displayEventDetail(event, registrations) {
  const container = document.getElementById("event-detail-content");
  if (!container) return;

  const progress = event.goal_amount
