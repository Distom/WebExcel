import './index.scss';
import './index.html';
import Router from './js/core/routes/Router';
import DashboardPage from './pages/DashboardPage';
import ExcelPage from './pages/ExcelPage';

const router = new Router('#app', {
	'/': DashboardPage,
	'/excel': ExcelPage,
});
