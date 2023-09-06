let tg = window.Telegram.WebApp;
tg.expand();
tg.MainButton.textColor = '#ffffff';
tg.MainButton.Color = '#68f516';

window.onload = function() {
	var file = "items.xlsx";
	var req = new XMLHttpRequest();
	req.open("GET", file, true);
	req.responseType = "arraybuffer";

	req.onload = function(e) {
		var data = new Uint8Array(req.response);
		var workbook = XLSX.read(data, {type: "array"});
		var worksheet = workbook.Sheets[workbook.SheetNames[0]];
		var jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

		var productGrid = document.querySelector(".product-grid");
		for (var i = 1; i < jsonData.length; i++) {
			var row = jsonData[i];
			var allColumnsFilled = row[0] && row[1] && row[2];
			if (allColumnsFilled) {
				var productCard = document.createElement("div");
				productCard.classList.add("product-card");

				var image = document.createElement("img");
				image.src = row[0];
				productCard.appendChild(image);

				var title = document.createElement("h3");
				title.innerHTML = row[1];
				productCard.appendChild(title);

				var priceElement = document.createElement("p");
				var priceValue = (row[2]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
				priceElement.innerHTML = priceValue + " ₽";
				productCard.appendChild(priceElement);

				var addButton = document.createElement("button");
				addButton.classList.add("add-button");
				addButton.textContent = "ADD";
				productCard.appendChild(addButton);

				productGrid.appendChild(productCard);
			}
		}

		// Получаем все кнопки "ADD"
		const addButtons = document.querySelectorAll('.add-button');
		// Добавляем обработчик события на каждую кнопку "ADD"
		addButtons.forEach(function(addButton) {
		  addButton.addEventListener('click', function() {
			const counter = document.createElement('div');
			counter.classList.add('counter');
			counter.innerHTML = `
			  <button class="minus-button">-</button>
			  <span class="counter-value">1</span>
			  <button class="plus-button">+</button>
			`;

			addButton.replaceWith(counter);

			const plusButton = counter.querySelector('.plus-button');
			const minusButton = counter.querySelector('.minus-button');
			const counterValue = counter.querySelector('.counter-value');

			plusButton.addEventListener('click', function() {
			  counterValue.textContent = Number(counterValue.textContent) + 1;
			});
			minusButton.addEventListener('click', function() {
			  if (Number(counterValue.textContent) > 1) {
				counterValue.textContent = Number(counterValue.textContent) - 1;
			  } else {
				counter.replaceWith(addButton);
			  }
			});
		  });
		});



	}
	req.send();
}

const helloElement = document.querySelector('.hello');
var username = tg.initDataUnsafe?.user.username;
helloElement.textContent = `Добро пожаловать, ${username}`;

document.addEventListener("click", function (l){
	if (l.target.closest('.add-button')) {
		alert('asd')
	}

});
