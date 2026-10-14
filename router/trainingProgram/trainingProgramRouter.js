const express = require('express');
const {registerTrainingProgramController,loginTrainingProgramController,fetchingTrainingProgaramController,fetchingSingelTrainingProgramController,editTrainingProgramController,createProgramController,submitProgramForApprovalController,updateProgramController,deleteProgramController,getMyCoachProgramsController,reviewProgramController,getAllProgramsAdminController,browseApprovedProgramsController,getProgramByIdControlle} = require('../../controller/trainingProgram/trainingProgramController');
const { verifyToken, authorizeRoles } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');

const router = express.Router();

router.post('/register', registerTrainingProgramController);
router.post('/login', loginTrainingProgramController);
router.get('/', fetchingTrainingProgaramController);
router.get('/approved', verifyToken, browseApprovedProgramsController);
router.get('/:programId', verifyToken, getProgramByIdController);
router.put('/edit/:id', editTrainingProgramController);

router.post('/create', verifyToken, authorizeRoles('coach'), upload.single('image'), createProgramController);
router.get('/my/all', verifyToken, authorizeRoles('coach'), getMyCoachProgramsController);
router.put('/:programId/update', verifyToken, authorizeRoles('coach'), upload.single('image'), updateProgramController);
router.put('/:programId/submit', verifyToken, authorizeRoles('coach'), submitProgramForApprovalController);
router.delete('/:programId', verifyToken, authorizeRoles('coach', 'admin'), deleteProgramController);

router.get('/admin/all', verifyToken, authorizeRoles('admin'), getAllProgramsAdminController);
router.put('/:programId/review', verifyToken, authorizeRoles('admin'), reviewProgramController);

module.exports = router;