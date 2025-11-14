// ==================== СИСТЕМА БАЛАНСА ====================
let userBalance = 0;

// Основная функция при загрузке
function main() {
    console.log('Tarot Mini App started');
    
    // Инициализируем Telegram Web App
    if (window.Telegram && Telegram.WebApp) {
        const tg = Telegram.WebApp;
        tg.ready();
        tg.expand();
        
        // Загружаем баланс пользователя
        loadUserBalance();
        
        // Настраиваем обработчики
        setupBalanceListeners();
        
        // Генерируем реферальную ссылку
        generateReferralLink();
    } else {
        // Демо-режим если открыто не в Telegram
        document.getElementById('balance').innerText = '5 (демо)';
    }
}

// Загружаем баланс из localStorage
function loadUserBalance() {
    if (window.Telegram && Telegram.WebApp) {
        const tg = Telegram.WebApp;
        const user = tg.initDataUnsafe.user;
        
        if (user && user.id) {
            const storedBalance = localStorage.getItem(`tarot_balance_${user.id}`);
            userBalance = storedBalance ? parseInt(storedBalance) : 10; // 10 бесплатных вопроса
            updateBalanceDisplay();
        }
    }
}

// Обновляем отображение баланса
function updateBalanceDisplay() {
    document.getElementById('balance').innerText = userBalance;
    
    // Меняем цвет если баланс низкий
    const balanceElement = document.getElementById('balance');
    if (userBalance === 0) {
        balanceElement.style.color = '#ff4444';
    } else if (userBalance <= 3) {
        balanceElement.style.color = '#ffaa00';
    } else {
        balanceElement.style.color = '#6b4fd4';
    }
}

// Сохраняем баланс
function saveBalance() {
    if (window.Telegram && Telegram.WebApp) {
        const tg = Telegram.WebApp;
        const user = tg.initDataUnsafe.user;
        
        if (user && user.id) {
            localStorage.setItem(`tarot_balance_${user.id}`, userBalance.toString());
            updateBalanceDisplay();
            sendBalanceToBot();
        }
    }
}

// Отправляем баланс боту
function sendBalanceToBot() {
    if (window.Telegram && Telegram.WebApp) {
        const tg = Telegram.WebApp;
        
        // Создаем ссылку для обновления баланса в боте
        const updateLink = `https://t.me/SputnikTaro_bot?start=balance_${userBalance}`;
        
        // Открываем ссылку в фоне для обновления баланса
        tg.openLink(updateLink);
        
        console.log('Баланс отправлен боту:', userBalance);
    }
}

// Настройка обработчиков
function setupBalanceListeners() {
    // Отправляем баланс при изменении
    setInterval(sendBalanceToBot, 30000); // Каждые 30 сек
}

// ==================== ФУНКЦИИ БАЛАНСА ====================
function addQuestions(count) {
    userBalance += count;
    saveBalance();
    showNotification(`✅ Добавлено ${count} вопросов! Всего: ${userBalance}`);
}

function deductQuestion() {
    if (userBalance > 0) {
        userBalance -= 1;
        saveBalance();
        showNotification(`🔮 Вопрос использован! Осталось: ${userBalance}`);
        return true;
    } else {
        showNotification('❌ Баланс пуст! Купите вопросы.');
        return false;
    }
}

// ==================== СИСТЕМА ОПЛАТЫ ====================
function selectPackage(questions, price) {
    // Выделяем выбранный пакет
    const options = document.querySelectorAll('.payment-option');
    options.forEach(option => option.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    // Сохраняем выбранный пакет
    window.selectedPackage = { questions, price };
}

function processPayment() {
    if (!window.selectedPackage) {
        showNotification('❌ Сначала выберите пакет вопросов');
        return;
    }
    
    const { questions, price } = window.selectedPackage;
    
    // Имитация успешной оплаты
    showNotification(`✅ Оплата ${price} руб. прошла успешно!`);
    
    // Добавляем вопросы
    addQuestions(questions);
    
    // Закрываем окно оплаты
    closePopup('paymentPage');
}

// ==================== РЕФЕРАЛЬНАЯ СИСТЕМА ====================
function generateReferralLink() {
    if (window.Telegram && Telegram.WebApp) {
        const tg = Telegram.WebApp;
        const user = tg.initDataUnsafe.user;
        
        if (user && user.id) {
            const refLink = `https://t.me/SputnikTaro_bot?start=ref_${user.id}`;
            const linkInput = document.getElementById('referralLink');
            if (linkInput) {
                linkInput.value = refLink;
            }
        }
    }
}

function copyReferralLink() {
    const linkInput = document.getElementById('referralLink');
    linkInput.select();
    document.execCommand('copy');
    showNotification('✅ Ссылка скопирована!');
}

function shareReferralLink() {
    const linkInput = document.getElementById('referralLink');
    if (navigator.share) {
        navigator.share({
            title: 'Присоединяйся к Таро Боту!',
            text: 'Получи 10 бесплатных вопросов к Таро боту!',
            url: linkInput.value
        });
    } else {
        copyReferralLink();
    }
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
function showNotification(message) {
    // Простое уведомление
    console.log('Notification:', message);
    if (window.Telegram && Telegram.WebApp) {
        const tg = Telegram.WebApp;
        tg.showPopup({
            title: 'Таро Бот',
            message: message,
            buttons: [{ type: 'ok' }]
        });
    } else {
        alert(message);
    }
}

// Функции попапов
function openReferralPage() {
    document.getElementById('referralPage').style.display = 'flex';
}

function openPaymentPage() {
    document.getElementById('paymentPage').style.display = 'flex';
}

function openLegalInfo() {
    document.getElementById('legalPopup').style.display = 'flex';
    openTab('userAgreement');
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

function openTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => button.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Карта дня
function toggleDailyCard() {
    let statusElement = document.getElementById('dailyCardStatus');
    if (statusElement.innerText === 'Выкл') {
        statusElement.innerText = 'Вкл';
        showNotification('✅ Карта дня включена! Сообщения будут приходить утром.');
    } else {
        statusElement.innerText = 'Выкл';
        showNotification('❌ Карта дня выключена.');
    }
}

// Запуск при загрузке
window.onload = main;