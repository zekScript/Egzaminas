import { User, Post } from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signInUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({ name, email, password: hashedPassword });
    const savedData = await newUser.save();

    res.status(200).json(savedData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const logInUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "You may entered the wrong email" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "You entered the password wrong" });
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        ticketCount: user.ticketCount,
        date: user.date,
      },
      process.env.JWT_SECRET,
      { expiresIn: "62d" }
    );
    return res
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          ticketCount: user.ticketCount,
          date: user.date,
          token,
        },
      });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const userData = await User.find();
    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: "User data not found" });
    }
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User by id not found" });
    }
    res.status(200).json(userExist);
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User by id not found" });
    }
    const updatedData = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedData);
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User by id not found" });
    }
    const deletedData = await User.findByIdAndDelete(id, req.body, {
      new: true,
    });
    res.status(200).json(deletedData);
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
};


export const addSkelbima = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      price
    } = req.body;

    // Get all uploaded image file paths
    const imageUrl = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const newSkelbimas = new Post({
      author: userId,
      imageUrl, // array of image paths
      title,
      description,
      price
    });
    const savedData = await newSkelbimas.save();
    res.status(200).json(savedData);
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const ticketExist = await Post.findById(id);
    if (!ticketExist) {
      return res.status(404).json({ message: "Ticket by id not found" });
    }
    const updatedTicket = await Post.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.status(200).json(updatedTicket);
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
};

export const getSkelbimasMadeByUser = async (req, res) => {
  try {
    const paramsId = req.params.id

    // Find all listings created by that user
    const skelbimai = await Post.find({ _id: paramsId });

    if (!skelbimai || skelbimai.length === 0) {
      return res
        .status(404)
        .json({ message: "No listings found for this user." });
    }

    res.status(200).json({ skelbimai });
  } catch (err) {
        res.status(500).json({ errorMessage: err.message });

  }
};




export const searchSkelbimai = async (req, res) => {
  try {
    const query = {};
    let sortOption = {};

    
    // if (req.query.title) query.title = req.query.title;
    if (req.query.description) query.description = req.query.description;


    // Date filtering
    // if (req.query.startDate && req.query.endDate) {
    //   query.$expr = {
    //     $and: [
    //       { $gte: [{ $year: "$firstRegistration" }, Number(req.query.startDate)] },
    //       { $lte: [{ $year: "$firstRegistration" }, Number(req.query.endDate)] },
    //     ],
    //   };
    // } else if (req.query.startDate) {
    //   query.$expr = {
    //     $eq: [{ $year: "$firstRegistration" }, Number(req.query.startDate)],
    //   };
    // } else if (req.query.endDate) {
    //   query.$expr = {
    //     $eq: [{ $year: "$firstRegistration" }, Number(req.query.endDate)],
    //   };
    // }

    // Sorting
    switch (req.query.sortBy) {
      case "cheapest":
        sortOption = { price: 1 };
        break;
      case "most_expensive":
        sortOption = { price: -1 };
        break;
      case "newest":
        sortOption = { firstRegistration: -1 };
        break;
      case "oldest":
        sortOption = { firstRegistration: 1 };
        break;
      case "mileage_highest":
        sortOption = { mileage: 1 };
        break;
      case "mileage_lowest":
        sortOption = { mileage: -1 };
        break;
      default:
        sortOption = { price: 1 }; 
    }

    const skelbimai = await Post.find(query).sort(sortOption);
    res.status(200).json({ skelbimai, query, sortOption });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
};

export const getAllSkelbimai = async (req, res) => {
try {
    const skelbimaiData = await Post.find();
    if (!skelbimaiData || skelbimaiData.length === 0) {
      return res.status(404).json({ message: "User data not found" });
    }
    res.status(200).json(skelbimaiData);
  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }

}

export const getAllMadeByUserPost = async (req, res) => {
  try{
      const userId = req.params.id;
      const posts = await Post.find({ author: userId });

    if (!posts || posts.length === 0) {
      return res
        .status(404)
        .json({ message: `No post found for this user. ${userId}` });
    }

    res.status(200).json({ posts });
  }
  catch(err){
      res.status(500).json({ errorMessage: err.message });

  }
}

export const deleteMyListing = async (req, res) => {
  try{
    const postID = req.params.id
    const posts = await Post.findByIdAndDelete({_id: postID})
    if(posts.status === 404) {
          res.status(404).json( `Post not found ${postID}` );

    }
    res.status(200).json({ posts });


  }
  catch(err){
    res.status(500).json({ errorMessage: err.message });

  }
}

export const updateMylisting = async (req, res) => {
  try{
    const id = req.params.id
    const {
      description,
      title
    } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        description,
        title
      },
      {new: true}
    )
     if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(updatedPost)

  }
  catch(err){
    res.status(500).json({ errorMessage: err.message });
  }
}


export const findPostByPostId = async (req, res) => {
  try{
    const postID = req.params.id
    const findPostById = await Post.find({_id: postID})
    if(!findPostById){
       res.status(404).json("No data found")
    }
    res.status(200).json({ findPostById });

  }
  catch(err){
        res.status(500).json({ errorMessage: err.message });
  }
}





