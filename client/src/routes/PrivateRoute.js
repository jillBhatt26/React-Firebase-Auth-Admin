// react
import React, { Component } from 'react';

// react-redux
import { connect } from 'react-redux';

// actions
import { LogIn } from '../actions/AuthActions';

// react-router-dom
import { Route, Redirect } from 'react-router-dom';

import { withRouter } from 'react-router-dom';

class PrivateRoute extends Component {
    state = {
        Component: null,
        currentUser: null
    };

    render() {
        const { component: Component, ...rest } = this.props;

        const { currentUser } = this.props.auth;

        return (
            <Route
                {...rest}
                render={props => {
                    return currentUser ? (
                        <Component {...props} />
                    ) : (
                        <Redirect to="/login" />
                    );
                }}
            />
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(PrivateRoute));
