import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelizeInstance: Sequelize | any;

try {
  sequelizeInstance = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.VERCEL ? '/tmp/database.sqlite' : (process.env.DATABASE_URL || './database.sqlite'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true
    }
  });
} catch (error: any) {
  console.error("CRITICAL: Failed to initialize Sequelize:", error);
  // Provide a dummy object so the top-level import doesn't crash the server.
  // The error will be thrown when server.ts calls authenticate().
  sequelizeInstance = {
    authenticate: async () => { throw error; },
    getDialect: () => 'sqlite',
    sync: async () => { throw error; },
    query: async () => { throw error; },
    define: () => ({})
  } as unknown as Sequelize;
}

export const sequelize = sequelizeInstance as Sequelize;
