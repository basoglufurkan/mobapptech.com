// Lumora link pages. With Lumora installed, iOS opens these links in the app
// directly (universal links); this page shows only when it doesn't.
(function () {
  "use strict";
  var APP_STORE_ID = window.LUMORA_APP_STORE_ID || "";
  var ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  var CATEGORIES = ["study", "work", "coding", "reading", "creative"];
  var tr = (navigator.language || "").toLowerCase().indexOf("tr") === 0;
  var t = function (en, trText) { return tr ? trText : en; };

  var parts = location.pathname.split("/").filter(Boolean).slice(1).map(function (p) { return p.toLowerCase(); });
  var query = new URLSearchParams(location.search);
  var route = parts[0] || "";

  var copy = {
    today: [t("Your sky today", "Bugünkü gökyüzün"), t("Open Lumora to see what today's focus has made.", "Bugünkü odağının neler yarattığını görmek için Lumora'yı aç.")],
    universe: [t("Your universe", "Evrenin"), t("Every focus session is a star. Come see yours.", "Her odak seansı bir yıldız. Gel, seninkileri gör.")],
    odyssey: [t("Odyssey", "Yolculuk"), t("New worlds wait at the edge of your sky.", "Gökyüzünün kıyısında yeni dünyalar seni bekliyor.")],
    collection: [t("Your collection", "Koleksiyonun"), t("The artifacts you've found along the way.", "Yol boyunca bulduğun eserler.")],
    insights: [t("Insights", "İçgörüler"), t("How your focus has been going.", "Odağının nasıl gittiğine bir bak.")],
    year: [t("Your year in light", "Işıkla dolu yılın"), t("The year so far, as a story of stars.", "Bu yıl şimdiye kadar, yıldızlarla anlatılan bir hikâye.")],
    settings: [t("Lumora settings", "Lumora ayarları"), t("Open Lumora to change your settings.", "Ayarlarını değiştirmek için Lumora'yı aç.")],
    tasks: [t("Your tasks", "Görevlerin"), t("What you plan to focus on next.", "Sırada odaklanmayı planladıkların.")],
    focus: [t("Time to focus", "Odaklanma zamanı"), t("Open Lumora to prepare this session. It starts only when you tap Start.", "Bu seansı hazırlamak için Lumora'yı aç. Seans ancak sen Başla'ya dokununca başlar.")],
    join: [t("Focus together", "Birlikte odaklan"), t("A friend invited you to focus with them in Lumora.", "Bir arkadaşın seni Lumora'da birlikte odaklanmaya davet etti.")]
  };

  // The app link for this page, built only from known names and safe values.
  var appURL = null, key = null;
  if (route === "join" || route === "together") {
    var raw = (query.get("code") || parts[1] || "").toUpperCase();
    var code = raw.split("").filter(function (c) { return ALPHABET.indexOf(c) >= 0; }).join("").slice(0, 6);
    if (code.length === 6) {
      key = "join";
      appURL = "lumora://join?code=" + code;
      var box = document.getElementById("code");
      box.textContent = code;
      box.hidden = false;
      document.getElementById("hint").textContent =
        t("Or open Lumora, tap Focus together and enter the code.", "Ya da Lumora'yı açıp Birlikte odaklan'a dokun ve kodu gir.");
    }
  } else if (route === "insights" && parts[1] === "year") {
    key = "year"; appURL = "lumora://insights/year";
  } else if (route === "focus") {
    key = "focus";
    var items = [];
    var minutes = parseInt(query.get("minutes") || "", 10);
    if (minutes > 0) items.push("minutes=" + Math.min(minutes, 180));
    var category = (query.get("category") || "").toLowerCase();
    if (CATEGORIES.indexOf(category) >= 0) items.push("category=" + category);
    appURL = "lumora://focus" + (items.length ? "?" + items.join("&") : "");
  } else if (copy[route]) {
    key = route; appURL = "lumora://" + route;
  }

  if (tr) document.documentElement.lang = "tr";
  if (key) {
    document.getElementById("title").textContent = copy[key][0];
    document.getElementById("lead").textContent = copy[key][1];
    document.title = copy[key][0] + " · Lumora";
    var open = document.getElementById("open");
    open.href = appURL;
    open.textContent = t("Open in Lumora", "Lumora'da aç");
    open.hidden = false;
  } else {
    document.getElementById("title").textContent = t("This link has drifted", "Bu bağlantı yolunu kaybetmiş");
    document.getElementById("lead").textContent = t("It doesn't lead anywhere in Lumora.", "Lumora'da bir yere çıkmıyor.");
  }

  var get = document.getElementById("get");
  if (APP_STORE_ID) {
    get.href = "https://apps.apple.com/app/id" + APP_STORE_ID;
    get.textContent = t("Get Lumora on the App Store", "Lumora'yı App Store'dan indir");
  } else {
    get.removeAttribute("href");
    get.className = "soon";
    get.textContent = t("Lumora is coming soon to the App Store", "Lumora çok yakında App Store'da");
  }
  document.getElementById("about").textContent = t("What is Lumora?", "Lumora nedir?");
})();
