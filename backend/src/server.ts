import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { auditLogMiddleware } from "./middleware/auditLog.js";

// We will dynamically import these inside startServer to prevent top-level crashes
let User: any;
let Patient: any;
let sequelize: any;
let authRoutes: any;
let departmentRoutes: any;
let queueRoutes: any;
let ehrRoutes: any;
let pharmacyRoutes: any;
let vitalsRoutes: any;
let hashPassword: any;


dotenv.config();

const app = express();

// Global Error Handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

// Middleware
app.use(cors({ origin: true, credentials: true })); // More permissive for debugging
app.use(express.json());
app.use(auditLogMiddleware);

// Health check (MOVE TO TOP to bypass DB check for diagnostics)
app.get("/api/v1/health", (req: Request, res: Response) => {
  res.json({ 
    status: "ok", 
    dbReady: isDbReady,
    hasDbError: !!dbError,
    env: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL
  });
});

// Diagnostic Ping Route
app.get("/api/v1/ping", (req: Request, res: Response) => {
  res.json({ status: "pong", message: "Server is alive and routing works!" });
});

// DB Readiness Check
app.use((req: Request, res: Response, next: express.NextFunction) => {
  // Allow health and ping to pass through if they weren't matched above
  if (req.path === "/api/v1/health" || req.path === "/api/v1/ping") {
    return next();
  }

  if (isDbReady) {
    return next();
  }
  
  if (dbError) {
    console.error("Blocking request due to DB error:", dbError);
    res.status(500).json({ 
      error: "Database initialization failed", 
      details: dbError.message || "Unknown error",
      stack: process.env.NODE_ENV === "development" ? dbError.stack : undefined
    });
    return;
  }
  
  res.status(503).json({ error: "Server is starting up, please try again in a moment" });
});

// Sync database and start server
const PORT = process.env.PORT || 5000;

const HARDCODED_ADMIN = {
  name: "System Admin",
  email: "admin@hdms.local",
  password: "AdminPassword123",
};

const cleanupSqliteBackupTables = async (): Promise<void> => {
  if (sequelize.getDialect() !== "sqlite") {
    return;
  }

  const [results] = await sequelize.query(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE '%_backup'",
  );

  const backupTableNames = (results as Array<{ name: string }>).map(
    (row) => row.name,
  );

  for (const tableName of backupTableNames) {
    await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\``);
    console.warn(`Dropped stale SQLite backup table: ${tableName}`);
  }
};

const ensurePatientProfiles = async (): Promise<void> => {
  const patientUsers: any[] = await User.findAll({
    where: { role: "patient" },
  });
  let createdCount = 0;

  for (const user of patientUsers) {
    const existingProfile = await Patient.findOne({
      where: { user_id: user.id },
    });
    if (!existingProfile) {
      await Patient.create({
        user_id: user.id,
        date_of_birth: new Date("1970-01-01"),
      });
      createdCount += 1;
    }
  }

  if (createdCount > 0) {
    console.log(`Backfilled ${createdCount} missing patient profile(s)`);
  }
};

const ensureHardcodedAdmin = async (): Promise<void> => {
  const existingAdmin: any = await User.findOne({
    where: { email: HARDCODED_ADMIN.email },
  });

  if (existingAdmin) {
    return;
  }

  const passwordHash = await hashPassword(HARDCODED_ADMIN.password);

  await User.create({
    name: HARDCODED_ADMIN.name,
    email: HARDCODED_ADMIN.email,
    password_hash: passwordHash,
    role: "admin",
  });

  console.warn(
    `Hardcoded admin created: ${HARDCODED_ADMIN.email} / ${HARDCODED_ADMIN.password}`,
  );
};

let isDbReady = false;
let dbError: any = null;

const startServer = async (): Promise<void> => {
  try {
    console.log("Starting server initialization...");
    
    // Dynamic imports to prevent top-level crashes
    const dbModule = await import("./config/database.js");
    sequelize = dbModule.default;
    
    const modelsModule = await import("./models/index.js");
    User = modelsModule.User;
    Patient = modelsModule.Patient;
    
    const authUtilsModule = await import("./utils/authUtils.js");
    hashPassword = authUtilsModule.hashPassword;
    
    authRoutes = (await import("./routes/authRoutes.js")).default;
    departmentRoutes = (await import("./routes/departmentRoutes.js")).default;
    queueRoutes = (await import("./routes/queueRoutes.js")).default;
    ehrRoutes = (await import("./routes/ehrRoutes.js")).default;
    pharmacyRoutes = (await import("./routes/pharmacyRoutes.js")).default;
    vitalsRoutes = (await import("./routes/vitalsRoutes.js")).default;

    // Register Routes after they are loaded
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/departments", departmentRoutes);
    app.use("/api/v1/queue", queueRoutes);
    app.use("/api/v1/ehr", ehrRoutes);
    app.use("/api/v1/prescriptions", pharmacyRoutes);
    app.use("/api/v1/vitals", vitalsRoutes);

    await sequelize.authenticate();
    console.log("Database connection successful");

    const syncAlterEnabled = process.env.DB_SYNC_ALTER !== "false";

    if (sequelize.getDialect() === "sqlite") {
      await cleanupSqliteBackupTables();
      await sequelize.sync();
    } else {
      await sequelize.sync({ alter: syncAlterEnabled });
    }

    console.log("Database synchronized");

    await ensureHardcodedAdmin();
    await ensurePatientProfiles();

    isDbReady = true;
  } catch (error) {
    dbError = error;
    console.error("Failed to start server initialization:", error);
  } finally {
    app.listen(PORT, () => {
      console.log(`Server process listening on port ${PORT}`);
    });
  }
};

// Start initialization but don't block
startServer();

export default app;
