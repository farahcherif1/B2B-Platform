import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export const dbConfig: DataSourceOptions = {
  type: 'mysql',
  driver: require('mysql2'),
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  synchronize: false, 
  logging: true,
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
};

// DataSource instance for TypeORM CLI and standalone usage
export const AppDataSource = new DataSource(dbConfig);
