const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const scheduler = require("./utils/scheduler");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Define Routes
app.use("/api/auth", require("./routes/auth.routes"));
// app.use('/api/users', require('./routes/user.routes'));
// app.use('/api/menstrual-cycles', require('./routes/menstrualCycle.routes'));
// app.use('/api/consultations', require('./routes/consultation.routes'));
// app.use('/api/questions', require('./routes/question.routes'));
// app.use('/api/sti-tests', require('./routes/stiTest.routes'));
// app.use('/api/services', require('./routes/service.routes'));
// app.use('/api/consultants', require('./routes/consultant.routes'));
// app.use('/api/feedback', require('./routes/feedback.routes'));
// app.use('/api/blogs', require('./routes/blog.routes'));
// app.use('/api/dashboard', require('./routes/dashboard.routes'));

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "GenHealth Center API",
      version: "1.0.0",
      description: "API for GenHealth Center System",
    },
    servers: [
      {
        url: `https://your-domain.com/api`, // Thay your-domain.com bằng tên miền thực của bạn
        description: "Production Server",
      },
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/GenHealth-Center", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Initialize scheduler
scheduler.init();

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port http://localhost:${PORT}/GenHealth-Center`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
