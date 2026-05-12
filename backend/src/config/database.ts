import { Sequelize, Options } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelizeInstance: Sequelize;

const databaseUrl = process.env.DATABASE_URL || '';
const isPostgres = databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://');

const baseOptions: Options = {
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true
  }
};

try {
  if (isPostgres) {
    console.log('Detected PostgreSQL connection string. Connecting to Postgres...');
    sequelizeInstance = new Sequelize(databaseUrl, {
      ...baseOptions,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // Necessary for many hosted providers like Supabase/Neon
        }
      }
    });
  } else {
    console.log('Using SQLite database...');
    sequelizeInstance = new Sequelize({
      ...baseOptions,
      dialect: 'sqlite',
      storage: process.env.VERCEL ? '/tmp/database.sqlite' : (databaseUrl || './database.sqlite')
    });
  }
} catch (error: any) {
  console.error("CRITICAL: Failed to initialize Sequelize instance:", error);
  // Provide a dummy object to prevent top-level crashes
  sequelizeInstance = {
    authenticate: async () => { throw error; },
    getDialect: () => (isPostgres ? 'postgres' : 'sqlite'),
    sync: async () => { throw error; },
    query: async () => { throw error; },
    define: () => ({})
  } as unknown as Sequelize;
}

export const sequelize = sequelizeInstance;
