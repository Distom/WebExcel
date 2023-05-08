import { localStorageObj } from './utils';

export default class Storage {
	static saveDocument(id, state) {
		localStorageObj(this.getDocumentStorageKey(id), state);
	}

	static removeDocument(id) {
		localStorage.removeItem(this.getDocumentStorageKey(id));
	}

	static getDocumentStorageKey(id) {
		return `excelDocument:${id}`;
	}
}
