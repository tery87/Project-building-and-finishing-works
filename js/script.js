// Получение элементов
const modal = document.getElementById("modal");
const openFormBtn = document.getElementById("openFormBtn");
const closeModal = document.getElementById("closeModal");

// Открытие модального окна
openFormBtn.onclick = function () {
  modal.style.display = "block";
  setTimeout(() => modal.classList.add("show"), 10);
};

// Закрытие модального окна
closeModal.onclick = function () {
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
  }, 400);
  clearForm(); // Закрытие после завершения анимации (400 мс)
};

// Закрытие модального окна при клике вне его
window.onclick = function (event) {
  if (event.target === modal) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 400);
    clearForm();
  }
};
// Функция для очистки формы
function clearForm() {
  setTimeout(() => {
    document.getElementById("requestForm").reset();
  }, 1000); // Сброс формы
}

function showAlert(message) {
  const alertBox = document.getElementById("customAlert");
  const alertMessage = document.getElementById("alertMessage");

  alertMessage.textContent = message; // Установить текст сообщения
  alertBox.style.display = "block"; // Показать alert

  // Закрытие alert при клике на "x"
  document.getElementById("closeCustomAlert").onclick = function () {
    alertBox.style.display = "none";
  };

  // Закрытие alert при клике вне окна
  window.onclick = function (event) {
    if (event.target === alertBox) {
      alertBox.style.display = "none";
    }
  };
}

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
    );
    let phone = document.getElementById("phone").value; // Заменяем const на let для изменения переменной

    // Проверка на наличие введенной площади
    if (!area) {
      showAlert("Пожалуйста, укажите площадь помещения."); // Показываем кастомный alert
      return; // Прекращаем дальнейшие действия
    }

    // Проверка на наличие выбранного состояния объекта
    if (!condition) {
      showAlert("Пожалуйста, выберите состояние помещения."); // Показываем кастомный alert
      return; // Прекращаем дальнейшие действия
    }
    // Проверка, выбрано ли значение для "Есть ли дизайн проект?"
    if (!designProject) {
      showAlert("Пожалуйста, выберите значение для 'Есть ли дизайн проект?'");
      return;
    }
    // Убираем все лишние символы (оставляем только цифры)
    phone = phone.replace(/\D/g, "");

    // Проверка на корректный номер телефона
    if (phone.length === 11 && phone.startsWith("7")) {
      // Формирование сообщения для Telegram
      const message = `
      Площадь помещения: ${area} м²
      Состояние помещения: ${condition}
      Есть ли дизайн проект: ${designProject.value}
      Номер телефона: ${phone}
    `;

      // Отправка сообщения в Telegram
      sendToTelegram(message);

      // Очистка формы
      this.reset();
    } else {
      showAlert("Введите корректный номер телефона.");
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
        window.location.href = "thankyou.html";
      } else {
        showAlert("Произошла ошибка при отправке формы.");
      }
    })
    .catch((error) => {
      console.error("Ошибка:", error);
      showAlert("Произошла ошибка при отправке формы.");
    });
}
document.addEventListener("DOMContentLoaded", function () {
  let swiper;
  
  function initSwiper() {
    console.log("Current width:", window.innerWidth);
    if (window.innerWidth <= 700) {
      document.querySelector('.reviews__swiper').style.display = 'flex';
      if (!swiper) {
        swiper = new Swiper(".reviews__swiper", {
          slidesPerView: 1.15,
          centeredSlides: false,
          spaceBetween: window.innerWidth * 0.07,
          loop: true, // Можно поменять на false, если не нужно зацикливание
          // loopFillGroupWithBlank: true,
          // pagination: {
          //   el: ".swiper-pagination",
          //   clickable: true,
          // },
          navigation: false, // Убираем кнопки навигации
        });
      }
    } else {
      if (swiper) {
        console.log("Destroying Swiper");
        swiper.destroy(true, true); // Уничтожаем слайдер, если ширина больше 700
        swiper = null; // Сбрасываем swiper
        document.querySelector('.reviews__swiper').style.display = 'none';
      }
    }
  }

  initSwiper(); // Инициализируем слайдер при загрузке

  window.addEventListener("resize", initSwiper); // Перезапускаем при изменении размера окна
});
