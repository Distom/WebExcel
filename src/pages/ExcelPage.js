import Excel from '../js/components/excel/Excel';
import Formula from '../js/components/formula/Formula';
import Header from '../js/components/header/Header';
import Table from '../js/components/table/Table';
import Toolbar from '../js/components/toolbar/Toolbar';
import Page from '../js/core/Page';
import createStore from '../js/core/createStore';
import { localStorageObj } from '../js/core/utils';
import initialState from '../js/store/initialState';
import rootReducer from '../js/store/rootReducer';

export default class ExcelPage extends Page {
	getRoot() {
		const store = createStore(rootReducer, initialState);

		store.subscribe(state => {
			localStorageObj('excelState', state);
		});

		this.excel = new Excel('#app', {
			components: [Header, Toolbar, Formula, Table],
			store,
		});

		return this.excel.getRoot();
	}

	afterRender() {
		this.excel.init();
	}

	destroy() {
		this.excel.destroy();
	}
}
