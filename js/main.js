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
const modalFileInput = document.querySelector('.modal__file-input');
const modalFileBtn = document.querySelector('.modal__file-btn');
const modalImageAdd = document.querySelector('.modal__image-add');
const dataBase = JSON.parse(localStorage.getItem('awito')) || [];
const saveDB = function () {
	localStorage.setItem('awito', JSON.stringify(dataBase));
}

//Сделать очистку инпута файла
const textFileBtn = modalFileBtn.textContent;
const srcModalImg = modalImageAdd.src;

const infoPhoto = {};
modalFileInput.addEventListener('change', (evt) => {
	const target = evt.target;

	const reader = new FileReader();
	const file = target.files[0];

	infoPhoto.filename = file.name;
	infoPhoto.size = file.size;

	reader.readAsBinaryString(file);

	reader.addEventListener('load', (evt) => {
		if ( infoPhoto.size < 2000000 ) {
			modalFileBtn.textContent = infoPhoto.filename;
			infoPhoto.base64 = btoa(evt.target.result);
			modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
		} else {
			modalFileBtn.textContent = 'Превышен размер файла: 2mb';
			modalFileInput.value = '';
		}
	});

});

const renderCard = function () {
	catalog.textContent = '';
	dataBase.forEach( (item, index) => {
		catalog.insertAdjacentHTML('beforeend', `
		<li class="card data-id="${index}">
			<img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="${item.nameItem}">
			<div class="card__descriptionm">
				<h3 class="card__header">${item.nameItem}</h3>
				<div class="card__price">${item.costItem}</div>
			</div>
		</li>
		`);
	})
}

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

// Добавить в универсальное закрытие, закрытие формы после отправки
modalSubmit.addEventListener('submit', (evt) => {
	evt.preventDefault();
	const itemObj = {};

	for ( const elem of elementsModalSubmit ) {
		itemObj[elem.name] = elem.value;
	}

	itemObj.image = infoPhoto.base64;
	dataBase.push(itemObj);
	console.log(dataBase);
	saveDB();
	renderCard();

	modalAdd.classList.add('hide');
	modalSubmit.reset();
})

renderCard();

