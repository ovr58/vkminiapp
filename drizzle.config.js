const postgresUri = import.meta.env.VITE_APP_DATABASE_URL
console.log('POSTGRESURI - ', postgresUri)
export default {
    schema: "./config/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: postgresUri,
    }
  };