document.addEventListener('DOMContentLoaded', () => {

	const themeToggle = document.getElementById('theme-toggle');
	const languageToggle = document.getElementById('language-toggle');


	const i18nElements = document.querySelectorAll('[data-i18n]');


	let currentLanguage = 'en';

	const translations = {
		ru: {
			'page-title': 'Страница Дениса',
			hi: 'Привет, я Денис и я FullStack JavaScript Developer',
			2: 'В процессе',
			З: 'Я провожу своё свободное время',

		},
		en: {
			'page-title': "Denis's Page",
			hi: "Hi, I'm Denis and I'm a FullStack JavaScript Developer ",
			2: 'In the process',
			3: 'I spend my free time on',
		},
		es: {
			'page-title': 'Página de Denis',
			hi: 'Hola, soy Denis y soy un desarrollador de JavaScript FullStack',
			2: 'En el proceso',
			3: 'Paso mi tiempo libre,',
		},
	};

	const translationsMeta = {
		ru: {
			description: 'Личный сайт-разработчика d9911: проекты, контакты, технологии и CV.',
			'og:description': 'Личный сайт-разработчика d9911: проекты, контакты, технологии и CV.',
			'twitter:description': 'Личный сайт-разработчика d9911: проекты, контакты, технологии и CV.',
			keywords: 'd9911, разработчик, проекты, портфолио, технологии, frontend, backend, cv, контакты, open source',
		},
		en: {
			description: "Personal website of developer d9911: projects, contact info, technologies, and CV.",
			'og:description': "Personal website of developer d9911: projects, contact info, technologies, and CV.",
			'twitter:description': "Personal website of developer d9911: projects, contact info, technologies, and CV.",
			keywords: 'd9911, developer, projects, portfolio, technologies, frontend, backend, cv, contacts, open source',
		},
		es: {
			description: "Sitio web personal del desarrollador d9911: proyectos, contacto, tecnologías y currículum.",
			'og:description': "Sitio web personal del desarrollador d9911: proyectos, contacto, tecnologías y currículum.",
			'twitter:description': "Sitio web personal del desarrollador d9911: proyectos, contacto, tecnologías y currículum.",
			keywords: 'd9911, desarrollador, proyectos, portafolio, tecnologías, frontend, backend, currículum, contacto, open source',
		},
	};

	function updateMetaTags() {
		const metaTags = document.querySelectorAll('meta[data-i18n-meta]');
		metaTags.forEach((meta) => {
			const key = meta.getAttribute('data-i18n-meta');
			const value = translationsMeta[currentLanguage][key];
			if (value) {
				meta.setAttribute('content', value);
			}
		});
	}

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
		updateMetaTags();
		// If you need to update something else when changing the language
	};

	// Language changer handler
	languageToggle.addEventListener('click', () => {
		//  ru → en → es → ru → …
		if (currentLanguage === 'ru') currentLanguage = 'en';
		else if (currentLanguage === 'en') currentLanguage = 'es';
		else currentLanguage = 'ru';

		translatePage();
	});

	// Change Theme Handler
	themeToggle.addEventListener('click', () => {
		document.body.classList.toggle('dark-theme');
		document.body.classList.toggle('light-theme');
	});

	translatePage();

	// Loading and rendering README.md
	const readmeContainer = document.getElementById('readme-container');

	fetch('../README.md')
		.then((res) => {
			if (!res.ok) throw new Error('Не удалось загрузить README.md');
			return res.text();
		})
		.then((markdown) => {
			// 'marked.parse'' converts Markdown string to HTML string
			const html = marked.parse(markdown);
			readmeContainer.innerHTML = html;
		})
		.catch((err) => {
			console.error(err);
			readmeContainer.innerHTML = '<p>Error while loading content..</p>';
		});
});
