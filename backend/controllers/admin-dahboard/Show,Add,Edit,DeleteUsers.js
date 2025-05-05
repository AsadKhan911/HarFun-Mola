import { User } from "../../models/User/user.js";

// Get all users with role === 'Service User'
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "Service User" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new user
export const addUser = async (req, res) => {
  try {
    const { fullName, email, role, phoneNumber, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const newUser = new User({
      fullName,
      email,
      role,
      phoneNumber,
      password, // In production, hash this
      area: "N/A"
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Edit existing user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) return res.status(404).json({ message: "User not found" });
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

//For Service Providers
export const getAllServiceProviders = async (req, res) => {
    try {
      const providers = await User.find({ role: "Service Provider" });
      res.status(200).json(providers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const addServiceProvider = async (req, res) => {
    try {
      const {
        fullName,
        email,
        phoneNumber,
        password,
        city,
      } = req.body;
  
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: "Email already exists" });
  
      const newProvider = new User({
        fullName,
        email,
        phoneNumber,
        password, // Hash in production
        role: "Service Provider",
        city,
      });
  
      await newProvider.save();
      res.status(201).json(newProvider);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  export const updateServiceProvider = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const updatedProvider = await User.findByIdAndUpdate(id, updatedData, { new: true });
      if (!updatedProvider) return res.status(404).json({ message: "Service provider not found" });
  
      res.status(200).json(updatedProvider);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  export const deleteServiceProvider = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedProvider = await User.findByIdAndDelete(id);
      if (!deletedProvider) return res.status(404).json({ message: "Service provider not found" });
  
      res.status(200).json({ message: "Service provider deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };  
  