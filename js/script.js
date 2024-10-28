// Получение элементов
const modal = document.getElementById("modal");
const openFormBtn = document.getElementById("openFormBtn");
const closeModal = document.getElementById("closeModal");

// Открытие модального окна
openFormBtn.onclick = function () {
  modal.style.display = "block";
};

// Закрытие модального окна
closeModal.onclick = function () {
  modal.style.display = "none";
};

// Закрытие модального окна при клике вне его
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Функция для управления тумблерами
function toggleDesignProject(selected) {
  const buttons = document.querySelectorAll(".toggle-button");
  buttons.forEach((button) => {
    button.classList.remove("active");
  });

  // Добавляем активный класс для выбранной кнопки
  if (selected === "yes") {
    buttons[0].classList.add("active");
  } else if (selected === "no") {
    buttons[1].classList.add("active");
  } else if (selected === "need") {
    buttons[2].classList.add("active");
  }
}

// Закодированные токен и chat_id
const encodedBotToken =
  "NzA1MjYwMDk3NjpBQUYzZUdQWjVKaG5tajg2SmVFTVFQNTRPQy1LcmlyNENiSQ=="; // закодированный botToken
const encodedChatId = "MjkyMTMyNjY4"; // закодированный chat_id

// Функция для декодирования
function decodeBase64(encoded) {
  return atob(encoded);
}

// Получение декодированных токена и chat_id
const botToken = decodeBase64(encodedBotToken);
const chatId = decodeBase64(encodedChatId);

// Событие отправки формы
document
  .getElementById("requestForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Отменить стандартное поведение формы

    // Получение данных формы
    const area = document.getElementById("area").value;
    const condition = document.getElementById("condition").value;
    const designProject = document.querySelector(
      'input[name="designProject"]:checked'
    ).value;
    let phone = document.getElementById("phone").value; // Заменяем const на let для изменения переменной

    // Убираем все лишние символы (оставляем только цифры)
    phone = phone.replace(/\D/g, "");

    // Проверка на корректный номер телефона
    if (phone.length === 11 && phone.startsWith("7")) {
      // Формирование сообщения для Telegram
      const message = `
      Площадь помещения: ${area} м²
      Состояние помещения: ${condition}
      Есть ли дизайн проект: ${designProject}
      Номер телефона: ${phone}
    `;

      // Отправка сообщения в Telegram
      sendToTelegram(message);

      // Очистка формы
      this.reset();
    } else {
      alert("Введите корректный номер телефона.");
    }
  });

function sendToTelegram(message) {
  const telegramBotToken = botToken; // Декодированный токен
  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId, // Декодированный chat_id
      text: message,
      parse_mode: "Markdown",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        alert("Форма успешно отправлена!");
      } else {
        alert("Произошла ошибка при отправке формы.");
      }
    })
    .catch((error) => {
      console.error("Ошибка:", error);
      alert("Произошла ошибка при отправке формы.");
    });
}
