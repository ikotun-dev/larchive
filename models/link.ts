import db from "./db"


export const createLinkTable = () => {
  db.run(`CREATE TABLE links ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url VARCHAR(8000),
    user_id INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)

)`, (error: any) => {
    if (error) {
      console.log(error.message)
      console.log("Link Table already created")

    }
    else {
      console.log("Link Table created.")
    }
  })
}


