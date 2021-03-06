const express = require('express');
const router = express.Router();
const Ride = require('../models/ride-model');
const User = require('../models/user-model');
const axios = require('axios');

// Get all rides 
router.get('/rides', async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; 
    const allrides = await Ride.find({date:{ $gt: today}}, null, {
    sort: {
      date: 1
    }
  }).populate("user");
    res.status(200).json(allrides);
  } catch (e) {
    res.status(500).json(`error occurred ${e}`);
  }
});
// Get all rides 
router.get('/rides/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const allrides = await Ride.find({user: userId}, null, {
    sort: {
      date: 1
    }
  })
    res.status(200).json(allrides);
  } catch (e) {
    res.status(500).json(`error occurred ${e}`);
  }
});

// Create Ride
router.post('/rides', async (req, res) => {
  const loggedUser = req.user;
  const {
    departure,
    arrival,
    date,
    time,
    description
  } = req.body
  
  if (!departure || !arrival || !date || !time) {
    res.status(400).json('missing fields');
    return
  }
  try {
    const response = await Ride.create({
      departure,
      arrival,
      date,
      time,
      description,
      user: loggedUser
    });
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json(`error occurred ${e}`);
  }
});

// Delete Ride

router.delete('/rides/:id', async (req, res) => {
  try {
    await Ride.findByIdAndRemove(req.params.id);
    res.status(200).json(`ride with ID:${req.params.id} deleted`)
  } catch (e) {
    res.status(500).json(`error occurred ${e}`);
  }
});

// Get by ID
router.get('/rides/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('user');
    res.status(200).json(ride);
  } catch (e) {
    res.status(500).json(`error occurred ${e}`);
  }
});

//Update Ride

router.put('/rides/:id', async (req, res) => {
  const {
    departure,
    arrival,
    date,
    time,
    description,
  } = req.body;
  try {
    await Ride.findByIdAndUpdate(req.params.id, {
      departure,
      arrival,
      date,
      time,
      description,
    });
    res.status(200).json(`ride with ID:${req.params.id} updated`);
  } catch (e) {
    res.status(500).json(`error occurred ${e}`);
  }
});

// get weather





module.exports = router;