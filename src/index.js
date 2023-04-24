import './index.scss';
import './index.html';
import Excel from './js/components/excel/Excel';
import Header from './js/components/header/Header';
import Toolbar from './js/components/toolbar/Toolbar';
import Formula from './js/components/formula/Formula';
import Table from './js/components/table/Table';
import createStore from './js/core/createStore';
import rootReducer from './js/components/store/rootReducer';
import initialState from './js/components/store/initialState';
import { localStore } from './js/core/utils';

const store = createStore(rootReducer, initialState);

store.subscribe(state => {
	localStore('excelState', state);
});

const excel = new Excel('#app', {
	components: [Header, Toolbar, Formula, Table],
	store,
});

excel.render();
