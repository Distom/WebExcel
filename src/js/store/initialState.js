import { localStore } from '../core/utils';

const defaultState = {
	title: 'New table',
	colsState: { 0: 250 },
	rowsState: { 0: 107, 1: 143, 2: 150, 3: 150, 4: 150, 5: 150 },
	cellsState: {
		'0:0': {
			data: '<span style="color: orange;">111111111111111</span>22222222222<br><span style="color: red;">333333333333</span><span style="color: blue;">444444444444444</span>',
		},
		'0:1': {
			data: '1111111111111111<br>222222222222222222<br>333333333333333333',
		},
		'0:2': {
			data: '<span style="color:red; font-weight: bold;">1111111111111111<br>222222222222222222<br>333333333333333333</span>',
		},
		'0:3': {
			data: '<span>11111111</span>222222<br>333333333333<span style="color: red; font-weight: bold;">4444444444<br>4444444444444444444444444444444444444</span>',
		},
		'0:4': {
			data: '<span>1111111111111</span>222222<br>333333333333<span>444444444444444</span>5555555555555555555555<br>6666666666666666<br><span>77777777777777</span>',
		},
		'0:5': {
			data: '<span>1111111111111</span>222222<br>333333333333<span>444444444444444</span>5555555555555555555555<br>6666666666666666<br><span>77777777777777</span>',
		},
		'0:6': {
			data: '<span>11111111111111111<br>22222222222222222<br><br><br><br><br><br><br></span>',
		},
		'0:7': {
			data: '<span>11111111111111111<br>22222222222222222</span><br><span>33333333333333</span><br><br><br><br><br><br><br>',
		},
	},
};

// в 6 и 7 примерах не работает выделение. Если якорь или фокус находится не в текстовой ноде в между br, то в селекшн попадает родительский элемент для br. Этот вариант в коде нужно дописать. Нужно обратотать варианты когда br находится в спане или вне спана или один в спане второй вне и тд.

// export default localStore('excelState') ?? defaultState;
export default defaultState;
