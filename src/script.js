document.addEventListener('DOMContentLoaded', () => {
	const themeToggle = document.getElementById('theme-toggle');
	const languageToggle = document.getElementById('language-toggle');
	const languageSwitcher = document.getElementById('language-switcher');
	const i18nElements = document.querySelectorAll('[data-i18n]');

	// --- Theme ---
	// Handles theme initialization and switching. Loads theme from localStorage ("dark" or "light") on page load.
	// Updates body class and toggle button icon. Saves user choice to localStorage on toggle.
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme === 'dark') {
		document.body.classList.add('dark-theme');
		document.body.classList.remove('light-theme');
		if (themeToggle) themeToggle.textContent = '🌙';
	} else {
		document.body.classList.remove('dark-theme');
		document.body.classList.add('light-theme');
		if (themeToggle) themeToggle.textContent = '☀️';
	}
	if (themeToggle) {
		themeToggle.addEventListener('click', () => {
			// Toggle theme classes and icon, save to localStorage
			document.body.classList.toggle('dark-theme');
			document.body.classList.toggle('light-theme');
			const isDark = document.body.classList.contains('dark-theme');
			themeToggle.textContent = isDark ? '🌙' : '☀️';
			localStorage.setItem('theme', isDark ? 'dark' : 'light');
		});
	}

	// --- Language detection (query, localStorage, browser) ---
	// Determines the user's language preference in the following order:
	// 1. Query parameter (?lang=ru|en|es)
	// 2. localStorage ("language")
	// 3. Browser language (with region mapping for RU/CIS and ES-speaking countries)
	const languageMap = {
		ru: {
			description: 'Личный сайт-разработчика d9911: проекты, контакты, технологии и CV.',
			keywords: 'd9911, разработчик, проекты, портфолио, технологии, frontend, backend, cv, контакты, open source',
			htmlLang: 'ru',
			translations: {
				'hi': "Привет, я Денис и я FullStack JavaScript Developer",
				'page-title': 'Страница Дениса',
				"process": 'В процессе',
				"free-time-h3": 'Я провожу своё свободное время',
			}
		},
		es: {
			description: 'Sitio web personal del desarrollador d9911: proyectos, contacto, tecnologías y currículum.',
			keywords: 'd9911, desarrollador, proyectos, portafolio, tecnologías, frontend, backend, currículum, contacto, open source',
			htmlLang: 'es',
			translations: {
				'hi': "Hola, soy Denis y soy FullStack JavaScript Developer",
				'page-title': 'Página de Denis',
				"process": 'En el proceso',
				"free-time-h3": 'Paso mi tiempo libre,',
			}
		},
		en: {
			description: 'Personal website of developer d9911: projects, contact info, technologies, and CV.',
			keywords: 'd9911, developer, projects, portfolio, technologies, frontend, backend, cv, contacts, open source',
			htmlLang: 'en',
			translations: {
				'hi': "Hi, I'm Denis and I'm a FullStack JavaScript Developer",
				'page-title': "Denis Page",
				"process": 'In the process',
				"free-time-h3": 'I spend my free time on',
			}
		}
	};

	function getLangFromQuery() {
		// Checks for ?lang=... in the URL and saves to localStorage if valid
		const params = new URLSearchParams(window.location.search);
		const langParam = params.get('lang');
		if (langParam && languageMap[langParam]) {
			localStorage.setItem('language', langParam);
			return langParam;
		}
		return null;
	}

	function detectLanguage() {
		// Returns the preferred language code
		const savedLang = localStorage.getItem('language');
		if (savedLang && languageMap[savedLang]) return savedLang;
		// Если нет в localStorage, определяем и сохраняем
		const queryLang = getLangFromQuery();
		if (queryLang) {
			localStorage.setItem('language', queryLang);
			return queryLang;
		}
		const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
		const shortLang = browserLang.split('-')[0];
		const ruLangs = ['ru', 'uk', 'be', 'kk', 'ky', 'uz', 'ab', 'mo', 'tg', 'tk'];
		const esLangs = ['es', 'mx', 'ar', 'co', 'cl', 'pe', 've', 'ec', 'uy', 'bo', 'py', 'gt', 'cr', 'pa', 'do', 'hn', 'sv', 'ni', 'cu'];
		let detected = 'en';
		if (ruLangs.includes(shortLang)) detected = 'ru';
		else if (esLangs.includes(shortLang)) detected = 'es';
		localStorage.setItem('language', detected);
		return detected;
	}

	let currentLanguage = detectLanguage();

	// --- setLangMeta ---
	// Updates <html lang> and meta description/keywords for SEO and accessibility
	function setLangMeta(lang) {
		const meta = languageMap[lang];
		document.documentElement.lang = meta.htmlLang;
		const desc = document.querySelector('meta[name="description"]');
		if (desc) desc.setAttribute('content', meta.description);
		const kw = document.querySelector('meta[name="keywords"]');
		if (kw) kw.setAttribute('content', meta.keywords);
	}

	// --- showLoaderBeforeGreeting ---
	// Shows an animated loader (atom-loader.svg) before the greeting <h1> and hides it after a short delay
	function showLoaderBeforeGreeting(lang) {
		const h1 = document.querySelector('h1[data-i18n="hi"]')?.parentElement;
		if (!h1) return;
		const loaderDiv = document.createElement('div');
		loaderDiv.id = 'atom-loader-wrap';
		loaderDiv.innerHTML = `<img src="src/image/atom-loader.svg" alt="Loading..." width="64" height="64" style="display:block;margin:0 auto;" />`;
		h1.parentNode.insertBefore(loaderDiv, h1);
		h1.style.display = 'none';
		window.addEventListener('load', () => {
			setTimeout(() => {
				loaderDiv.remove();
				h1.style.display = '';
			}, 1200);
		});
	}

	// --- i18n/meta ---
	// Handles translation of all elements with data-i18n and meta tags with data-i18n-meta

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
		// Updates all meta tags with data-i18n-meta for the current language
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
		// Always get all elements with data-i18n (including those rendered dynamically)
		document.querySelectorAll('[data-i18n]').forEach((el) => {
			const key = el.getAttribute('data-i18n');
			const translation = languageMap[currentLanguage].translations[key];
			if (translation) {
				if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
					el.placeholder = translation;
				} else {
					el.textContent = translation;
				}
			}
		});
		updateMetaTags();
		setLangMeta(currentLanguage);
	};

	// --- Language switchers ---
	// Handles both a select (languageSwitcher) and a button (languageToggle) for changing language
	if (languageSwitcher) {
		languageSwitcher.value = currentLanguage;
		languageSwitcher.addEventListener('change', (e) => {
			const lang = e.target.value;
			currentLanguage = lang;
			document.documentElement.lang = lang;
			localStorage.setItem('language', lang);
			translatePage();
		});
	}

	if (languageToggle) {
		languageToggle.addEventListener('click', () => {
			if (currentLanguage === 'ru') currentLanguage = 'en';
			else if (currentLanguage === 'en') currentLanguage = 'es';
			else currentLanguage = 'ru';
			document.documentElement.lang = currentLanguage;
			localStorage.setItem('language', currentLanguage);
			translatePage();
		});
	}

	// --- Initial render ---
	// Sets <html lang>, translates page, sets meta, and shows loader before greeting

	document.documentElement.lang = currentLanguage;
	translatePage();
	setLangMeta(currentLanguage);
	showLoaderBeforeGreeting(currentLanguage);

	// --- README.md loading ---
	// Loads and renders README.md into the #readme-container using marked.js
	const readmeContainer = document.getElementById('readme-container');
	fetch('../README.md')
		.then((res) => {
			if (!res.ok) throw new Error('Не удалось загрузить README.md');
			return res.text();
		})
		.then((markdown) => {
			const html = marked.parse(markdown);
			readmeContainer.innerHTML = html;
			translatePage(); // <-- translate new elements!
		})
		.catch((err) => {
			console.error(err);
			readmeContainer.innerHTML = '<p>Error while loading content..</p>';
		});
});
