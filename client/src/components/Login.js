// react
import React, { Component } from 'react';

// firebase
import { auth, firebase } from '../config/Firebase';

// react-router-dom
import { withRouter } from 'react-router-dom';

// react-redux
import { connect } from 'react-redux';

// actions
import { LogIn } from '../actions/AuthActions';

class Login extends Component {
    state = {
        number: '',
        otp: '',

        isOtpReceived: false,
        btnName: 'Get OTP',

        confirmationResult: null,

        error: ''
    };

    SetupReCaptcha = () => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            'recaptcha-container',
            {
                size: 'invisible'
            }
        );
    };

    // event handlers
    HandleInput = event => {
        this.setState({
            ...this.state,
            [event.target.id]: event.target.value
        });
    };

    HandleLogin = event => {
        event.preventDefault();

        const { number, otp, btnName } = this.state;

        this.SetupReCaptcha();

        const appVerifier = window.recaptchaVerifier;

        // check which button is clicked
        if (btnName === 'Get OTP') {
            if (number && number.length === 10) {
                const phoneNumber = `+91${number}`;
                auth.signInWithPhoneNumber(phoneNumber, appVerifier)
                    .then(confirmationResult => {
                        // SMS sent.

                        window.confirmationResult = confirmationResult;

                        this.setState({
                            ...this.state,
                            confirmationResult,
                            isOtpReceived: true,
                            btnName: 'Login'
                        });
                    })
                    .catch(error => {
                        // Error; SMS not sent

                        console.log('SMS / Captcha Error: ', error.message);

                        this.setState({
                            ...this.state,
                            error: error.message
                        });

                        appVerifier.clear();
                    });
            } else {
                alert('Please enter a valid Number.');
            }
        } else if (btnName === 'Login') {
            if (otp && otp.length === 6) {
                this.state.confirmationResult
                    .confirm(otp)
                    .then(async result => {
                        // User signed in successfully.
                        const user = result.user;

                        // TODO: use redux to dispatch a login action having the user payload
                        this.props.loginUser(user);

                        // redirect to the dashboard page
                        this.props.history.push('/');

                        appVerifier.clear();
                    })
                    .catch(error => {
                        // User couldn't sign in (bad verification code?)

                        console.log('OTP Confirm Error: ', error.message);

                        this.setState({
                            ...this.state,
                            error: error.message
                        });

                        appVerifier.clear();
                    });
            } else {
                alert('Please enter a 6 digit OTP.');
            }
        }
    };

    render() {
        return (
            <div>
                <h1>Login</h1>

                {this.state.error && <div>Error: {this.state.error}</div>}

                <form autoComplete="off" onSubmit={this.HandleLogin}>
                    <div
                        id="recaptcha-container"
                        style={{ display: 'none' }}
                    ></div>

                    {!this.state.isOtpReceived && (
                        <input
                            type="text"
                            name="number"
                            id="number"
                            placeholder="Phone Number"
                            value={this.state.number}
                            onChange={this.HandleInput}
                        />
                    )}

                    {this.state.isOtpReceived && (
                        <input
                            type="text"
                            name="otp"
                            id="otp"
                            placeholder="OTP"
                            value={this.state.otp}
                            onChange={this.HandleInput}
                        />
                    )}

                    <br />
                    <br />

                    <button>{this.state.btnName}</button>
                </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
