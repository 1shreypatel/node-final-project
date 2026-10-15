const express = require('express');
const {registerEnrollmentController,loginEnrollmentController,fetchingEnrollmentController,fetchingSingelEnrollmentController,editEnrollmentController,joinFreeProgramController,initiatePaidEnrollmentController,getMyEnrollmentsController,getCoachProgramEnrolledPlayersController} = require('../../controller/enrollment/enrollmentController');
const { verifyToken, authorizeRoles } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerEnrollmentController);
router.post('/login', loginEnrollmentController);
router.get('/', fetchingEnrollmentController);
router.get('/:id', fetchingSingelEnrollmentController);
router.put('/:id', editEnrollmentController);

router.post('/free', verifyToken, authorizeRoles('player'), joinFreeProgramController);
router.post('/initiate-paid', verifyToken, authorizeRoles('player'), initiatePaidEnrollmentController);
router.get('/my/all', verifyToken, authorizeRoles('player'), getMyEnrollmentsController);
router.get('/program/:programId/players', verifyToken, authorizeRoles('coach'), getCoachProgramEnrolledPlayersController);

module.exports = router;
