import Excel from '../js/components/excel/Excel';
import Formula from '../js/components/formula/Formula';
import Header from '../js/components/header/Header';
import Table from '../js/components/table/Table';
import Toolbar from '../js/components/toolbar/Toolbar';
import Page from '../js/core/Page';
import createStore from '../js/core/createStore';
import { isEqualObjects, localStorageObj } from '../js/core/utils';
import initialState from '../js/store/initialState';
import rootReducer from '../js/store/rootReducer';

export default class ExcelPage extends Page {
	getRoot() {
		this.storageKey = `excelDocument:${this.params}`;
		const state = initialState(localStorageObj(this.storageKey));
		this.store = createStore(rootReducer, state);

		this.store.subscribe(newState => {
			localStorageObj(this.storageKey, newState);
		});

		this.excel = new Excel('#app', {
			components: [Header, Toolbar, Formula, Table],
			store: this.store,
		});

		return this.excel.getRoot();
	}

	afterRender() {
		this.excel.init();
	}

	removeEmptyDocument() {
		const state = this.store.getState();
		delete state.lastOpenedTimestamp;

		if (isEqualObjects(state, initialState())) {
			localStorage.removeItem(this.storageKey);
		}
	}

	destroy() {
		this.excel.destroy();
		this.removeEmptyDocument();
	}
}
