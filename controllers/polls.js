var express = require('express');
var router = express.Router();
// require model file.
var pollModel = require('../models/polls');

router.route('/')
  .get(function(req,res) {
    // Code to fetch the polls.
    var pollObject = new pollModel();
    // Calling our model function.
    pollObject.getAllPolls(function(err,pollResponse) {
      if(err) {
        return res.json({"responseCode" : 1, "responseDesc" : pollResponse});
      }
      res.json({"responseCode" : 0, "responseDesc" : "Success", "data" : pollResponse});
    });
  })
  .post(function(req,res) {
    // Code to add new polls.
    var pollObject = new pollModel();
    // Calling our model function.
    // We nee to validate our payload here.
    pollObject.addNewPolls(req.body,function(err,pollResponse) {
      if(err) {
        return res.json({"responseCode" : 1, "responseDesc" : pollResponse});
      }
      res.json({"responseCode" : 0, "responseDesc" : "Success","data" : pollResponse});
    });
  })
  .put(function(req,res) {
    // Code to update votes of poll.
    var pollObject = new pollModel();
    // Calling our model function.
    // We need to validate our payload here.
    pollObject.votePollOption(req.body,function(err,pollResponse) {
      if(err) {
        return res.json({"responseCode" : 1, "responseDesc" : pollResponse});
      }
      res.json({"responseCode" : 0, "responseDesc" : "Success", "data" : pollResponse});
    });
  });

module.exports = router;
