import { localStore } from '../core/utils';

const defaultState = {
	title: 'New table',
	colsState: {},
	rowsState: {},
	cellsState: {},
};

export default localStore('excelState') ?? defaultState;
