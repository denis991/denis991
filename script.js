document.addEventListener('DOMContentLoaded', () => {
	// Ссылки на элементы управления
	const themeToggle = document.getElementById('theme-toggle');
	const languageToggle = document.getElementById('language-toggle');

	// Элементы для мультиязычности: все, у кого есть data-i18n
	const i18nElements = document.querySelectorAll('[data-i18n]');

	// Текущий язык (по умолчанию русский)
	let currentLanguage = 'ru';

	// Объект переводов (добавьте свои ключи и переводы)
	const translations = {
		ru: {
			'page-title': 'Страница Дениса',
			'page-header': 'Добро пожаловать',
			'toggle-theme': 'Переключить тему',
			'toggle-language': 'Переключить язык',
			// добавьте здесь остальные ключи из вашего интерфейса
		},
		en: {
			'page-title': "Denis's Page",
			'page-header': 'Welcome',
			'toggle-theme': 'Toggle Theme',
			'toggle-language': 'Switch Language',
			// например: 'some-key': 'Some English text', …
		},
		es: {
			'page-title': 'Página de Denis',
			'page-header': 'Bienvenido',
			'toggle-theme': 'Cambiar Tema',
			'toggle-language': 'Cambiar Idioma',
			// переводите остальные ключи на испанский
		},
	};

	// Функция для перевода интерфейса
	const translatePage = () => {
		i18nElements.forEach((el) => {
			const key = el.getAttribute('data-i18n');
			const translation = translations[currentLanguage][key];
			if (translation) {
				if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
					el.placeholder = translation;
				} else {
					el.textContent = translation;
				}
			}
		});
		// Если нужно обновить что-то ещё при смене языка, сделайте это здесь
	};

	// Обработчик смены языка
	languageToggle.addEventListener('click', () => {
		// Цикл: ru → en → es → ru → …
		if (currentLanguage === 'ru') currentLanguage = 'en';
		else if (currentLanguage === 'en') currentLanguage = 'es';
		else currentLanguage = 'ru';

		translatePage();
	});

	// Обработчик смены темы
	themeToggle.addEventListener('click', () => {
		document.body.classList.toggle('dark-theme');
		document.body.classList.toggle('light-theme');
	});

	// Сразу делаем начальный перевод (чтобы подставить тексты в <title> и <h1>)
	translatePage();

	// ====================================
	// Загрузка и рендеринг README.md
	// ====================================
	const readmeContainer = document.getElementById('readme-container');

	fetch('README.md')
		.then((res) => {
			if (!res.ok) throw new Error('Не удалось загрузить README.md');
			return res.text();
		})
		.then((markdown) => {
			// Преобразуем Markdown в HTML через marked.js
			const html = marked.parse(markdown);
			readmeContainer.innerHTML = html;
		})
		.catch((err) => {
			console.error(err);
			readmeContainer.innerHTML = '<p>Ошибка при загрузке содержимого.</p>';
		});
});
