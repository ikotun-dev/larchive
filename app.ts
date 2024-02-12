import express, { Express, Request, Response } from 'express'
import db from './models/db'
import { error } from 'console'
import { createUserTable } from './models/user'
import userRouter from './controllers/user'
import { createLinkTable } from './models/link'
import linkRouter from './controllers/link'
console.log("lets see")
const app = express()
const port = 3000

createUserTable();
createLinkTable();

db.serialize();

app.use(express.json())

app.get("/", async (req, res) => {
  res.json({ "message": "api works." })

})

app.use("/auth", userRouter)
app.use("/link", linkRouter)

app.listen(port, () => { console.log("running") })

