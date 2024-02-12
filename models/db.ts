import sqlite3 from 'sqlite3'

const DBSOURCE = 'db.sqlite'

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message)
    throw err
  } else {
    console.log("connected to the sqlite Database")
  }
})


export default db

