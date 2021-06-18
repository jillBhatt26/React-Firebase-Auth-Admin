import axios from 'axios';

const GetLoggedInUserInfo = async uid => {
    try {
        const FetchUserRes = await axios({
            url: `http://localhost:5000/user/${uid}`
        });

        const { user, err } = FetchUserRes.data;

        if (err) {
            return {
                error: err.message
            };
        }

        if (user) {
            return {
                user
            };
        }
    } catch (error) {
        return {
            error: error.message
        };
    }
};

const GetAllUsers = async () => {
    try {
        const FetchUserRes = await axios({
            url: `http://localhost:5000/users`
        });

        const { users } = FetchUserRes.data;

        if (users) {
            return {
                users
            };
        }
    } catch (error) {
        return {
            error: error.message
        };
    }
};

const CreateNewUser = async (addData, uid) => {
    try {
        const AddUserRes = await axios({
            url: `http://localhost:5000/user/create/${uid}`,
            method: 'POST',
            data: addData,
            headers: { 'Content-Type': 'application/json' }
        });

        const { user, error } = AddUserRes.data;

        if (error) {
            return {
                error: error
            };
        }

        if (user) {
            return {
                user
            };
        }
    } catch (error) {
        return {
            error: error.message
        };
    }
};

const UpdateUser = async (uid, editData) => {
    try {
        const UpdateUserRes = await axios({
            url: `http://localhost:5000/user/update/${uid}`,
            method: 'PUT',
            data: editData,
            headers: { 'Content-Type': 'application/json' }
        });

        const { user, err } = UpdateUserRes.data;

        if (err) {
            return {
                error: err
            };
        }

        if (user) {
            return {
                user: user
            };
        }
    } catch (error) {
        return {
            error: error.message
        };
    }
};

const DeleteUser = async uid => {
    try {
        const UpdateUserRes = await axios({
            url: `http://localhost:5000/user/delete/${uid}`,
            method: 'DELETE'
        });

        const { success } = UpdateUserRes.data;

        if (success) {
            return {
                msg: 'User deleted successfully!'
            };
        }

        return {
            msg: 'Error deleting user!'
        };
    } catch (error) {
        return {
            error: error.message
        };
    }
};

const AssignAdminStatus = async uid => {
    try {
        const UpdateUserRes = await axios({
            url: `http://localhost:5000/user/assignAdmin/${uid}`,
            method: 'PUT'
        });

        const { success } = UpdateUserRes.data;

        return {
            success
        };
    } catch (error) {
        return {
            error: error.message
        };
    }
};

const RevokeAdminStatus = async uid => {
    try {
        const UpdateUserRes = await axios({
            url: `http://localhost:5000/user/revokeAdmin/${uid}`,
            method: 'PUT'
        });

        const { success } = UpdateUserRes.data;

        return {
            success
        };
    } catch (error) {
        return {
            error: error.message
        };
    }
};

export {
    GetLoggedInUserInfo,
    GetAllUsers,
    CreateNewUser,
    UpdateUser,
    DeleteUser,
    AssignAdminStatus,
    RevokeAdminStatus
};
