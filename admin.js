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
