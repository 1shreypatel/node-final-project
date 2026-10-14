const express = require('express');
const {registerRoleController,loginRoleController,fetchingRoleController,fetchingSingelRoleController,editRoleControlle} = require('../../controller/role/roleController');

const router = express.Router();

router.post('/register', registerRoleController);
router.post('/login', loginRoleController);
router.get('/', fetchingRoleController);
router.get('/:id', fetchingSingelRoleController);
router.put('/:id', editRoleController);

module.exports = router;
