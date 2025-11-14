// Основная функция, которая запускается при загрузке страницы
function main() {
    // Пока просто устанавливаем баланс в 5 вопросов
    // Позже мы будем получать реальные данные от Telegram бота
    document.getElementById('balance').innerText = '5';
}

// Функции для открытия окон
function openReferralPage() {
    document.getElementById('referralPage').style.display = 'flex';
}

function openPaymentPage() {
    document.getElementById('paymentPage').style.display = 'flex';
}

function openLegalInfo() {
    document.getElementById('legalPopup').style.display = 'flex';
    // По умолчанию открываем первую вкладку
    openTab('userAgreement');
}

// Функции для закрытия окон
function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// Функция для переключения Карты Дня
function toggleDailyCard() {
    let statusElement = document.getElementById('dailyCardStatus');
    if (statusElement.innerText === 'Выкл') {
        statusElement.innerText = 'Вкл';
        // Здесь позже добавим логику выбора времени
        alert('Функция "Карта дня" включена! Сообщения будут приходить утром.');
    } else {
        statusElement.innerText = 'Выкл';
        alert('Функция "Карта дня" выключена.');
    }
}

// Функция для выбора пакета вопросов
function selectPackage(questions, price) {
    // Снимаем выделение со всех вариантов
    const options = document.querySelectorAll('.payment-option');
    options.forEach(option => {
        option.style.backgroundColor = '';
        option.style.borderColor = '#ddd';
    });
    
    // Выделяем выбранный вариант
    event.currentTarget.style.backgroundColor = '#f0f0ff';
    event.currentTarget.style.borderColor = '#6b4fd4';
    
    // Сохраняем выбранный пакет (пока просто в alert)
    alert(`Выбран пакет: ${questions} вопросов за ${price} руб.`);
    
    // Здесь позже будет логика оплаты
}

// Функции для оплаты (заглушки)
function payWithCard() {
    alert('Оплата картой - в разработке');
}

function payWithSBP() {
    alert('Оплата через СБП - в разработке');
}

// Функции для реферальной системы
function copyReferralLink() {
    const linkInput = document.getElementById('referralLink');
    linkInput.select();
    document.execCommand('copy');
    alert('Ссылка скопирована в буфер обмена!');
}

function shareReferralLink() {
    if (navigator.share) {
        navigator.share({
            title: 'Присоединяйся к Таро Боту!',
            text: 'Получи 10 бесплатных вопросов к Таро боту!',
            url: 'https://t.me/your_bot?start=ref123'
        });
    } else {
        alert('Поделитесь скопированной ссылкой с друзьями!');
    }
}

// Функция для переключения вкладок в юридической информации
function openTab(tabName) {
    // Скрываем все вкладки
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Убираем активный класс со всех кнопок
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Показываем выбранную вкладку и активируем кнопку
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Запускаем основную функцию когда страница загрузилась
window.onload = main;