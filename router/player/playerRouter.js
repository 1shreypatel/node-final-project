const express = require('express');
const {registerPlayerController,loginPlayerController,fetchingPlayerController,fetchingSingelPlayerController,editPlayerController,upsertPlayerProfileController,getMyPlayerProfileControlle} = require('../../controller/player/playerController');
const { verifyToken, authorizeRoles } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');

const router = express.Router();

router.post('/register', registerPlayerController);
router.post('/login', loginPlayerController);
router.get('/', fetchingPlayerController);
router.get('/:id', fetchingSingelPlayerController);
router.put('/:id', editPlayerController);

router.post('/profile', verifyToken, authorizeRoles('player'), upload.single('profileimage'), upsertPlayerProfileController);
router.get('/profile/me', verifyToken, authorizeRoles('player'), getMyPlayerProfileController);

module.exports = router;
