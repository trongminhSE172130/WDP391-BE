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
app.use(
  "/api/female-reproductive-tracking",
  require("./routes/femaleReproductiveTracking.routes")
);
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/consultants", require("./routes/consultant.routes"));
app.use(
  "/api/consultant-schedules",
  require("./routes/consultantSchedule.routes")
);
app.use(
  "/api/consultant-bookings",
  require("./routes/consultantBooking.routes")
);

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
        url: `http://localhost:${process.env.PORT || 5000}/api`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  error: {
                    type: "string",
                    example: "Not authorized to access this route",
                  },
                },
              },
            },
          },
        },
        BadRequestError: {
          description: "Invalid request parameters",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  error: {
                    type: "string",
                    example: "Invalid input data",
                  },
                },
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  error: {
                    type: "string",
                    example: "Resource not found",
                  },
                },
              },
            },
          },
        },
      },
    },
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
