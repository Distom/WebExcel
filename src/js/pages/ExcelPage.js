import Excel from '../components/excel/Excel';
import Formula from '../components/formula/Formula';
import Header from '../components/header/Header';
import Table from '../components/table/Table';
import Toolbar from '../components/toolbar/Toolbar';
import Page from '../core/Page';
import Storage from '../services/Storage';
import Router from '../core/routes/Router';
import createStore from '../core/store/createStore';
import { isEqualObjects, localStorageObj } from '../core/utils';
import initialState from '../store/initialState';
import rootReducer from '../store/rootReducer';

export default class ExcelPage extends Page {
	getRoot() {
		let documentId = new Router().currentHash;

		if (!documentId) {
			documentId = Date.now().toString();
			window.location.hash = documentId;
		}

		this.documentId = documentId;
		this.storageKey = Storage.getDocumentKey(this.documentId);
		const state = initialState(localStorageObj(this.storageKey));
		this.store = createStore(rootReducer, state);

		this.storeUnsub = this.store.subscribe(newState => {
			Storage.saveDocument(this.documentId, newState);
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
			Storage.removeDocument(this.documentId);
		}
	}

	destroy() {
		this.excel.destroy();
		this.storeUnsub();
		this.removeEmptyDocument();
	}
}
