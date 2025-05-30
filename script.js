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
    const originalHTML =
      article.getAttribute("data-original") || article.innerHTML;

    if (!article.getAttribute("data-original")) {
      article.setAttribute("data-original", originalHTML);
    }

    const plainText = originalHTML.toLowerCase();

    if (query === "") {
      article.innerHTML = originalHTML;
      article.style.display = "block";
      article.classList.remove("visible");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          article.classList.add("visible");
        });
      });
      return;
    }

    if (plainText.includes(query)) {
      const regex = new RegExp(`(${query})`, "gi");
      const highlighted = originalHTML.replace(regex, "<mark>$1</mark>");
      article.innerHTML = highlighted;
      article.style.display = "block";

      requestAnimationFrame(() => {
        article.classList.add("visible");
      });
    } else {
      article.classList.remove("visible");

      setTimeout(() => {
        article.style.display = "none";
      }, 400);
    }
  });
}

// Favorites

const favoriteIcons = document.querySelectorAll(".icon_favorites");

function toggleFavoriteState(event) {
  const icon = event.currentTarget;
  icon.classList.toggle("selected");
  const isSelected = icon.classList.contains("selected");
  icon.setAttribute("aria-pressed", isSelected.toString());
}

if (window.location.pathname.includes("favorites")) {
  favoriteIcons.forEach((icon) => {
    icon.classList.add("selected");
    icon.setAttribute("aria-pressed", "true");
    icon.addEventListener("click", toggleFavoriteState);
  });
} else {
  favoriteIcons.forEach((icon) => {
    icon.addEventListener("click", toggleFavoriteState);
  });
}

// Share

const articles = document.querySelectorAll("article");

articles.forEach((article) => {
  const shareButton = article.querySelector(".icon_share");
  const shareMenu = article.querySelector(".share_menu");
  const shareLinkBtn = article.querySelector(".copy_link");
  const nativeShareBtn = article.querySelector(".share_link");

  if (shareButton && shareMenu) {
    shareButton.addEventListener("click", (event) => {
      event.stopPropagation();
      shareMenu.classList.toggle("block-visible");
      shareMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (event) => {
      const isClickInside =
        shareMenu.contains(event.target) || shareButton.contains(event.target);
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

    function smoothHide(menu) {
      menu.classList.remove("block-visible");
      menu.classList.add("block-hiding");

      setTimeout(() => {
        menu.classList.remove("block-hiding");
        menu.classList.add("hidden");
      }, 500);
    }

    if (shareLinkBtn) {
      shareLinkBtn.addEventListener("click", (event) => {
        event.preventDefault();
        navigator.clipboard
          .writeText(window.location.href)
          .then(() => {
            shareLinkBtn.textContent = "Ссылка скопирована";
            setTimeout(() => {
              shareLinkBtn.textContent = "Скопировать ссылку";
            }, 3000);
          })
          .catch(() => {
            alert("Не удалось скопировать ссылку");
          });
      });
    }

    if (nativeShareBtn) {
      nativeShareBtn.addEventListener("click", (event) => {
        event.preventDefault();
        const title =
          article.querySelector(".card_title a")?.textContent.trim() ||
          document.title;
        const url = window.location.href;

        if (navigator.share) {
          navigator
            .share({
              title: title,
              text: "Прочитай статью с 'клубничкой'!",
              url: url,
            })
            .catch((error) => {
              console.log("Ошибка при открытии системного меню:", error);
            });
        } else {
          alert("Ваш браузер не поддерживает системное меню «Поделиться».");
        }
      });
    }
  }
});

// === Settings only ===

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

// === Bottom navigation (подсветка кнопок) ===
document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname.split("/").pop();
  const navItems = document.querySelectorAll(".bottom_nav a");

  navItems.forEach((item) => {
    const linkPath = item.pathname.split("/").pop();
    item.classList.remove("active");
    if (linkPath === currentPath) {
      item.classList.add("active");
    }
  });
});
