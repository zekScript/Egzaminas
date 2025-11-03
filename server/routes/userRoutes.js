import e from "express";

import { getAllUsers, updateTicketStatus, getUserById, logInUser, signInUser, update, deleteUser, addSkelbima, getSkelbimasMadeByUser, searchSkelbimai, getAllSkelbimai, getAllMadeByUserPost, deleteMyListing, updateMylisting, findPostByPostId } from "../controller/userController.js";
import {authenticate, requireAdmin} from "../middleware/middleware.js"
import multer from "multer";
import path from "path";
const route = e.Router();

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
route.get("/users", authenticate, requireAdmin, getAllUsers) // read
route.get("/user/:id", getUserById) // read
route.post("/login", logInUser);
route.put("/update/user/:id", authenticate, requireAdmin, update) // update
route.post("/signin", signInUser)
route.delete("/delete/user/:id", deleteUser) // delete

// Skelbimo restful
route.post(
  "/add_skelbima",
  authenticate,
  upload.array("images", 10), // allow up to 10 images
  addSkelbima
);
route.get("/skelbimai/:id", getSkelbimasMadeByUser)
route.get("/listings/search", searchSkelbimai)
route.get("/allListings", getAllSkelbimai)
route.get("/admin/allListings", requireAdmin, getAllSkelbimai)
route.get("/mylistings/:id", getAllMadeByUserPost)
route.delete("/delete/myListings/:id", deleteMyListing)
route.put("/update/myListing/:id", updateMylisting)
route.put("/update/myListingStatus/:id", updateTicketStatus)
route.get("/findListingByPostId/:id", findPostByPostId)

export default route

