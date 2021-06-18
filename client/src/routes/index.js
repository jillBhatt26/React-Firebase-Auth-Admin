import Dashboard from '../components/Dashboard';
import Login from '../components/Login';

const privateRoutes = [{ path: '/', component: Dashboard, exact: true }];

const publicRoutes = [{ path: '/login', component: Login }];

export { privateRoutes, publicRoutes };
