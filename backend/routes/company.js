const express = require('express');
const Company = require('../models/Company'); // your mongoose model
const router = express.Router();
const jwt = require('jsonwebtoken');  // Make sure this is at the top

// POST /api/companies
router.post('/', async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(500).json({ message: 'Error saving company', error: err });
  }
});

// GET /api/companies - Fetch all companies
router.get('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.log('Token verification error:', error);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    // Fetch companies where createdBy matches logged-in user's ID and is not deleted
    const companies = await Company.find({
      isDeleted: false,
      createdBy: decoded.id,
    });

    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching companies', error: err });
  }
});

// PUT /api/companies/:id - Update a company by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json(updatedCompany);
  } catch (err) {
    res.status(500).json({ message: 'Error updating company', error: err });
  }
});

// DELETE user by ID (add in routes/auth.js)
router.delete('/:id', async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      { isDeleted: 1 },  // Soft delete by setting isDeleted to 1
      { new: true }
    );
    if (!deletedCompany) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json({ message: 'Company marked as deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

module.exports = router;
