// Models imports

// Firebase imports
const { auth } = require('../config/Firebase');

// utils functions imports
const listAllUsers = require('../utils/ListUsers');

// Firebase controllers definitions
const CreateNewUser = async (req, res) => {
    // fetch the user details from the body
    const { phoneNumber, role, displayName } = req.body;

    const { isAdmin } = req;

    if (!isAdmin) {
        return res.json({ error: 'Unauthorized request!' });
    }

    if (!phoneNumber && !role && !displayName) {
        return res.json({ error: 'Missing Fields!' });
    }

    try {
        const userRecord = await auth.createUser({ phoneNumber, displayName });

        // set the role
        if (role === 'Admin') {
            await auth.setCustomUserClaims(userRecord.uid, { admin: true });
        } else {
            await auth.setCustomUserClaims(userRecord.uid, { admin: false });
        }

        const addedUser = await auth.getUser(userRecord.uid).then(user => {
            const role = user.customClaims['admin'] ? 'Admin' : 'Non-Admin';

            return {
                ...user,
                role
            };
        });

        return res.json({ user: addedUser });
    } catch (error) {
        console.log('Add user error: ', error);
        return res.json({ error: error.message });
    }
};

const GetUserOne = async (req, res) => {
    const { uid } = req.params;

    auth.getUser(uid)
        .then(userRecord => {
            return res.json({ user: userRecord });
        })
        .catch(error => {
            return res.json({ err: error.message });
        });
};

const GetAllUsers = async (req, res) => {
    let users = await listAllUsers();

    // get the roles of users
    const usersWithRoles = await Promise.all(
        users.map(async user => {
            const userWithRoles = await auth
                .getUser(user.uid)
                .then(userRecord => {
                    if (userRecord.customClaims) {
                        const role = userRecord.customClaims['admin']
                            ? 'Admin'
                            : 'Non-Admin';

                        return {
                            ...user,
                            role
                        };
                    }
                    return user;
                });

            return userWithRoles;
        })
    );

    res.json({ users: usersWithRoles });
};

const UpdateUser = async (req, res) => {
    const { uid } = req.params;

    // fetch the user details from the body
    const { phoneNumber, role, displayName } = req.body;

    if (!phoneNumber && !role && !displayName) {
        return res.json({ error: 'Missing Fields!' });
    }

    try {
        await auth.updateUser(uid, {
            phoneNumber,
            displayName
        });

        // set the role
        if (role === 'Admin') {
            await auth.setCustomUserClaims(uid, { admin: true });
        } else {
            await auth.setCustomUserClaims(uid, { admin: false });
        }

        const editedUser = await auth.getUser(uid).then(user => {
            const role = user.customClaims['admin'] ? 'Admin' : 'Non-Admin';

            return {
                ...user,
                role
            };
        });

        return res.json({ user: editedUser });
    } catch (error) {
        console.log('Updating Error: ', error);
        return res.json({ error: error.message });
    }
};

const DeleteUser = async (req, res) => {
    const { uid } = req.params;

    auth.deleteUser(uid)
        .then(() => {
            return res.json({
                success: true,
                msg: 'Successfully deleted user'
            });
        })
        .catch(error => {
            return res.json({
                success: false,
                error: error.message
            });
        });
};

const AssignAdminStatus = async (req, res) => {
    const { uid } = req.params;

    auth.setCustomUserClaims(uid, { admin: true })
        .then(() => {
            return res.json({ success: true });
        })
        .catch(err => res.json({ err: err.message }));
};

const revokeAdminStatus = async (req, res) => {
    const { uid } = req.params;

    auth.setCustomUserClaims(uid, { admin: false })
        .then(() => {
            return res.json({ success: true });
        })
        .catch(err => res.json({ err: err.message }));
};

module.exports = {
    CreateNewUser,
    UpdateUser,
    DeleteUser,
    GetUserOne,
    GetAllUsers,
    AssignAdminStatus,
    revokeAdminStatus
};
