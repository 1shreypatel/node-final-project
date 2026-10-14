const express = require('express');
const {registerTrainingController,loginTrainingController,fetchingTrainingController,fetchingSingelTrainingController,editTrainingController,addSessionController,updateSessionController,deleteSessionController,reorderSessionsController,getProgramSessionsControlle} = require('../../controller/training/trainingContrroller');
const { verifyToken, authorizeRoles } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerTrainingController);
router.post('/login', loginTrainingController);
router.get('/', fetchingTrainingController);
router.get('/:id', fetchingSingelTrainingController);
router.put('/:id', editTrainingController);

router.get('/program/:programId', verifyToken, getProgramSessionsController);
router.post('/session', verifyToken, authorizeRoles('coach'), addSessionController);
router.put('/session/reorder', verifyToken, authorizeRoles('coach'), reorderSessionsController);
router.put('/session/:sessionId', verifyToken, authorizeRoles('coach'), updateSessionController);
router.delete('/session/:sessionId', verifyToken, authorizeRoles('coach', 'admin'), deleteSessionController);

module.exports = router;
