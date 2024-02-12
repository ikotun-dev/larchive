import db from "./db";
export const createUserTable = () => db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255)
)`, (error) => {
  if (error) {
    console.error("Table already created")
  } else {
    console.log("Table User created")
  }
})



