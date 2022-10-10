const express = require('express');
const ExpDetailsController = require('../controllers/ExpDetailsController.js');

const Router = express.Router();

const expDetailsController = new ExpDetailsController();

Router.get('/:experiment_id', expDetailsController.get);
Router.post('/:experiment_id', expDetailsController.export);

module.exports = Router;
