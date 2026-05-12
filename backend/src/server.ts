import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global error/readiness state
let dbError: any = null;
let isDbReady = false;

// Shared model references to be populated after dynamic import
let User: any;
let Patient: any;
let hashPassword: any;
let auditLogMiddleware: any;

// Middleware
app.use(cors({ origin: true, credentials: true })); // More permissive for debugging
app.use(express.json());

// Health check (MOVE TO TOP to bypass DB check for diagnostics)
app.get("/api/v1/health", (req: Request, res: Response) => {
  res.json({
    status: isDbReady ? "healthy" : "initializing",
    database: isDbReady ? "connected" : "pending",
    vercel: !!process.env.VERCEL,
    error: dbError ? { message: dbError.message, stack: dbError.stack } : null,
    timestamp: new Date().toISOString()
  });
});

// Middleware to block requests until DB is ready
const checkDbReady = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === "/api/v1/health") return next();
  
  if (dbError) {
    console.error("Blocking request due to DB error:", dbError);
    res.status(500).json({ 
      error: "Database initialization failed", 
      details: dbError.message || "Unknown error",
      stack: dbError.stack
    });
    return;
  }
  
  if (!isDbReady) {
    res.status(503).json({ error: "Server is still warming up. Please try again in 5 seconds." });
    return;
  }
  
  next();
};

app.use(checkDbReady);

// ASYNC INITIALIZATION WRAPPER
const startServer = async () => {
  try {
    console.log("Starting server initialization...");
    
    // Dynamic imports to prevent top-level crashes
    const auditModule = await import("./middleware/auditLog.js");
    auditLogMiddleware = auditModule.auditLogMiddleware;
    app.use(auditLogMiddleware); 

    const dbModule = await import("./config/database.js");
    const sequelizeInstance = dbModule.sequelize;
    
    const modelsModule = await import("./models/index.js");
    User = modelsModule.User;
    Patient = modelsModule.Patient;
    const initModels = modelsModule.initModels;
    
    if (initModels) initModels();
    
    const authUtilsModule = await import("./utils/authUtils.js");
    hashPassword = authUtilsModule.hashPassword;

    // Database Initialization
    console.log("Connecting to database...");
    await sequelizeInstance.authenticate();
    
    if (sequelizeInstance.getDialect() === "sqlite") {
      await sequelizeInstance.sync();
    }
    
    // Register Routes dynamically
    const authRoutes = await import("./routes/authRoutes.js");
    const departmentRoutes = await import("./routes/departmentRoutes.js");
    const vitalsRoutes = await import("./routes/vitalsRoutes.js");
    const queueRoutes = await import("./routes/queueRoutes.js");
    const pharmacyRoutes = await import("./routes/pharmacyRoutes.js");
    const ehrRoutes = await import("./routes/ehrRoutes.js");

    app.use("/api/v1/auth", authRoutes.default);
    app.use("/api/v1/departments", departmentRoutes.default);
    app.use("/api/v1/vitals", vitalsRoutes.default);
    app.use("/api/v1/queue", queueRoutes.default);
    app.use("/api/v1/pharmacy", pharmacyRoutes.default);
    app.use("/api/v1/ehr", ehrRoutes.default);

    console.log("✅ Server initialization complete.");
    isDbReady = true;
  } catch (error) {
    dbError = error;
    console.error("Failed to start server initialization:", error);
  } finally {
    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`Server process listening on port ${PORT}`);
      });
    }
  }
};

startServer();

export default app;
