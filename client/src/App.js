// styles
import './App.css';

// react imports
import React, { Component } from 'react';

// react-router-dom
import { Switch, withRouter } from 'react-router-dom';

// react-redux
import { connect } from 'react-redux';

// actions
import { LogIn } from './actions/AuthActions';

// firebase
import { auth } from './config/Firebase';

// routes imports
import { privateRoutes, publicRoutes } from './routes';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

class App extends Component {
    constructor(props) {
        super(props);

        auth.onAuthStateChanged(user => {
            if (user) {
                this.props.loginUser(user);

                // redirect to dashboard
                this.props.history.push('/');
            }
        });
    }

    state = {};

    render() {
        return (
            <div className="App">
                <Switch>
                    {privateRoutes.map((route, idx) => (
                        <PrivateRoute
                            key={idx}
                            exact={route.exact}
                            path={route.path}
                            component={route.component}
                        />
                    ))}

                    {publicRoutes.map((route, idx) => (
                        <PublicRoute
                            key={idx}
                            path={route.path}
                            component={route.component}
                        />
                    ))}
                </Switch>
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
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
