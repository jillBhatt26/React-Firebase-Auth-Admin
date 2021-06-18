import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

// redux
import { createStore } from 'redux';

// react-redux
import { Provider } from 'react-redux';

// reducer imports
import rootReducer from './reducers';

// react-router-dom
import { BrowserRouter as Router } from 'react-router-dom';

// store creation
const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <App />
            </Router>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
