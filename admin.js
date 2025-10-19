// server.js 
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./event_db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Test database connection on startup
async function initializeDatabase() {
    const isConnected = await db.testConnection();
    if (!isConnected) {
        console.error('Failed to connect to database. Server will not start.');
        process.exit(1);
    }
}

// API Routes


app.get('/api/events', async (req, res) => {
    try {
        const filters = {
            category: req.query.category,
            location: req.query.location,
            dateFrom: req.query.dateFrom,
            dateTo: req.query.dateTo
        };
        
       
        Object.keys(filters).forEach(key => {
            if (filters[key] === undefined) {
                delete filters[key];
            }
        });
        
        const events = await db.getAllEvents(filters);
        res.json(events);
    } catch (error) {
        console.error('Error getting events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 获取单个事件详情 - 添加这个路由
app.get('/api/events/:id', async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        if (isNaN(eventId)) {
            return res.status(400).json({ error: 'Invalid event ID' });
        }
        
        const event = await db.getEventById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        res.json(event);
    } catch (error) {
        console.error('Error getting event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Update the delete route in server.js
app.delete('/api/events/:id', async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        if (isNaN(eventId)) {
            return res.status(400).json({ error: 'Invalid event ID' });
        }
        
        // First check if there is a registration record.
        const registrations = await db.getEventRegistrations(eventId);
        if (registrations.length > 0) {
            return res.status(400).json({ 
                error: `Cannot delete event with ${registrations.length} existing registration(s)` 
            });
        }
        
        const success = await db.deleteEvent(eventId);
        if (!success) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/events/:id/registrations', async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        if (isNaN(eventId)) {
            return res.status(400).json({ error: 'Invalid event ID' });
        }
        
        const registrations = await db.getEventRegistrations(eventId);
        res.json(registrations);
    } catch (error) {
        console.error('Error getting registrations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/registrations', async (req, res) => {
    try {
        const { event_id, full_name, email, phone, ticket_quantity } = req.body;
        
        
        if (!event_id || !full_name || !email || !phone || !ticket_quantity) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        
        const event = await db.getEventById(event_id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        const total_amount = event.ticket_price * ticket_quantity;
        
        const registrationData = {
            event_id,
            full_name,
            email,
            phone,
            ticket_quantity,
            total_amount
        };
        
        const registrationId = await db.createRegistration(registrationData);
        res.status(201).json({ 
            message: 'Registration successful', 
            registration_id: registrationId,
            total_amount: total_amount
        });
    } catch (error) {
        console.error('Error creating registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/events', async (req, res) => {
    try {
        const eventData = req.body;
        
        
        if (!eventData.name || !eventData.category || !eventData.location || 
            !eventData.event_start_date || !eventData.event_end_date) {
            return res.status(400).json({ error: 'Required fields missing' });
        }
        
        const eventId = await db.createEvent(eventData);
        res.status(201).json({ 
            message: 'Event created successfully', 
            event_id: eventId 
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.put('/api/events/:id', async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        if (isNaN(eventId)) {
            return res.status(400).json({ error: 'Invalid event ID' });
        }
        
        const eventData = req.body;
        await db.updateEvent(eventId, eventData);
        
        res.json({ message: 'Event updated successfully' });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.delete('/api/events/:id', async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        if (isNaN(eventId)) {
            return res.status(400).json({ error: 'Invalid event ID' });
        }
        
        await db.deleteEvent(eventId);
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        if (error.message === 'Cannot delete event with existing registrations') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.put('/api/events/:id/violate', async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        if (isNaN(eventId)) {
            return res.status(400).json({ error: 'Invalid event ID' });
        }
        
        await db.markEventViolated(eventId);
        res.json({ message: 'Event marked as violated successfully' });
    } catch (error) {
        console.error('Error marking event as violated:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/categories', async (req, res) => {
    try {
        const categories = await db.getCategories();
        res.json(categories);
    } catch (error) {
        console.error('Error getting categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'admin.html'));
});


app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});


async function startServer() {
    await initializeDatabase();
    app.listen(PORT, () => {
        console.log(`Charity Events API server running on port ${PORT}`);
        console.log(`Access the client website at: http://localhost:${PORT}`);
        console.log(`Access the admin website at: http://localhost:${PORT}/admin`);
    });
}

startServer();
