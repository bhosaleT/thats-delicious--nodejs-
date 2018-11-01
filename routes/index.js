const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeContoller');

const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
// we first pass it to my middleware and then as a next parameter we pass it to homePage.
router.get('/',  catchErrors(storeController.getStores));
router.get('/stores',  catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.post('/add', catchErrors( storeController.createStore));
// 
router.get('/reverse/:name', (req, res) => {
  const reversed = [...req.params.name].reverse().join('');
  res.send(reversed);
})

module.exports = router;