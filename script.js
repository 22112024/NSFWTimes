// Search

const searchContainer = document.getElementById("searchContainer");
const searchIcon = document.getElementById("searchIcon");
const searchClose = document.getElementById("searchClose");
const siteTitle = document.getElementById("siteTitle");

function toggleSearch(isOpen) {
  if (!searchContainer || !searchIcon || !searchClose || !siteTitle) {
    console.error("Один или несколько элементов не найдены!");
    return;
  }

  searchContainer.classList.toggle("hidden", !isOpen);
  searchContainer.classList.toggle("flex-visible", isOpen);
  siteTitle.classList.toggle("hidden", isOpen);
  searchIcon.classList.toggle("hidden", isOpen);
}

if (searchContainer && searchIcon && searchClose && siteTitle) {
  searchIcon.addEventListener("click", () => toggleSearch(true));
  searchClose.addEventListener("click", () => toggleSearch(false));
} else {
  console.error("Один или несколько элементов не найдены!");
}

document.querySelectorAll("article").forEach((article) => {
  article.classList.add("visible");
});

const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", handleSearch);
}

function handleSearch(event) {
  const query = event.target.value.toLowerCase().trim();
  const articles = document.querySelectorAll("article");

  articles.forEach((article) => {
    if (!article.dataset.original) {
      article.dataset.original = article.innerHTML;
    }

    const originalHTML = article.dataset.original;
    const plainText = originalHTML.toLowerCase();

    if (query === "") {
      article.innerHTML = originalHTML;

      article.classList.remove("visible");
      article.style.display = "block";

      requestAnimationFrame(() => {
        article.classList.add("visible");
      });

      return;
    }

    if (plainText.includes(query)) {
      const regex = new RegExp(`(${query})`, "gi");
      const highlighted = originalHTML.replace(regex, "<mark>$1</mark>");
      article.innerHTML = highlighted;
      article.style.display = "block";
      article.classList.remove("visible");
      void article.offsetWidth;
      article.classList.add("visible");
    } else {
      article.classList.remove("visible");
      setTimeout(() => {
        article.style.display = "none";
      }, 400);
    }
  });
}

// Favorites
document.addEventListener("DOMContentLoaded", () => {
  // Динамическое назначение ID для статей
  const articles = document.querySelectorAll("article");
  articles.forEach((article, index) => {
    const uniqueId = `article-${index + 1}`;
    article.setAttribute("data-id", uniqueId);
  });

  // Существующий код начинается здесь
  function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  }

  function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  function isValidArticleData(data) {
    return data && data.id && data.title && data.url && data.description;
  }

  function getArticleData(article) {
    const articleId = article?.dataset.id;
    if (!articleId) return null;

    const titleElement =
      article.querySelector(".card_title a") ||
      article.querySelector(".favorites_card_title a") ||
      article.querySelector(".popular_card_title a") ||
      article.querySelector(".article_popular_news_card a");

    const title = titleElement?.textContent?.trim();
    const url = titleElement?.href;

    const descriptionElement =
      article.querySelector(".card_description a") ||
      article.querySelector(".favorites_card_description a") ||
      article.querySelector(".popular_card_description a") ||
      article.querySelector(".article_popular_news_card a");

    const description = descriptionElement?.textContent?.trim();

    const categories = [...article.querySelectorAll(".category")].map((el) =>
      el.textContent.trim()
    );

    const image = article.querySelector(".media_avatar img")?.src;
    const source = article
      .querySelector(".media_source a")
      ?.textContent?.trim();
    const time = article
      .querySelector(".media_source")
      ?.textContent.split("·")[1]
      ?.trim();

    if (!title || !url || !description) return null;

    return {
      id: articleId,
      title,
      url,
      description,
      categories,
      image,
      source,
      time,
    };
  }

  function toggleFavoriteState(event) {
    const icon = event.currentTarget;
    const article =
      icon.closest(".article_popular_news_card") || icon.closest("article");
    const articleId = article?.dataset.id;
    if (!articleId) {
      console.error("Статья не имеет data-id:", article);
      return;
    }

    let favorites = getFavorites();
    const index = favorites.findIndex((item) => item.id === articleId);

    if (index !== -1) {
      favorites.splice(index, 1);
      icon.classList.remove("selected");
    } else {
      const data = getArticleData(article);
      if (isValidArticleData(data)) {
        favorites.push(data);
        icon.classList.add("selected");
      } else {
        console.warn("Некорректные данные статьи, не добавлено в избранное");
      }
    }

    saveFavorites(favorites);
    markFavorites();
  }

  function markFavorites() {
    const favorites = getFavorites();
    const icons = document.querySelectorAll(".icon_favorites");
    icons.forEach((icon) => {
      const articleId =
        icon.closest(".article_popular_news_card")?.dataset.id ||
        icon.closest("article")?.dataset.id;
      const isFavorite = favorites.some((item) => item.id === articleId);
      icon.classList.toggle("selected", isFavorite);
    });
  }

  function initFavoriteIcons() {
    document.querySelectorAll(".icon_favorites").forEach((icon) => {
      icon.removeEventListener("click", toggleFavoriteState);
      icon.addEventListener("click", toggleFavoriteState);
    });
  }

  initFavoriteIcons();
  markFavorites();

  if (window.location.pathname.includes("favorites.html")) {
    const container = document.getElementById("favorites-container");
    const favorites = getFavorites();

    if (!favorites.length) {
      container.innerHTML = "<p>У вас пока нет избранных статей.</p>";
      return;
    }

    container.innerHTML = "";

    favorites.forEach((article) => {
      if (!isValidArticleData(article)) {
        console.warn("Некорректные данные статьи в избранном:", article);
        return;
      }

      const categoriesHTML = Array.isArray(article.categories)
        ? article.categories
            .map((cat) => `<span class="category">${cat}</span>`)
            .join("")
        : "";

      const articleElement = document.createElement("article");
      articleElement.classList.add("article_popular_news_card");
      articleElement.setAttribute("data-id", article.id);

      articleElement.innerHTML = `
        <div class="favorites_card_content">
          <h2 class="favorites_card_title">
            <a href="${article.url}">${article.title || "Без названия"}</a>
          </h2>
          <div class="favorites_card_category">
            ${categoriesHTML}
          </div>
          <div class="favorites_card_description">
            <h3><a href="${article.url}">${article.description || ""}</a></h3>
          </div>
          <div class="favorites_card_information">
            <div class="favorites_card_media">
              <div class="media_avatar"><img src="${
                article.image || "img/default.jpg"
              }" /></div>
              <span class="media_source"><a href="#">${
                article.source || ""
              }</a> · ${article.time || ""}</span>
            </div>
            <div class="favorites_card_icon card_icon">
              <span class="icon_share"><img src="img/share_icon.png" alt="Share" /></span>
              <span class="icon_favorites selected"><img src="img/favorites_icon.png" alt="Favorites" /></span>
            </div>
          </div>
        </div>
      `;

      container.appendChild(articleElement);
    });

    initFavoriteIcons();
    markFavorites();
  }
});

