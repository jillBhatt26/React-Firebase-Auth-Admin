import React, { Component } from 'react';

// react-router-dom
import { withRouter } from 'react-router-dom';

// firebase
import { auth } from '../config/Firebase';

// react-redux
import { connect } from 'react-redux';

// actions
import { LogIn, Logout } from '../actions/AuthActions';

// request helpers
import {
    GetLoggedInUserInfo,
    GetAllUsers,
    CreateNewUser,
    UpdateUser,
    DeleteUser,
    AssignAdminStatus,
    RevokeAdminStatus
} from '../helpers/requests';

class Dashboard extends Component {
    state = {
        displayPhoneNumber: '',
        users: [],

        phoneNumber: '',
        displayName: '',
        role: '',

        btnName: 'Add User',
        toEditUser: null,

        adminBtn: 'Grant Admin Status'
    };

    componentDidMount = () => {
        const { uid } = this.props.auth.currentUser;

        // fetch current user info
        GetLoggedInUserInfo(uid)
            .then(res => {
                const { user } = res;

                const { phoneNumber } = user;

                this.setState({
                    ...this.state,
                    displayPhoneNumber: phoneNumber
                });
            })
            .catch(err => console.log('Error: ', err.message));

        // fetch all users info
        GetAllUsers()
            .then(res => {
                const { users } = res;

                this.setState({
                    users
                });
            })
            .catch(err => console.log('error: ', err.message));
    };

    HandleLogout = async () => {
        await auth.signOut();

        // remove the user information from component state
        this.props.logoutUser();

        // redirect to the login page
        this.props.history.push('/login');
    };

    HandleInput = event => {
        this.setState({
            ...this.state,
            [event.target.id]: event.target.value
        });
    };

    HandleReset = () => {
        this.setState({
            ...this.state,
            phoneNumber: '',
            displayName: '',
            role: '',
            btnName: 'Add User'
        });
    };

    HandleCreateUser = event => {
        event.preventDefault();
    };

    HandleEditUser = user => {
        this.setState({
            ...this.state,
            ...user,
            toEditUser: user,
            btnName: 'Edit User'
        });
    };

    HandleDeleteUser = uid => {
        // send delete request
        DeleteUser(uid)
            .then(res => {
                console.log('Delete user res: ', res);

                const users = this.state.users.filter(user => user.uid !== uid);

                this.setState({
                    ...this.state,
                    users
                });
            })
            .catch(err => {
                console.log('Delete User Err: ', err);
            });
    };

    HandleSubmit = event => {
        event.preventDefault();

        if (this.state.btnName === 'Add User') {
            if (
                this.state.displayName &&
                this.state.phoneNumber &&
                this.state.role
            ) {
                const toAddData = {
                    displayName: this.state.displayName,
                    phoneNumber: `+91${this.state.phoneNumber}`,
                    role: this.state.role
                };

                CreateNewUser(toAddData, this.props.auth.currentUser.uid)
                    .then(res => {
                        const { user, error } = res;

                        if (user) {
                            this.setState({
                                ...this.state,
                                users: [...this.state.users, user]
                            });
                        }

                        if (error) {
                            console.log('Error: ', error);
                        }

                        this.HandleReset();
                    })
                    .catch(err => {
                        console.log('Add user err: ', err.message);
                        this.HandleReset();
                    });
            } else {
                alert('Enter all fields.');
            }
        }

        if (this.state.btnName === 'Edit User') {
            const uid = this.state.toEditUser.uid;

            const toEditData = {
                phoneNumber: this.state.phoneNumber,
                displayName: this.state.displayName,
                role: this.state.role
            };

            // Send edit request
            UpdateUser(uid, toEditData)
                .then(res => {
                    const { user, error } = res;

                    if (user) {
                        // find the index of user in users array
                        const idx = this.state.users
                            .map(user => user.uid)
                            .indexOf(user.uid);

                        const editedUser = {
                            uid: user.uid,
                            phoneNumber: user.phoneNumber,
                            role: user.role,
                            displayName: user.displayName
                        };

                        let users = [...this.state.users];
                        users[idx] = editedUser;

                        this.setState({
                            ...this.state,
                            users
                        });
                    }

                    if (error) {
                        console.log('Edit error: ', error);
                    }

                    this.HandleReset();
                })
                .catch(err => {
                    console.log('Edit User Err: ', err);

                    this.HandleReset();
                });
        }
    };

