const express = require('express');
const {registerSessionController,loginSessionController,fetchingSessionController,fetchingSingelSessionController,editSessionController,toggleSessionProgressController,getPlayerProgramProgressControlle} = require('../../controller/session/sessionController');
const { verifyToken, authorizeRoles } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerSessionController);
router.post('/login', loginSessionController);
router.get('/', fetchingSessionController);
router.get('/:id', fetchingSingelSessionController);
router.put('/:id', editSessionController);

router.post('/toggle', verifyToken, authorizeRoles('player'), toggleSessionProgressController);
router.get('/program/:programId', verifyToken, authorizeRoles('player'), getPlayerProgramProgressController);

module.exports = router;
