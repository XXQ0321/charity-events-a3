
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
 ? Math.round((event.current_amount / event.goal_amount) * 100)
    : 0;

  container.innerHTML = `
        <div class="event-detail-header">
            <img src="${event.image_url}" alt="${event.name}" class="event-detail-image">
            <div class="event-detail-info">
                <h2>${event.name}</h2>
                <div class="event-meta">
                    <p><i class="fas fa-calendar"></i> <strong>Date:</strong> ${formatDate(event.event_start_date)} - ${formatDate(event.event_end_date)}</p>
                    <p><i class="fas fa-map-marker-alt"></i> <strong>Location:</strong> ${event.location}</p>
                    <p><i class="fas fa-tag"></i> <strong>Category:</strong> ${event.category}</p>
                    <p><i class="fas fa-info-circle"></i> <strong>Status:</strong> <span class="event-status status-${event.status}">${event.status.toUpperCase()}</span></p>
                </div>
                <div class="event-actions">
                    <button class="btn btn-primary" onclick="showRegistrationPage(${event.id})">Register for this Event</button>
                    <button class="btn btn-danger" onclick="confirmDelete(${event.id}, '${event.name}')">Delete Event</button>
                </div>
            </div>
        </div>
        
        <div class="event-description">
            <h3>About This Event</h3>
            <p>${event.description || "No description available."}</p>
            
            <h3>Purpose</h3>
            <p>${event.purpose || "No purpose information available."}</p>
        </div>
        
        ${event.goal_amount ? `
            <div class="progress-section">
                <h3>Fundraising Progress</h3>
                <p><strong>Goal:</strong> $${event.goal_amount}</p>
                <p><strong>Current:</strong> $${event.current_amount}</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%">${progress}%</div>
                </div>
            </div>
        ` : ""}
        
        <div class="registration-section">
            <h3>Registration Information</h3>
            <div class="ticket-info">
                <p><strong>Ticket Price:</strong> ${event.ticket_price > 0 ? `$${event.ticket_price}` : "Free"}</p>
                ${event.registration_form ? `<p><strong>Registration Notes:</strong> ${event.registration_form}</p>` : ""}
            </div>
        </div>
        
        <div class="registrations-section">
            <h3>Recent Registrations (${registrations.length})</h3>
            ${registrations.length > 0 ? `
                <div class="registrations-list">
                    ${registrations.map(reg => `
                        <div class="registration-item">
                            <p><strong>${reg.full_name}</strong> - ${reg.ticket_quantity} ticket(s) - $${reg.total_amount}</p>
                            <small>Registered on: ${formatDate(reg.registration_date)}</small>
                        </div>
                    `).join('')}
                </div>
            ` : '<p>No registrations yet. Be the first to register!</p>'}
        </div>
    `;
}

// Registration Page Functions
function showRegistrationPage(eventId) {
    localStorage.setItem('currentEventId', eventId);
    loadRegistrationPageData(eventId);
    showPage('registration');
}

async function loadRegistrationPageData(eventId) {
    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
        const event = await response.json();
        
        // Update event info on registration page
        document.getElementById('registration-event-name').textContent = event.name;
        document.getElementById('registration-event-date').textContent = `Date: ${formatDate(event.event_start_date)} - ${formatDate(event.event_end_date)}`;
        document.getElementById('registration-event-location').textContent = `Location: ${event.location}`;
        document.getElementById('registration-event-price').textContent = `Ticket Price: ${event.ticket_price > 0 ? `$${event.ticket_price}` : 'Free'}`;
        
    } catch (error) {
        console.error('Error loading event details for registration:', error);
        showAlert('Error loading event details. Please try again.');
    }
}

async function handleRegistration(event) {
    event.preventDefault();
    
    // Hide any previous success message
    document.getElementById('success-message').style.display = 'none';
    
    // Validate form
    if (!validateRegistrationForm()) {
        return;
    }
    
    const formData = new FormData(event.target);
    const eventId = parseInt(localStorage.getItem('currentEventId'));
    
    const registrationData = {
        event_id: eventId,
        full_name: formData.get('full_name').trim(),
        email: formData.get('email').trim(),
        phone: formData.get('phone').trim(),
        ticket_quantity: parseInt(formData.get('ticket_quantity'))
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/registrations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationData)
        });

  if (response.ok) {
            const result = await response.json();
            
            // Show success message
            const successMessage = document.getElementById('success-message');
            successMessage.textContent = `Registration successful! ${registrationData.ticket_quantity} ticket(s) have been reserved. Total amount: $${result.total_amount}`;
            successMessage.style.display = 'block';
            
            // Reset form
            event.target.reset();
            
            // Auto-navigate back to event detail page after 3 seconds
            setTimeout(() => {
                showEventDetail(eventId);
            }, 3000);
            
        } else {
            const error = await response.json();
            showAlert(`Registration failed: ${error.error}`);
        }
    } catch (error) {
        console.error('Error submitting registration:', error);
        showAlert('Registration failed. Please try again.');
    }
}

