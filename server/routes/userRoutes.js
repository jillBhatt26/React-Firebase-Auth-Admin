// Express Router imports
const { Router } = require('express');

// controllers imports
const {
    CreateNewUser,
    UpdateUser,
    DeleteUser,
    GetUserOne,
    GetAllUsers,
    AssignAdminStatus,
    revokeAdminStatus
} = require('../controllers/userControllers');

// router init
const router = Router();

// middleware imports
const CheckAdmin = require('../middleware/CheckAdmin');

// routes definitions
router.get('/user/:uid', GetUserOne);

router.get('/users', GetAllUsers);

router.post('/user/create/:uid', CheckAdmin, CreateNewUser);

router.put('/user/assignAdmin/:uid', AssignAdminStatus);

router.put('/user/revokeAdmin/:uid', revokeAdminStatus);

router.put('/user/update/:uid', UpdateUser);

router.delete('/user/delete/:uid', DeleteUser);

// router exports
module.exports = router;
