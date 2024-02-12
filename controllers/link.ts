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

const fetchUserLinks = async (req: Request, res: Response) => {
  let token;
  try {
    token = req.headers.authorization!.split(' ')[1]
  } catch (e) {
    return res.json({ "error": e.message }).status(400)
  }
  console.log(token)

  if (!token) {
    res.json({ "message": "unauthorized" }).status(401)
  }
  let decodedToken: any;
  try {
    decodedToken = jwt.verify(token, "collins")
  } catch (err: any) {
    console.log(err.message)
  }
  var fetchUserLinksQuery = `SELECT * FROM links WHERE user_id = ( ? )`
  db.all(fetchUserLinksQuery, [decodedToken.userId], (fetchErr, links: any) => {
    if (fetchErr) {
      console.log(fetchErr.message)
    } {
      const linkUrls = links.map((link: any) => ({ id: link.id, url: link.url }))
      return res.json({ "data": linkUrls }).status(200)
    }
  })

}

const DeleteSingleLinks = async (req: Request, res: Response) => {
  const token = req.headers.authorization!.split(' ')[1]
  const linkId = req.body!.linkId
  if (!token) {
    res.json({ "message": "unauthorized" }).status(401)
  }
  let decodedToken: any;
  try {
    decodedToken = jwt.verify(token, "collins")
  } catch (err: any) {
    console.log(err.message)
  }
  var deleteLinkQuery = `DELETE FROM links WHERE id = ( ? )`
  var checkIfLinkExistQuery = `SELECT * FROM links WHERE id = ( ? )`

  db.get(checkIfLinkExistQuery, [linkId], (error, existingLink) => {
    console.log("checkIfLinkExistQuery...")
    if (error) {
      console.log(error.message)
      return res.json({ "error": error.message }).status(404)
    }
    if (!existingLink) {
      return res.json({ "message": "Link not found." }).status(404)
    }
    db.run(deleteLinkQuery, [linkId], (error) => {
      if (error) {
        console.log(error.message)
        return res.json({ "message": "link not found" }).status(404)
      } return res.json({ "message": "link deleted succeefully" }).status(200)
    })
  })
}


linkRouter.delete("/", DeleteSingleLinks)
linkRouter.get("/", fetchUserLinks)
linkRouter.post("/", addNewLink)


export default linkRouter


