/**
 * HighStudy API Environment & Configuration Service
 */

export interface ApiConfig {
  port: number;
  environment: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  corsOrigin: string | string[];
  databaseUrl: string;
  geminiApiKey: string;
}

export const loadConfig = (): ApiConfig => ({
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'highstudy-super-secret-production-key-2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/highstudy',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
});
