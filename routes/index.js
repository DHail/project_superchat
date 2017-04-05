const express = require('express');
let router = express.Router();

const index = (io) => {

  router.get('/', (req, res) => {
    res.render('index');
  });

  return router;
};

module.exports = index;
