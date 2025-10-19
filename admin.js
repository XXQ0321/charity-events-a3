// Admin Panel JavaScript
const API_BASE_URL = window.location.origin + "/api";

let currentEditingEventId = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
});

async function initializeAdminPanel() {
    await loadDashboardData();
}

function showAdminPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.admin-page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const pageElement = document.getElementById(pageName + '-page');
    if (pageElement) {
        pageElement.classList.add('active');
        
        // Update page title
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            const titles = {
                'dashboard': 'Dashboard',
                'events': 'Manage Events',
                'create-event': 'Create Event',
                'edit-event': 'Edit Event'
            };
            pageTitle.textContent = titles[pageName] || 'Admin Panel';
        }
        
        // Load page-specific data
        if (pageName === 'dashboard') {
            loadDashboardData();
        } else if (pageName === 'events') {
            loadEventsTable();
        }
    }
    
    // Update active nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    const activeNavItem = document.querySelector(`.nav-item[onclick*="${pageName}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
}

async function loadDashboardData() {
    try {
        const eventsResponse = await fetch(`${API_BASE_URL}/events`);
        const events = await eventsResponse.json();
        
        // Update stats
        document.getElementById('total-events').textContent = events.length;
        
        const upcomingEvents = events.filter(event => event.status === 'upcoming').length;
        document.getElementById('upcoming-events').textContent = upcomingEvents;
        
        // Load total registrations (this would need a separate endpoint)
        // For now, we'll use a placeholder
        document.getElementById('total-registrations').textContent = '10+';
        
        // Display recent events
        displayRecentEvents(events.slice(0, 5));
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        alert('Error loading dashboard data');
    }
}

function displayRecentEvents(events) {
    const container = document.getElementById('recent-events');
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = '<p>No events found.</p>';
        return;
    }
    
    const eventsHtml = events.map(event => `
        <div class="event-item">
            <div class="event-info">
                <h4>${event.name}</h4>
                <div class="event-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(event.event_start_date)}</span>
                    <span class="status-badge status-${event.status}">${event.status.toUpperCase()}</span>
                </div>
            </div>
            <div class="action-buttons">
                <button class="action-btn edit" onclick="editEvent(${event.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = eventsHtml;
}

async function loadEventsTable() {
    try {
        const response = await fetch(`${API_BASE_URL}/events`);
        const events = await response.json();
        
        displayEventsTable(events);
    } catch (error) {
        console.error('Error loading events:', error);
        alert('Error loading events');
    }
}

function displayEventsTable(events) {
    const tbody = document.getElementById('events-table-body');
    if (!tbody) return;
    
    if (events.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No events found.</td></tr>';
        return;
    }
    
    const eventsHtml = events.map(event => `
        <tr>
            <td>${event.name}</td>
            <td>${event.category}</td>
            <td>${event.location}</td>
            <td>${formatDate(event.event_start_date)}</td>
            <td><span class="status-badge status-${event.status}">${event.status.toUpperCase()}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editEvent(${event.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete" onclick="deleteEvent(${event.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    tbody.innerHTML = eventsHtml;
}

// Create Event Form Handler
document.getElementById('create-event-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const eventData = {
        name: formData.get('name'),
        category: formData.get('category'),
        location: formData.get('location'),
        event_start_date: formData.get('event_start_date'),
        event_end_date: formData.get('event_end_date'),
        image_url: formData.get('image_url'),
        description: formData.get('description'),
        purpose: formData.get('purpose'),
        ticket_price: parseFloat(formData.get('ticket_price')) || 0,
        goal_amount: parseFloat(formData.get('goal_amount')) || 0,
        registration_form: formData.get('registration_form')
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });
        
        if (response.ok) {
            alert('Event created successfully!');
            e.target.reset();
            showAdminPage('events');
        } else {
            const error = await response.json();
            alert(`Error creating event: ${error.error}`);
        }
    } catch (error) {
        console.error('Error creating event:', error);
        alert('Error creating event');
    }
});

// Edit Event
async function editEvent(eventId) {
    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
        const event = await response.json();
        
        // Populate edit form
        document.getElementById('edit-event-id').value = event.id;
        document.getElementById('edit-event-name').value = event.name;
        document.getElementById('edit-event-category').value = event.category;
        document.getElementById('edit-event-location').value = event.location;
        document.getElementById('edit-event-image').value = event.image_url || '';
        document.getElementById('edit-event-start-date').value = event.event_start_date;
        document.getElementById('edit-event-end-date').value = event.event_end_date;
        document.getElementById('edit-event-description').value = event.description || '';
        document.getElementById('edit-event-purpose').value = event.purpose || '';
        document.getElementById('edit-ticket-price').value = event.ticket_price || 0;
        document.getElementById('edit-goal-amount').value = event.goal_amount || 0;
        document.getElementById('edit-registration-form').value = event.registration_form || '';
        
        currentEditingEventId = eventId;
        showAdminPage('edit-event');
    } catch (error) {
        console.error('Error loading event for edit:', error);
        alert('Error loading event for editing');
    }
}

// Edit Event Form Handler
document.getElementById('edit-event-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!currentEditingEventId) return;
    
    const formData = new FormData(e.target);
    const eventData = {
        name: formData.get('name'),
        category: formData.get('category'),
        location: formData.get('location'),
        event_start_date: formData.get('event_start_date'),
        event_end_date: formData.get('event_end_date'),
        image_url: formData.get('image_url'),
        description: formData.get('description'),
        purpose: formData.get('purpose'),
        ticket_price: parseFloat(formData.get('ticket_price')) || 0,
        goal_amount: parseFloat(formData.get('goal_amount')) || 0,
        registration_form: formData.get('registration_form')
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/events/${currentEditingEventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });
        
        if (response.ok) {
            alert('Event updated successfully!');
            showAdminPage('events');
        } else {
            const error = await response.json();
            alert(`Error updating event: ${error.error}`);
        }
    } catch (error) {
        console.error('Error updating event:', error);
        alert('Error updating event');
    }
});

// Update the deleteEvent function in admin.js
async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Event deleted successfully!');
            loadEventsTable();
        } else {
            const error = await response.json();
            alert(`Error deleting event: ${error.error}`);
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event');
    }
}

// Delete Current Event (from edit page)
async function deleteCurrentEvent() {
    if (currentEditingEventId) {
        await deleteEvent(currentEditingEventId);
    }
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
