document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("index-news-feed");
  if (!container) return;

  const keywords = ["секс", "онлифанс", "onlyfans", "sex"];
  const feeds = [
    {
      url: "https://api.rss2json.com/v1/api.json?rss_url=https://lenta.ru/rss",
      sourceName: "Lenta.ru",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Lenta_logo.svg",
      domain: "https://lenta.ru",
    },
    {
      url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.cosmopolitan.com/rss/sex-love.xml",
      sourceName: "Cosmopolitan",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Cosmopolitan_logo.svg",
      domain: "https://www.cosmopolitan.com",
    },
  ];

  function containsKeyword(text, keywords) {
    return keywords.some((kw) => text.toLowerCase().includes(kw.toLowerCase()));
  }

  function createCard(item, feedInfo) {
    const image = item.thumbnail || "img/default.jpg";
    const date = new Date(item.pubDate).toLocaleDateString();

    return `
      <article class="news_card" data-tags="news">
        <div class="card_content">
          <h2 class="card_title resizable-text">
            <a href="${item.link}" target="_blank">${item.title}</a>
          </h2>
          <div class="card_category">
            <span class="category">NEWS</span>
          </div>
          <div class="card_image">
            <a href="${item.link}" target="_blank">
              <img src="${image}" alt="News image" />
            </a>
          </div>
          <div class="card_description">
            <h3>
              <a href="${item.link}" target="_blank" class="resizable-text">
                ${item.description.slice(0, 250)}...
              </a>
            </h3>
          </div>
          <div class="card_information">
            <div class="card_media">
              <div class="media_avatar">
                <img src="${feedInfo.logo}" alt="${feedInfo.sourceName} Logo"/>
              </div>
              <span class="media_source">
                <a href="${feedInfo.domain}" target="_blank">${
      feedInfo.sourceName
    }</a> · ${date}
              </span>
            </div>
            <div class="card_icon">
              <span class="icon_share"><img src="img/share_icon.png" alt="Share" /></span>
              <span class="icon_favorites"><img src="img/favorites_icon.png" alt="Favorites" /></span>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  feeds.forEach((feedInfo) => {
    fetch(feedInfo.url)
      .then((res) => res.json())
      .then((data) => {
        data.items.forEach((item) => {
          const fullText = `${item.title} ${item.description}`;
          if (containsKeyword(fullText, keywords)) {
            container.insertAdjacentHTML(
              "beforeend",
              createCard(item, feedInfo)
            );
          }
        });
      })
      .catch((err) => {
        console.error(
          `Ошибка при загрузке RSS для ${feedInfo.sourceName}:`,
          err
        );
      });
  });
});
