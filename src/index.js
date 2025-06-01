export default {
  async fetch(request, env) {
    // Получаем исходный URL
    const url = new URL(request.url);

    // Если запрос к «папке» (например, "/" или "/foo/"),
    // добавляем index.html
    if (url.pathname.endsWith('/')) {
      url.pathname += 'index.html';
    }

    // Делаем попытку отдать статический файл по новому URL
    let response = await env.ASSETS.fetch(new Request(url, request));

    // Если asset не найден (404), то возвращаем index.html из корня
    if (response.status === 404) {
      // Принудительно создаём новый запрос к /index.html
      const fallbackUrl = new URL(request.url);
      fallbackUrl.pathname = '/index.html';
      return env.ASSETS.fetch(new Request(fallbackUrl, request));
    }

    return response;
  }
};