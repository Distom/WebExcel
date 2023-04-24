import { localStore } from '../../core/utils';

const defaultState = {
	colsState: {},
	rowsState: {},
	cellsState: {},
};

export default localStore('excelState') ?? defaultState;
