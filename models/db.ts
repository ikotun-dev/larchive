import sqlite3 from 'sqlite3'
import { env } from 'process';

const isFlyEnvironment = env.FLY_REGION;

let DB_PATH;
if (isFlyEnvironment) {
  DB_PATH = '/data/db.sqlite'; // Use the Fly.io volume path
} else {
  DB_PATH = '../db.sqlite'; // Adjust this for your local path
}
//const DBSOURCE = '/usr/src/app/data/db.sqlite3
const DBSOURCE = process.env.DB_PATH || 'data/db.sqlite';
console.log(isFlyEnvironment)
console.log(DB_PATH)
let db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error(err.message)
    throw err
  } else {
    console.log("connected to the sqlite Database")
  }
})


export default db

