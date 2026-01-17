const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

(async ()=>{
  try{
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: parseInt(process.env.DB_PORT||3306)
    });
    const [rows1] = await conn.query('SELECT CURRENT_USER() as cu');
    console.log('CURRENT_USER:', rows1[0].cu);
    const [rows2] = await conn.query("SELECT User, Host FROM mysql.user WHERE User = ?", [process.env.DB_USER]);
    console.log('mysql.user entries for', process.env.DB_USER, rows2);
    await conn.end();
  }catch(e){
    console.error('ERR', e.message);
    process.exit(1);
  }
})();