// SHARE

const shareMenu = document.querySelector(".share_menu");

if (shareMenu) {
  const copyLinkBtn = shareMenu.querySelector(".copy_link");
  const nativeShareBtn = shareMenu.querySelector(".share_link");
  let currentArticleUrl = "";

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

  document.addEventListener("click", (event) => {
    const isClickInside = shareMenu.contains(event.target);
    if (!isClickInside && shareMenu.classList.contains("block-visible")) {
      smoothHide(shareMenu);
    }
  });

  let startY = 0;
  shareMenu.addEventListener("touchstart", (event) => {
    startY = event.touches[0].clientY;
  });
  shareMenu.addEventListener("touchend", (event) => {
    const endY = event.changedTouches[0].clientY;
    const deltaY = endY - startY;
    if (deltaY > 40 && shareMenu.classList.contains("block-visible")) {
      smoothHide(shareMenu);
    }
  });

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

  const closeBtn = shareMenu.querySelector(".share_close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      smoothHide(shareMenu);
    });
  }
}

function smoothHide(menu) {
  menu.classList.remove("block-visible");
  menu.classList.add("block-hiding");

  setTimeout(() => {
    menu.classList.remove("block-hiding");
    menu.classList.add("hidden");
  }, 500);
}

// Settings

if (window.location.pathname.includes("settings.html")) {
  const supportMenu = document.getElementById("supportMenu");
  const supportSettings = document.getElementById("supportSettings");
  const partnershipMenu = document.getElementById("partnershipMenu");
  const partnershipSettings = document.getElementById("partnershipSettings");
  const supportEmail = document.getElementById("supportEmail");
  const partnershipEmail = document.getElementById("partnershipEmail");
  const copyContactSupport = document.getElementById("copyContactSupport");
  const copyContactPartnership = document.getElementById(
    "copyContactPartnership"
  );

  if (!supportSettings || !partnershipSettings) {
    console.error(
      "Не найдены элементы supportSettings или partnershipSettings"
    );
  }
  if (!supportMenu || !partnershipMenu) {
    console.error("Не найдены элементы supportMenu или partnershipMenu");
  }

  if (supportSettings) {
    supportSettings.addEventListener("click", (event) => {
      event.stopPropagation();
      console.log("Клик по supportSettings");
      if (supportMenu.classList.contains("block-visible")) {
        supportMenu.classList.remove("block-visible");
        supportMenu.classList.add("hidden");
      } else {
        supportMenu.classList.remove("hidden");
        supportMenu.classList.add("block-visible");
      }
    });
  }

  if (partnershipSettings) {
    partnershipSettings.addEventListener("click", (event) => {
      event.stopPropagation();
      console.log("Клик по partnershipSettings");
      if (partnershipMenu.classList.contains("block-visible")) {
        partnershipMenu.classList.remove("block-visible");
        partnershipMenu.classList.add("hidden");
      } else {
        partnershipMenu.classList.remove("hidden");
        partnershipMenu.classList.add("block-visible");
      }
    });
  }

  if (
    supportEmail &&
    partnershipEmail &&
    copyContactSupport &&
    copyContactPartnership
  ) {
    supportEmail.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      const email = supportEmail.textContent.trim();
      navigator.clipboard
        .writeText(email)
        .then(() => {
          console.log("Email поддержки скопирован");
          supportEmail.textContent = "Скопировано!";
          setTimeout(() => {
            supportEmail.textContent = email;
          }, 3000);
        })
        .catch(() => {
          alert("Не удалось скопировать email поддержки");
        });
    });

    partnershipEmail.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      const email = partnershipEmail.textContent.trim();
      navigator.clipboard
        .writeText(email)
        .then(() => {
          console.log("Email партнерства скопирован");
          partnershipEmail.textContent = "Скопировано!";
          setTimeout(() => {
            partnershipEmail.textContent = email;
          }, 3000);
        })
        .catch(() => {
          alert("Не удалось скопировать email партнерства");
        });
    });

    copyContactSupport.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      const email = supportEmail.textContent.trim();
      navigator.clipboard
        .writeText(email)
        .then(() => {
          console.log("Email поддержки скопирован");
          supportEmail.textContent = "Скопировано!";
          setTimeout(() => {
            supportEmail.textContent = email;
          }, 3000);
        })
        .catch(() => {
          alert("Не удалось скопировать email поддержки");
        });
    });

    copyContactPartnership.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      const email = partnershipEmail.textContent.trim();
      navigator.clipboard
        .writeText(email)
        .then(() => {
          console.log("Email партнерства скопирован");
          partnershipEmail.textContent = "Скопировано!";
          setTimeout(() => {
            partnershipEmail.textContent = email;
          }, 3000);
        })
        .catch(() => {
          alert("Не удалось скопировать email партнерства");
        });
    });
  } else {
    console.error(
      "Не найдены элементы copyContactSupport или copyContactPartnership"
    );

    //Size text

    handleCopyEmail(supportEmail, supportEmail.textContent);
    handleCopyEmail(partnershipEmail, partnershipEmail.textContent);
    handleCopyEmail(copyContactSupport, supportEmail.textContent);
    handleCopyEmail(copyContactPartnership, partnershipEmail.textContent);
  }

  const slider = document.getElementById("fontSizeSlider");
  const elementsToResize = document.querySelectorAll(".resizable-text");

  function updateFontSize(value) {
    elementsToResize.forEach((el) => {
      el.style.fontSize = `${value}px`;
    });
  }

  updateFontSize(slider.value);

  slider.addEventListener("input", () => {
    updateFontSize(slider.value);
  });
}

