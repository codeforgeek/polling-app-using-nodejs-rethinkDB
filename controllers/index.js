var express = require('express');
var router = express.Router();

/**
  * @description
  * First route will handle the static html file delievery.
  * Second route will handle the API calls.
*/
router.use('/',require('./home'));
router.use('/polls',require('./polls'));

module.exports = router;