// Form validation function
function validateRegistrationForm() {
    let isValid = true;
    
    // Validate name
    const name = document.getElementById('full-name').value.trim();
    if (!name) {
        showFieldError('name-error', 'Please enter your full name');
        isValid = false;
    } else {
        hideFieldError('name-error');
    }
    
    // Validate email
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showFieldError('email-error', 'Please enter a valid email address');
        isValid = false;
    } else {
        hideFieldError('email-error');
    }
    
    // Validate phone
    const phone = document.getElementById('phone').value.trim();
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const phoneValue = phone.replace(/[^\d+]/g, '');
    if (!phone || !phoneRegex.test(phoneValue) || phoneValue.length < 10) {
        showFieldError('phone-error', 'Please enter a valid phone number');
        isValid = false;
    } else {
        hideFieldError('phone-error');
    }
    
    // Validate ticket quantity
    const ticketQuantity = document.getElementById('ticket-quantity').value;
    if (!ticketQuantity) {
        showFieldError('ticket-error', 'Please select the number of tickets');
        isValid = false;
    } else {
        hideFieldError('ticket-error');
    }
    
    return isValid;
}

// Helper functions for form validation
function showFieldError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
}

function hideFieldError(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = 'none';
}

// Add real-time form validation
document.addEventListener('DOMContentLoaded', function() {
    // Name validation
    const nameInput = document.getElementById('full-name');
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            if (!this.value.trim()) {
                showFieldError('name-error', 'Please enter your full name');
            } else {
                hideFieldError('name-error');
            }
        });
    }
    
    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!this.value.trim() || !emailRegex.test(this.value)) {
                showFieldError('email-error', 'Please enter a valid email address');
            } else {
                hideFieldError('email-error');
            }
        });
    }
    
    // Phone validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const phoneValue = this.value.replace(/[^\d+]/g, '');
            if (!this.value.trim() || !phoneRegex.test(phoneValue) || phoneValue.length < 10) {
                showFieldError('phone-error', 'Please enter a valid phone number');
            } else {
                hideFieldError('phone-error');
            }
        });
    }
    
    // Ticket quantity validation
    const ticketSelect = document.getElementById('ticket-quantity');
    if (ticketSelect) {
        ticketSelect.addEventListener('change', function() {
            if (!this.value) {
                showFieldError('ticket-error', 'Please select the number of tickets');
            } else {
                hideFieldError('ticket-error');
            }
        });
    }
});

// Search Functions
async function handleSearch(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const searchParams = {
    category: formData.get("category"),
    location: formData.get("location"),
    dateFrom: formData.get("dateFrom"),
    dateTo: formData.get("dateTo")
  };

  if (!searchParams.category && !searchParams.location && !searchParams.dateFrom && !searchParams.dateTo) {
    showAlert("Please fill in at least one search field.");
    return;
  }

  try {
    const params = new URLSearchParams();
    if (searchParams.category) params.append("category", searchParams.category);
    if (searchParams.location) params.append("location", searchParams.location);
    if (searchParams.dateFrom) params.append("dateFrom", searchParams.dateFrom);
    if (searchParams.dateTo) params.append("dateTo", searchParams.dateTo);

    const response = await fetch(`${API_BASE_URL}/events?${params}`);
    const results = await response.json();
    displaySearchResults(results);
  } catch (error) {
    console.error("Error searching events:", error);
    showAlert("Error searching events. Please try again.");
  }
}