// ARROW BACK

document.addEventListener("DOMContentLoaded", () => {
  const backButton = document.getElementById("back-button");
  const currentPage = window.location.pathname.split("/").pop();

  // При переходе на любую страницу, кроме article.html — сохраняем текущую как prevPage
  if (backButton) {
    const fromPage = sessionStorage.getItem("currentPage");

    if (fromPage && fromPage !== window.location.href) {
      sessionStorage.setItem("prevPage", fromPage);
    }

    // Обновляем текущую страницу
    sessionStorage.setItem("currentPage", window.location.href);

    // Обработка клика по стрелке "Назад"
    backButton.addEventListener("click", (event) => {
      event.preventDefault();
      const prevPage = sessionStorage.getItem("prevPage");

      if (prevPage && prevPage !== window.location.href) {
        window.location.href = prevPage;
      } else {
        window.location.href = "index.html"; // fallback, если нет prevPage
      }
    });
  }
});

// === Bottom navigation (подсветка кнопок) ===
document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "")
    .toLowerCase();
  const navItems = document.querySelectorAll(".bottom_nav a");

  navItems.forEach((item) => {
    const linkPath = item
      .getAttribute("href")
      .split("/")
      .pop()
      .replace(".html", "")
      .toLowerCase();

    if (linkPath === currentPath) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
});
