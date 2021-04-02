const express = require('express');
const ActivityController = require('../controllers/ActivityController');

const Router = express.Router();
const activityController = new ActivityController();

Router.post('/', activityController.create)

module.exports = Router;
