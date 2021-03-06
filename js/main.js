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
};

const renderCard = function () {
	catalog.textContent = '';
	dataBase.forEach( (item, index) => {
		catalog.insertAdjacentHTML('beforeend', `
			<li class="card" data-id="${index}">
				<img class="card__image" src="${item.image}" alt="${item.nameItem}">
				<div class="card__descriptionm">
					<h3 class="card__header">${item.nameItem}</h3>
					<div class="card__price">${item.costItem} ₽</div>
				</div>
			</li>
		`);
	});
};

const renderModalCard = function (card) {
	const modalContent = document.querySelector('.modal__item .modal__content');
	modalContent.innerHTML = `
		<div>
			<img class="modal__image modal__image-item" src="${card.image}" alt="${card.nameItem}">
		</div>
		<div class="modal__description">
			<h3 class="modal__header-item">${card.nameItem}</h3>
			<p>Категория: <span class="modal__cat-item">${card.category}</span></p>
			<p>Состояние: <span class="modal__status-item">${card.status}</span></p>
			<p>Описание:
				<span class="modal__description-item">${card.descriptionItem}</span>
			</p>
			<p>Цена: <span class="modal__cost-item">${card.costItem} ₽</span></p>
			<button class="btn">Купить</button>
		</div>`;
};

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
	
	reader.addEventListener('load', (evt) => {
		if ( infoPhoto.size < 2000000 ) {
			modalFileBtn.textContent = infoPhoto.filename;
			modalImageAdd.src = reader.result;
			infoPhoto.src = reader.result;
		} else {
			modalFileBtn.textContent = 'Превышен размер файла: 2mb';
			modalFileInput.value = '';
		}
	});
	console.log(infoPhoto);
	reader.readAsDataURL(file);

});

addAd.addEventListener('click', () => {
	modalAdd.classList.remove('hide');
	modalBtnSubmit.setAttribute('disabled', 'true');

	document.addEventListener('keydown', modalFormCloseHandler);
});

catalog.addEventListener('click', (evt) => {
	const target = evt.target;

	if ( target.closest('.card') ) {
		modalItem.classList.remove('hide');
		renderModalCard(dataBase[target.closest('.card').dataset.id]);
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

	itemObj.image = infoPhoto.src;
	dataBase.push(itemObj);
	console.log(dataBase)
	saveDB();
	renderCard();

	modalAdd.classList.add('hide');
	modalSubmit.reset();
})

renderCard();

