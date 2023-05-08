import './index.scss';
import './index.html';
import Router from './js/core/routes/Router';
import DashboardPage from './pages/DashboardPage';
import ExcelPage from './pages/ExcelPage';

export default new Router('#app', {
	'/': DashboardPage,
	'/excel': ExcelPage,
});
