const express = require('express');
const {registerCoachController,loginCoachController,fetchingCoachController,fetchingSingelCoachController,editCoachController,upsertCoachProfileController,getMyCoachProfileController,getCoachProfileByIdControlle} = require('../../controller/coach/coachController');
const { verifyToken, authorizeRoles } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');

const router = express.Router();

router.post('/register', registerCoachController);
router.post('/login', loginCoachController);
router.get('/', fetchingCoachController);
router.get('/:id', fetchingSingelCoachController);
router.put('/:id', editCoachController);

router.post('/profile', verifyToken, authorizeRoles('coach'), upload.single('profileimage'), upsertCoachProfileController);
router.get('/profile/me', verifyToken, authorizeRoles('coach'), getMyCoachProfileController);
router.get('/profile/:coachId', verifyToken, getCoachProfileByIdController);

module.exports = router;
