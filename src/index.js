import './index.scss';
import './index.html';
import Excel from './js/components/excel/Excel';
import Header from './js/components/header/Header';
import Toolbar from './js/components/toolbar/Toolbar';
import Formula from './js/components/formula/Formula';
import Table from './js/components/table/Table';
import { getScrollBarWidth } from './js/core/utils';

const excel = new Excel('#app', {
	components: [Header, Toolbar, Formula, Table],
});

excel.render();

function updateScrollBarWidthCssProperty() {
	document.documentElement.style.setProperty('--scrollbar-width', `${getScrollBarWidth()}px`);
}

updateScrollBarWidthCssProperty();
window.addEventListener('resize', updateScrollBarWidthCssProperty);