// 在 displaySearchResults 中也使用相同的方法
function displaySearchResults(results) {
  const container = document.getElementById("search-results");
  if (!container) return;

  if (results.length === 0) {
    container.innerHTML = "<p class='no-results'>No events found matching your criteria.</p>";
    return;
  }

  const resultsHtml = `
        <h3>Search Results (${results.length} events found)</h3>
        <div class="events-grid">
            ${results.map(event => `
                <div class="event-card" data-event-id="${event.id}">
                    <img src="${event.image_url}" alt="${event.name}" class="event-image">
                    <div class="event-content">
                        <span class="event-category">${event.category}</span>
                        <h3 class="event-title">${event.name}</h3>
                        <div class="event-status status-${event.status}">${event.status.toUpperCase()}</div>
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
                </div>
            `).join("")}
        </div>
    `;

  container.innerHTML = resultsHtml;
}
// 添加调试函数到全局作用域
window.debugEvents = function() {
  console.log('All Events:', allEvents);
  console.log('Current Event Registrations:', currentEventRegistrations);
  console.log('Categories:', categories);
  
  // 测试 Vintage Car Auction (假设ID为13)
  const vintageCarEvent = allEvents.find(event => event.name === 'Vintage Car Auction');
  if (vintageCarEvent) {
    console.log('Vintage Car Auction found:', vintageCarEvent);
    console.log('You can test with: showEventDetail(' + vintageCarEvent.id + ')');
  } else {
    console.log('Vintage Car Auction not found in allEvents');
  }
};

function clearSearchForm() {
  const form = document.getElementById("search-form");
  if (form) {
    form.reset();
  }
  const resultsContainer = document.getElementById("search-results");
  if (resultsContainer) {
    resultsContainer.innerHTML = "";
  }
}

// Delete Event Functions
function setupDeleteModal() {
    const deleteModal = document.getElementById('delete-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const closeModalBtn = document.querySelector('.close-btn');
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    }
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', executeDelete);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeDeleteModal);
    }
    
    // Close modal when clicking outside
    if (deleteModal) {
        deleteModal.addEventListener('click', function(e) {
            if (e.target === deleteModal) {
                closeDeleteModal();
            }
        });
    }
}

function closeDeleteModal() {
    const deleteModal = document.getElementById('delete-modal');
    deleteModal.style.display = 'none';
    eventToDelete = null;
}

async function executeDelete() {
    if (!eventToDelete) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventToDelete.id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showAlert(`Event "${eventToDelete.name}" has been successfully deleted.`);
            
            // 重新加载事件数据
            await loadAllEvents();
            
            // 刷新当前视图
            refreshCurrentView();
            
        } else {
            const error = await response.json();
            showAlert(`Error: ${error.error}`);
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        showAlert('Error deleting event. Please try again.');
    } finally {
        closeDeleteModal();
    }
}

function refreshCurrentView() {
    const currentPage = document.querySelector('.page[style*="display: block"]').id.replace('-page', '');
    
    if (currentPage === 'home') {
        displayEventsByCategory();
    } else if (currentPage === 'search') {
        // 如果在搜索页面，清空结果
        document.getElementById('search-results').innerHTML = '';
    } else if (currentPage === 'event-detail') {
        // 如果在事件详情页面，返回首页
        showPage('home');
    }
}

function confirmDelete(eventId, eventName) {
    eventToDelete = { id: eventId, name: eventName };
    
    const deleteModal = document.getElementById('delete-modal');
    const deleteMessage = document.getElementById('delete-message');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    
    // 重置确认按钮状态
    confirmDeleteBtn.style.display = 'block';
    deleteMessage.textContent = `Are you sure you want to delete "${eventName}"? This action cannot be undone.`;
    
    deleteModal.style.display = 'flex';
}

async function markEventViolated(eventId) {
  if (!confirm("Are you sure you want to mark this event as violated? This will hide it from the website.")) {
    return;
  }

  try {
    await fetch(`${API_BASE_URL}/events/${eventId}/violate`, {
      method: "PUT",
    });

    await loadAllEvents();
    
    const currentPage = document.querySelector('.page[style*="display: block"]').id.replace('-page', '');
    if (currentPage === 'home') {
      displayEventsByCategory();
    } else if (currentPage === 'search') {
      showAlert("Event marked as violated and hidden from view.");
    }

    showAlert("Event marked as violated and hidden from view.");
  } catch (error) {
    console.error("Error marking event as violated:", error);
    showAlert("Error marking event as violated. Please try again.");
  }
}

// Utility Functions
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function showAlert(message) {
  alert(message);
}
