const express = require('express');
const router = express.Router();  
var operationController = require('../controller/operationController')

router.get('/', operationController.checksesssion ,operationController.getAddPointPage);

router.post('/addpoint',operationController.checksesssion,operationController.addPoint);

router.get('/list', operationController.checksesssion,operationController.getPointList);

router.get('/assign',operationController.checksesssion,operationController.getAssignPage);

router.post('/cluster',operationController.checksesssion,operationController.cluster);

router.post('/adddist',operationController.checksesssion,operationController.addDist);


module.exports = router;