import { Admin } from "../../models/admin-dashboard/addUsers.js";

// Admin login
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find admin by email
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({ message: 'Admin not found' });
      }
  
      // Compare password
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error('Error logging in admin:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

