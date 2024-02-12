import { Request, Response, Router } from "express";
import jwt from 'jsonwebtoken'
import db from "../models/db";

const linkRouter = Router()


const addNewLink = async (req: Request, res: Response) => {
  const token = req.headers.authorization!.split(' ')[1];
  if (!token) {
    res.json({ "message": "unauthorized" }).status(401)
  }
  let decodedToken: any;
  try {
    decodedToken = jwt.verify(token, "collins");
  } catch (error: any) {
    console.log(error.message)
  }
  console.log(decodedToken.userId)

  const linkUrl = req.body?.linkUrl
  if (!linkUrl) {
    res.json({ "message": "please give a link" }).status(400)
  }
  var insertLinkQuery = `INSERT INTO links (url, user_id) VALUES (?, ?)`
  db.run(insertLinkQuery, [linkUrl, decodedToken.userId], (insertErr) => {
    if (insertErr) {
      console.log(insertErr)
    }
    res.json({ "message": "link added succeefully" }).status(201)
  })
}

linkRouter.post("/", addNewLink)

export default linkRouter


