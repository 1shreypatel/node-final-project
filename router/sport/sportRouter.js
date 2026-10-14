const express = require('express');
const {registerSportController,loginSportController,fetchingSportController,fetchingSingelSportController,editSportController,createSportController,getAllSportsController,updateSportController,deleteSportControlle} = require('../../controller/sport/sportController');
const { verifyToken, authorizeRoles } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerSportController);
router.post('/login', loginSportController);
router.get('/', fetchingSportController);
router.get('/:id', fetchingSingelSportController);
router.put('/:id', editSportController);

router.post('/', verifyToken, authorizeRoles('admin'), createSportController);
router.put('/admin/:sportId', verifyToken, authorizeRoles('admin'), updateSportController);
router.delete('/:sportId', verifyToken, authorizeRoles('admin'), deleteSportController);

module.exports = router;
