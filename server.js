require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static('public'));

//////////////////////////////////////
//ROUTES TO SERVE HTML FILES
//////////////////////////////////////
// Default route to serve logon.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/logon.html');
});

// Route to serve dashboard.html
app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/public/dashboard.html');
});
//////////////////////////////////////
//END ROUTES TO SERVE HTML FILES
//////////////////////////////////////


/////////////////////////////////////////////////
//HELPER FUNCTIONS AND AUTHENTICATION MIDDLEWARE
/////////////////////////////////////////////////
// Helper function to create a MySQL connection
async function createConnection() {
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
}

// **Authorization Middleware: Verify JWT Token and Check User in Database**
async function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }

        try {
            const connection = await createConnection();

            // Query the database to verify that the email is associated with an active account
            const [rows] = await connection.execute(
                'SELECT email FROM user WHERE email = ?',
                [decoded.email]
            );

            await connection.end();  // Close connection

            if (rows.length === 0) {
                return res.status(403).json({ message: 'Account not found or deactivated.' });
            }

            req.user = decoded;  // Save the decoded email for use in the route
            next();  // Proceed to the next middleware or route handler
        } catch (dbError) {
            console.error(dbError);
            res.status(500).json({ message: 'Database error during authentication.' });
        }
    });
}


const multer = require('multer');
const path = require('path');

// Configure Multer storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Save uploads to the /public/uploads folder
        cb(null, path.join(__dirname, 'public', 'uploads'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        // Create a unique file name using user's email (sanitized) and a timestamp
        const uniqueName = req.user.email.replace(/[@.]/g, '_') + '-' + Date.now() + ext;
        cb(null, uniqueName);
    }
});

// File filter: only allow PNG and JPEG images
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PNG and JPEG allowed.'), false);
    }
};

// Create the Multer upload middleware
const upload = multer({ storage: storage, fileFilter: fileFilter });

/////////////////////////////////////////////////
//END HELPER FUNCTIONS AND AUTHENTICATION MIDDLEWARE
/////////////////////////////////////////////////


//////////////////////////////////////
//ROUTES TO HANDLE API REQUESTS
//////////////////////////////////////
// Route: Create Account
app.post('/api/create-account', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const connection = await createConnection();
        const hashedPassword = await bcrypt.hash(password, 10);  // Hash password

        const [result] = await connection.execute(
            'INSERT INTO user (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );

        await connection.end();  // Close connection

        res.status(201).json({ message: 'Account created successfully!' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ message: 'An account with this email already exists.' });
        } else {
            console.error(error);
            res.status(500).json({ message: 'Error creating account.' });
        }
    }
});

// Route: Logon
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const connection = await createConnection();

        const [rows] = await connection.execute(
            'SELECT * FROM user WHERE email = ?',
            [email]
        );

        await connection.end();  // Close connection

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in.' });
    }
});

// Route: Get All Email Addresses
app.get('/api/users', authenticateToken, async (req, res) => {
    try {
        const connection = await createConnection();

        const [rows] = await connection.execute('SELECT email FROM user');

        await connection.end();  // Close connection

        const emailList = rows.map((row) => row.email);
        res.status(200).json({ emails: emailList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving email addresses.' });
    }
});

// Route: Get Current User Profile
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const connection = await createConnection();
        const [rows] = await connection.execute(
            'SELECT email, name, bio, position, profile_image, role FROM user WHERE email = ?',
            [req.user.email]
        );
        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving profile details.' });
    }
});



// Route: Update User Profile
app.put('/api/profile', authenticateToken, async (req, res) => {
    const { name, bio, position, role } = req.body;
    try {
        const connection = await createConnection();
        await connection.execute(
            'UPDATE user SET name = ?, bio = ?, position = ?, role = ? WHERE email = ?',
            [name, bio, position, role, req.user.email]
        );
        await connection.end();
        res.status(200).json({ message: 'Profile updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile.' });
    }
});

// Route: Update or Insert Zone Stats (Upsert)
// server.js
app.post('/api/zone-logs', authenticateToken, async (req, res) => {
    const { zone, shots_made, shots_taken } = req.body;
    if (!zone || shots_made === undefined || shots_taken === undefined) {
        return res.status(400).json({ message: 'Zone, shots made, and shots taken are required.' });
    }
    try {
        const connection = await createConnection();
        const query = `
            INSERT INTO user_zone_logs (user_email, zone, shots_made, shots_taken)
            VALUES (?, ?, ?, ?)
        `;
        await connection.execute(query, [
            req.user.email,
            zone,
            shots_made,
            shots_taken
        ]);
        await connection.end();
        res.status(201).json({ message: 'New shot log created successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error inserting new shot log.' });
    }
});



// Route: Get Zone Stats for the Current User
app.get('/api/zone-logs', authenticateToken, async (req, res) => {
    try {
        const connection = await createConnection();
        const [rows] = await connection.execute(`
            SELECT 
                zone, 
                SUM(shots_made) AS total_made, 
                SUM(shots_taken) AS total_taken
            FROM user_zone_logs
            WHERE user_email = ?
            GROUP BY zone
        `, [req.user.email]);
        await connection.end();
        res.status(200).json({ zoneStats: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving zone logs.' });
    }
});

app.post('/api/upload-profile-image', authenticateToken, upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        const imagePath = '/uploads/' + req.file.filename;
        const connection = await createConnection();
        await connection.execute(
            'UPDATE user SET profile_image = ? WHERE email = ?',
            [imagePath, req.user.email]
        );
        await connection.end();
        res.status(200).json({ message: 'Profile image uploaded successfully!', imageUrl: imagePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading profile image.' });
    }
});



//////////////////////////////////////
//END ROUTES TO HANDLE API REQUESTS
//////////////////////////////////////


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});