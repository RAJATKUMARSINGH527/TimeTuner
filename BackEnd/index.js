const express = require('express'); 
const {connectToDB} = require('./config/db');
const userRouter = require('./routes/user.routes');
const cors = require('cors');
require('dotenv').config();



const app = express();


// Log all incoming requests for debugging
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from Origin: ${req.headers.origin}`);
//   next();
// });

// // CORS configuration
// app.use(cors({
//   origin: (origin, callback) => {
//     const allowedOrigins = [
//       "http://localhost:5173", // Local development
//       "https://time-tuner-theta.vercel.app", // Production frontend
//     ];
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true, // Enable if you use cookies or auth tokens
// }));

// // Handle preflight OPTIONS requests
// app.options('*', cors());

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());

 //to pass the form data from the frontend to the backend server 
// app.use(express.urlencoded({ extended: false }));


app.use(cors())

// Routes
app.use('/users', userRouter);



// Test endpoint to verify server is alive
app.get('/test', (req, res) => {
  res.json({ message: 'Server is alive' });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  try {
    await connectToDB();
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Error:", error);
  }
});