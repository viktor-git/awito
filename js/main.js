'use strict';

const modalAdd = document.querySelector('.modal__add');
const addAd = document.querySelector('.add__ad');
const modalItem = document.querySelector('.modal__item');
const modalBtnSubmit = document.querySelector('.modal__btn-submit');
const modalSubmit = document.querySelector('.modal__submit');
const catalog = document.querySelector('.catalog');
const card = document.querySelector('.card');
const modalBtnWarning = document.querySelector('.modal__btn-warning');
const elementsModalSubmit = [...modalSubmit.elements].filter( (item) => {
	return item.tagName !== 'BUTTON';
});

const dataBase = [];

elementsModalSubmit.forEach( () => {

})

addAd.addEventListener('click', () => {
	modalAdd.classList.remove('hide');
	modalBtnSubmit.setAttribute('disabled', 'true');

	document.addEventListener('keydown', modalFormCloseHandler);
});

catalog.addEventListener('click', (evt) => {
	const target = evt.target;

	if ( target.closest('.card') ) {
		modalItem.classList.remove('hide');
	}
	
	document.addEventListener('keydown', modalFormCloseHandler);
});

// Сделать через this, сделать универсальной под Esc и click
const modalFormClickClose = function (target, modalForm) {

	if ( target.classList.contains('modal__close') ||
		target === modalForm) {
		modalForm.classList.add('hide');

		if ( modalForm === modalAdd) {
			modalSubmit.reset();
		}
	}
};

modalAdd.addEventListener('click', (evt) => {
	const target = evt.target;
	modalFormClickClose(target, modalAdd);
});

modalItem.addEventListener('click', (evt) => {
	const target = evt.target;
	modalFormClickClose(target, modalItem);

});

const modalFormCloseHandler = function (evt) {
	const key = evt.key;
	if ( key === 'Escape' ) {
		modalAdd.classList.add('hide');
		modalItem.classList.add('hide');
		document.removeEventListener('keydown', modalFormCloseHandler);
	}
	
}

// Сделать возврат надписи заполнения полей
modalSubmit.addEventListener('input', () => {
	const validForm = elementsModalSubmit.every( (elem) => {
		return elem.value
	});
	
	if ( validForm ) {
		modalBtnSubmit.removeAttribute('disabled');
		modalBtnWarning.style.display = 'none';
	}
});

modalSubmit.addEventListener('submit', (evt) => {
	evt.preventDefault();
	const itemObj = {};

	for ( const elem of elementsModalSubmit ) {
		itemObj[elem.name] = elem.value;
	}
	dataBase.push(itemObj);
	console.log(dataBase);
})