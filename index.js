// nodenpmexercise/index.js

// Import necessary modules
const express = require('express'); // Express.js for building the web server
const cors = require('cors');     // CORS middleware to allow cross-origin requests

const app = express(); // Create an Express application instance
const port = 3001;     // Define the port the server will listen on

// Middleware
app.use(cors()); // Enable CORS for all routes, allowing the frontend to access the API
app.use(express.json()); // Enable parsing of JSON request bodies. This is essential for POST requests to read 'request.body'.

app.use(express.static('dist'));

// --- Phonebook Data ---
// This is our initial mock data for the phonebook entries.
// In a real application, this would come from a database.
let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

// --- Helper function to generate a new ID ---
// This function generates a new unique ID for a person.
// It finds the maximum ID currently in the persons array and increments it.
// If the array is empty, it starts from 1.
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0;
  return maxId + 1;
};

// --- API Endpoints ---

// GET / (Root path)
// This endpoint provides a basic confirmation that the server is running.
app.get('/', (request, response) => {
  console.log('GET / request received.');
  response.send('<h1>Phonebook Backend is Running!</h1>');
});

// GET /api/persons
// This endpoint returns all phonebook entries.
app.get('/api/persons', (request, response) => {
  console.log('GET /api/persons request received.');
  response.json(persons); // Send the 'persons' array as a JSON response
});

// GET /info
// This endpoint provides information about the phonebook.
app.get('/info', (request, response) => {
  const numberOfEntries = persons.length;
  const currentTime = new Date(); // Get the current date and time

  console.log('GET /info request received.');
  // Send an HTML response with the number of entries and the current time
  response.send(
    `<div>
      <p>Phonebook has info for ${numberOfEntries} people</p>
      <p>${currentTime}</p>
    </div>`
  );
});

// GET /api/persons/:id
// This endpoint retrieves a single phonebook entry by its ID.
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id); // Get the ID from the URL parameters and convert to a number
  const person = persons.find((p) => p.id === id); // Find the person with the matching ID

  if (person) {
    // If the person is found, send their data as JSON
    console.log(`GET /api/persons/${id} request received. Found person:`, person.name);
    response.json(person);
  } else {
    // If the person is not found, send a 404 Not Found status
    console.log(`GET /api/persons/${id} request received. Person not found.`);
    response.status(404).end();
  }
});

// POST /api/persons
// This endpoint allows adding a new phonebook entry.
app.post('/api/persons', (request, response) => {
  try { // Added try-catch block to catch unexpected errors
    const body = request.body; // Access the request body

    // Log the request data to the console as requested
    console.log('POST /api/persons request received. Request data (request.body):', body);

    // Check if the name or number is missing
    if (!body.name || !body.number) {
      console.log('Error: Name or number is missing.');
      return response.status(400).json({
        error: 'name or number missing'
      });
    }

    // Check if the name already exists in the phonebook
    const nameExists = persons.some(person => person.name === body.name);
    if (nameExists) {
      console.log(`Error: Name '${body.name}' already exists.`);
      return response.status(409).json({ // 409 Conflict status
        error: 'name already exists'
      });
    }

    // Create a new person object with a generated ID
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(), // Assign a unique ID
    };

    // Add the new person to the persons array
    persons = persons.concat(person);

    console.log('New person added:', person);
    // Send the newly created person object as a JSON response
    response.status(201).json(person); // 201 Created status
  } catch (error) {
    // If any unexpected error occurs, log it and send a 500 Internal Server Error
    console.error('Unhandled error in POST /api/persons:', error);
    response.status(500).json({ error: 'An unexpected error occurred on the server.' });
  }
});


// --- Server Start ---
const PORT = process.env.PORT || 3001
// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// To run this backend:
// 1. Navigate to your 'myphonebookapp/nodenpmexercise' directory in your terminal.
// 2. Install dependencies: `npm install express cors`
// 3. Run the server: `node index.js`
// You should see "Server running on port 3001" in your terminal.
// You can now add new persons from your frontend, and the request data will be logged here.
// If a 500 error still occurs, check the backend terminal for the detailed error message.
