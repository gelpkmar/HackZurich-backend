const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "db-pamada-stories-dev-instance-1.c1rsnucp9nzz.eu-central-1.rds.amazonaws.com",
  database: "postgres",
  password: "lI6wgCLeL2E62T5ASDmg",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;
