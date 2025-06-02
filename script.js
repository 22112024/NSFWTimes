const shareMenu = document.querySelector(".share_menu");

if (shareMenu) {
  const content = shareMenu.querySelector(".share_menu_body");
  const copyLinkBtn = shareMenu.querySelector(".copy_link a");
  const nativeShareBtn = shareMenu.querySelector(".share_link a");
  const closeBtn = shareMenu.querySelector(".share_close");
  let currentArticleUrl = "";
  let startY = 0;
  let currentY = 0;

  // Обработка кнопок "Поделиться" в карточках
  document.querySelectorAll("article").forEach((article) => {
    const shareButton = article.querySelector(".icon_share");
    if (shareButton) {
      shareButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const articleLink =
          article.querySelector(".card_title a")?.href || window.location.href;
        currentArticleUrl = articleLink;

        shareMenu.classList.remove("hidden");
        shareMenu.classList.add("block-visible");
      });
    }
  });

  // Закрытие шторки по клику вне её
  document.addEventListener("click", (event) => {
    const isClickInside = shareMenu.contains(event.target);
    if (!isClickInside && shareMenu.classList.contains("block-visible")) {
      smoothHide(shareMenu);
    }
  });

  // Свайп вниз для скрытия шторки
  content.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
    content.style.transition = "";
  });

  content.addEventListener("touchmove", (e) => {
    currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    if (deltaY > 0) {
      content.style.transform = `translateY(${deltaY}px)`;
    }
  });

  content.addEventListener("touchend", () => {
    const deltaY = currentY - startY;
    if (deltaY > 100) {
      smoothHide(shareMenu);
    } else {
      content.style.transition = "transform 0.3s ease";
      content.style.transform = "translateY(0)";
      setTimeout(() => {
        content.style.transition = "";
        content.style.transform = "";
      }, 300);
    }
  });

  // Кнопка "Скопировать ссылку"
  copyLinkBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    navigator.clipboard
      .writeText(currentArticleUrl)
      .then(() => {
        copyLinkBtn.textContent = "Ссылка скопирована";
        setTimeout(() => {
          copyLinkBtn.textContent = "Скопировать ссылку";
        }, 3000);
      })
      .catch(() => {
        alert("Не удалось скопировать ссылку");
      });
  });

  // Кнопка "Поделиться ссылкой" через системное меню
  nativeShareBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    if (navigator.share) {
      navigator
        .share({
          title: "Интересная статья",
          text: "Прочитай статью с 'клубничкой'!",
          url: currentArticleUrl,
        })
        .catch((error) => {
          console.log("Ошибка при открытии системного меню:", error);
        });
    } else {
      alert("Ваш браузер не поддерживает системное меню «Поделиться».");
    }
  });

  // Кнопка закрытия шторки
  closeBtn?.addEventListener("click", () => {
    smoothHide(shareMenu);
  });
}

// Анимация скрытия шторки
function smoothHide(menu) {
  const content = menu.querySelector(".share_menu_body");
  content.style.transition = "transform 0.3s ease";
  content.style.transform = "translateY(100%)";

  setTimeout(() => {
    menu.classList.remove("block-visible");
    menu.classList.add("hidden");
    content.style.transition = "";
    content.style.transform = "";
  }, 300);
}
