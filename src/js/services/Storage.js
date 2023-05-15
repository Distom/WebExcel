import { localStorageObj } from '../core/utils';

export default class Storage {
	static saveDocument(id, state) {
		localStorageObj(this.getDocumentKey(id), state);
	}

	static removeDocument(id) {
		localStorage.removeItem(this.getDocumentKey(id));
	}

	static getDocumentKey(id) {
		return `excelDocument:${id}`;
	}
}
