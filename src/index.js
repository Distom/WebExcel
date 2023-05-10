import './index.scss';
import './index.html';
import Router from './js/core/routes/Router';
import DashboardPage from './js/pages/DashboardPage';
import ExcelPage from './js/pages/ExcelPage';

const router = new Router('#app', {
	'/': DashboardPage,
	'/excel': ExcelPage,
});
