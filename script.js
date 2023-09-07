const tg = window.Telegram.WebApp;
tg.expand();

window.onload = function() {

	tg.MainButton.text = 'Сделать заказ'
	tg.MainButton.color = '#f7d460'
	tg.MainButton.textColor = '#ffffff'

	var file = "items.xlsx";
	var req = new XMLHttpRequest();
	req.open("GET", file, true);
	req.responseType = "arraybuffer";

	var counter = 1;
	var productList = [];
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
				productCard.classList.add("product-card", "product-" + counter);

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

				counter++;
			}
		}

		// Получаем все кнопки "ADD"
		const addButtons = document.querySelectorAll('.add-button');
		// Добавляем обработчик события на каждую кнопку "ADD"
		addButtons.forEach(function(addButton) {
		  addButton.addEventListener('click', function() {





		    // ******************************************
			var productCell = this.closest(".product-card");
			var productName = productCell.querySelector("h3").innerHTML;
			var productPrice = (productCell.querySelector("p").innerHTML).replace(/\D/g, '');
			var productCount = 1;

			var product = {
			  name: productName,
			  price: productPrice,
			  count: productCount
			};

			productList.push(product);
			// ******************************************



			const counter = document.createElement('div');
			counter.classList.add('counter');
			counter.innerHTML = `
			  <button class="minus-button">-</button>
			  <span class="counter-value">1</span>
			  <button class="plus-button">+</button>
			`;

			tg.MainButton.show();
			addButton.replaceWith(counter);

			const plusButton = counter.querySelector('.plus-button');
			const minusButton = counter.querySelector('.minus-button');
			const counterValue = counter.querySelector('.counter-value');

			plusButton.addEventListener('click', function() {
			  counterValue.textContent = Number(counterValue.textContent) + 1;
			  product.count++;
			});
			minusButton.addEventListener('click', function() {
			  if (Number(counterValue.textContent) > 1) {
				counterValue.textContent = Number(counterValue.textContent) - 1;
				product.count--;
			  } else {
				counter.replaceWith(addButton);
				// удаляем элемент
				for (var i = 0; i < productList.length; i++) {
					if (productList[i].name === product.name) {
						productList.splice(i, 1);
						if (productList.length === 0) {
							tg.MainButton.hide();
						}
						break; // добавляем break, чтобы прекратить цикл после удаления элемента
					}

				}
			  }
			});
		  });
		});










		const zakaz = document.querySelector('.zakaz');
		zakaz.addEventListener('click', function() {

			// Создаем XMLHttpRequest для отправки запроса к API Telegram
		  	var xhr = new XMLHttpRequest();

		  	const api_key = '6590854077:AAFj3mL6BF75PzZ8B1LBjebgyG1NlJb22hE';
			// const chat_id = tg.initDataUnsafe.user.id;
			const chat_id = '6067411856';
			const title_inv = 'Оплата заказа';
			const descr = 'Оплата товаров в магазине Технологии-будущего';
			const cur = 'RUB';
			const pric = [{ "label": "Телефон", "amount": 10000 }];
			const start_param = 'payment';
			const payload = '123 цифры';
			const provider_token = '1832575495:TEST:55275a6a0956cc10245bad6353d6b652ed82166f58a24ad4b63eab04cedb2e46'

			  xhr.open('GET', `https://api.telegram.org/bot${api_key}/sendInvoice?chat_id=${chat_id}&title=${title_inv}&description=${descr}&payload=${payload}&start_parameter=${start_param}&currency=${cur}&prices=${JSON.stringify(pric)}&provider_token=${provider_token}`);
			  xhr.send();
			
			  xhr.onload = function() {
			    if (xhr.status === 200) {
			      // Получаем ответ от API Telegram
			      var response = JSON.parse(xhr.responseText);
			      
			      // Открываем страницу оплаты
			      window.location.href = response.result.invoice_url;
			    }
			  };
		});









	}
	req.send();
}

document.addEventListener('DOMContentLoaded', function() {
	const helloElement = document.querySelector('.hello');
	var username1 = tg.initDataUnsafe.user.first_name;
	var username2 = tg.initDataUnsafe.user.last_name;
	helloElement.textContent = `Добро пожаловать, ${username1} ${username2}`;
});

