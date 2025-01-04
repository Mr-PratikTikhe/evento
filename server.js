const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();
const auth = admin.auth();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test Route
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


const createUser = async (uid, name, email, role) => {
    // Reference to the users collection
    const userRef = firestore.collection('users').doc(uid);
  
    // Check if the user already exists
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      // If the user does not exist, create a new document
      await userRef.set({
        name: name,
        email: email,
        role: role, // 'student' or 'organizer'
        uid: uid
      });
    } else {
      console.log('User already exists.');
    }
  };
  
  // Example usage when a user logs in (replace with actual logic for registration or login)
  const handleUserLogin = async (user) => {
    const { uid, displayName, email } = user; // assuming the user object contains these fields
    const role = 'student'; // Default to 'student', or set based on your app's logic
  
    // Call createUser function
    await createUser(uid, displayName, email, role);
  };
  

  app.post('/register', async (req, res) => {
    const { email, password, name, role } = req.body;  // Assuming you're getting these fields from the request body
  
    try {
      // Create user with Firebase Authentication
      const userRecord = await auth.createUser({
        email: email,
        password: password,
        displayName: name
      });
  
      // After user is created, add user to Firestore
      await createUser(userRecord.uid, name, email, role);
  
      res.status(201).send('User registered successfully!');
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(400).send('Error registering user');
    }
  });
  