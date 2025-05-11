import bcrypt from 'bcryptjs';
import { Admin } from '../../models/admin-dashboard/addUsers.js';

// @desc    Get all admins
// @route   GET /api/admin/settings/list
export const listAdmins = async (req, res) => {
    try {
      const admins = await Admin.find({}, 'email _id createdAt updatedAt');
      res.json(admins);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch admins', error: err.message });
    }
  };


// @desc    Add a new admin
// @route   POST /api/admin/settings/add
export const addAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    const newAdmin = new Admin({ email, password });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Edit an existing admin (by ID)
// @route   PUT /api/admin/settings/edit/:id
export const editAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (email) admin.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    await admin.save();
    res.json({ message: 'Admin updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Delete an admin (by ID)
// @route   DELETE /api/admin/settings/delete/:id
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
