const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'xxq2004',
    database: 'charityevents',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}

async function executeQuery(sql, params = []) {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Query execution failed:', error);
        throw error;
    }
}

async function getAllEvents(filters = {}) {
    let sql = `
        SELECT e.*, ed.description, ed.purpose, ed.ticket_price, 
               ed.goal_amount, ed.current_amount, ed.registration_form,
               CASE 
                   WHEN e.event_end_date < CURDATE() THEN 'past'
                   WHEN e.event_start_date <= CURDATE() AND e.event_end_date >= CURDATE() THEN 'ongoing'
                   ELSE 'upcoming'
               END as status
        FROM event e 
        LEFT JOIN event_detail ed ON e.id = ed.event_id 
        WHERE e.is_violated = FALSE
    `;
    
    const params = [];
    
    if (filters.category) {
        sql += ' AND e.category = ?';
        params.push(filters.category);
    }
    
    if (filters.location) {
        sql += ' AND e.location LIKE ?';
        params.push(`%${filters.location}%`);
    }
    
    if (filters.dateFrom) {
        sql += ' AND e.event_start_date >= ?';
        params.push(filters.dateFrom);
    }
    
    if (filters.dateTo) {
        sql += ' AND e.event_end_date <= ?';
        params.push(filters.dateTo);
    }
    
    sql += ' ORDER BY e.event_start_date ASC';
    
    return await executeQuery(sql, params);
}

async function getEventById(eventId) {
    const sql = `
        SELECT e.*, ed.description, ed.purpose, ed.ticket_price, 
               ed.goal_amount, ed.current_amount, ed.registration_form,
               CASE 
                   WHEN e.event_end_date < CURDATE() THEN 'past'
                   WHEN e.event_start_date <= CURDATE() AND e.event_end_date >= CURDATE() THEN 'ongoing'
                   ELSE 'upcoming'
               END as status
        FROM event e 
        LEFT JOIN event_detail ed ON e.id = ed.event_id 
        WHERE e.id = ? AND e.is_violated = FALSE
    `;
    
    const results = await executeQuery(sql, [eventId]);
    return results[0] || null;
}

async function getEventRegistrations(eventId) {
    const sql = `
        SELECT * FROM registrations 
        WHERE event_id = ? 
        ORDER BY registration_date DESC
    `;
    return await executeQuery(sql, [eventId]);
}

async function createRegistration(registrationData) {
    const sql = `
        INSERT INTO registrations (event_id, full_name, email, phone, ticket_quantity, total_amount)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
        registrationData.event_id,
        registrationData.full_name,
        registrationData.email,
        registrationData.phone,
        registrationData.ticket_quantity,
        registrationData.total_amount
    ];
    
    const result = await executeQuery(sql, params);
    return result.insertId;
}

async function createEvent(eventData) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const eventSql = `
            INSERT INTO event (name, category, location, event_start_date, event_end_date, image_url)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const eventParams = [
            eventData.name,
            eventData.category,
            eventData.location,
            eventData.event_start_date,
            eventData.event_end_date,
            eventData.image_url || 'https://via.placeholder.com/400x200?text=Event+Image'
        ];
        
        const [eventResult] = await connection.execute(eventSql, eventParams);
        const eventId = eventResult.insertId;
        
        const detailSql = `
            INSERT INTO event_detail (event_id, description, purpose, ticket_price, goal_amount, registration_form)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const detailParams = [
            eventId,
            eventData.description,
            eventData.purpose,
            eventData.ticket_price || 0,
            eventData.goal_amount || 0,
            eventData.registration_form || ''
        ];
        
        await connection.execute(detailSql, detailParams);
        await connection.commit();
        
        return eventId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function updateEvent(eventId, eventData) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const eventSql = `
            UPDATE event 
            SET name = ?, category = ?, location = ?, event_start_date = ?, event_end_date = ?, image_url = ?
            WHERE id = ?
        `;
        const eventParams = [
            eventData.name,
            eventData.category,
            eventData.location,
            eventData.event_start_date,
            eventData.event_end_date,
            eventData.image_url,
            eventId
        ];
        
        await connection.execute(eventSql, eventParams);
        
        const detailSql = `
            UPDATE event_detail 
            SET description = ?, purpose = ?, ticket_price = ?, goal_amount = ?, registration_form = ?
            WHERE event_id = ?
        `;
        const detailParams = [
            eventData.description,
            eventData.purpose,
            eventData.ticket_price,
            eventData.goal_amount,
            eventData.registration_form,
            eventId
        ];
        
        await connection.execute(detailSql, detailParams);
        await connection.commit();
        
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// 在 event_db.js 中更新 deleteEvent 函数
async function deleteEvent(eventId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        // 先删除 event_detail 表中的记录
        const deleteDetailSql = 'DELETE FROM event_detail WHERE event_id = ?';
        await connection.execute(deleteDetailSql, [eventId]);
        
        // 然后删除 event 表中的记录
        const deleteEventSql = 'DELETE FROM event WHERE id = ?';
        const [result] = await connection.execute(deleteEventSql, [eventId]);
        
        await connection.commit();
        
        return result.affectedRows > 0;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function markEventViolated(eventId) {
    const sql = 'UPDATE event SET is_violated = TRUE WHERE id = ?';
    return await executeQuery(sql, [eventId]);
}

async function getCategories() {
    const sql = 'SELECT DISTINCT category FROM event WHERE is_violated = FALSE ORDER BY category';
    const results = await executeQuery(sql);
    return results.map(row => row.category);
}

module.exports = {
    testConnection,
    executeQuery,
    getAllEvents,
    getEventById,
    getEventRegistrations,
    createRegistration,
    createEvent,
    updateEvent,
    deleteEvent,
    markEventViolated,
    getCategories
};