    HandleRevokeAdmin = uid => {
        RevokeAdminStatus(uid)
            .then(res => {
                const { success } = res;

                if (success) {
                    const idx = this.state.users
                        .map(user => user.uid)
                        .indexOf(uid);

                    const users = this.state.users;
                    const edited = users[idx];

                    edited['role'] = 'Non-Admin';

                    users[idx] = edited;

                    this.setState({
                        ...this.state,
                        users
                    });
                }
            })
            .catch(err => console.log(err));
    };

    HandleGrantAdmin = uid => {
        AssignAdminStatus(uid)
            .then(res => {
                const { success } = res;

                if (success) {
                    const idx = this.state.users
                        .map(user => user.uid)
                        .indexOf(uid);

                    const users = this.state.users;
                    const edited = users[idx];

                    edited['role'] = 'Admin';

                    users[idx] = edited;

                    this.setState({
                        ...this.state,
                        users
                    });
                }
            })
            .catch(err => console.log(err));
    };

    render() {
        return (
            <div>
                <h4>Log In User ID: {this.props.auth.currentUser.uid}</h4>

                <h4>Log In Phone: {this.state.displayPhoneNumber}</h4>

                <h2>
                    {this.state.btnName === 'Add User'
                        ? 'Create User'
                        : 'Edited User'}
                </h2>

                <form autoComplete="off" onSubmit={this.HandleSubmit}>
                    <input
                        type="text"
                        id="displayName"
                        placeholder="Enter display name"
                        value={this.state.displayName}
                        onChange={this.HandleInput}
                    />

                    <br />
                    <br />

                    <input
                        type="text"
                        id="phoneNumber"
                        placeholder="Enter Phone Number"
                        value={this.state.phoneNumber}
                        onChange={this.HandleInput}
                    />

                    <br />
                    <br />

                    <input
                        type="text"
                        id="role"
                        placeholder="Enter user role"
                        value={this.state.role}
                        onChange={this.HandleInput}
                    />

                    <br />
                    <br />

                    <button>{this.state.btnName}</button>

                    {this.state.btnName === 'Edit User' && (
                        <button onClick={this.HandleReset}>Clear</button>
                    )}
                </form>

                <h2>All users</h2>

                {this.state.users.map(user => (
                    <div
                        style={{ border: 'solid 1px black', marginTop: '20px' }}
                        key={user.uid}
                    >
                        {user.phoneNumber && <p>Phone: {user.phoneNumber}</p>}
                        {user.uid && <p>ID: {user.uid}</p>}
                        {user.displayName && <p>Name: {user.displayName}</p>}
                        {user.role && <p>Role: {user.role}</p>}
                        <button onClick={() => this.HandleEditUser(user)}>
                            Edit
                        </button>{' '}
                        <button onClick={() => this.HandleDeleteUser(user.uid)}>
                            Delete
                        </button>{' '}
                        {user.role === 'Admin' && (
                            <button
                                onClick={() => this.HandleRevokeAdmin(user.uid)}
                            >
                                Revoke Admin
                            </button>
                        )}
                        {user.role === 'Non-Admin' && (
                            <button
                                onClick={() => this.HandleGrantAdmin(user.uid)}
                            >
                                Grant Admin
                            </button>
                        )}
                    </div>
                ))}

                <button
                    onClick={this.HandleLogout}
                    style={{ marginTop: '50px' }}
                >
                    Logout
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loginUser: user => {
            dispatch(LogIn(user));
        },
        logoutUser: () => {
            dispatch(Logout());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Dashboard));
