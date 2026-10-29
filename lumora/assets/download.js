// The Lumora download page, in the app's own languages. With Lumora installed,
// a tap on this page's link opens the app directly (universal link); the page
// itself only shows when it isn't, or when the address is typed into Safari.
(function () {
  "use strict";
  var APP_STORE_ID = window.LUMORA_APP_STORE_ID || "";

  var T = {
    en: {
      tagline: "Focus, and grow a universe of your own.",
      lead: "Every focus session becomes a star. Days turn into constellations, and your sky keeps growing.",
      points: ["A star for every focus session", "Your focus fuels journeys to new worlds", "Focus together with a friend", "No ads, no tracking"],
      download: "Download on the App Store", soon: "Coming soon to the App Store",
      open: "Already have Lumora? Open it", privacy: "Privacy policy"
    },
    tr: {
      tagline: "Odaklan, kendi evrenini büyüt.",
      lead: "Her odak seansı bir yıldız olur. Günler takımyıldızlara dönüşür, gökyüzün büyümeye devam eder.",
      points: ["Her odak seansına bir yıldız", "Odağın, yeni dünyalara yolculukların yakıtı olur", "Bir arkadaşınla birlikte odaklan", "Reklam yok, takip yok"],
      download: "App Store'dan İndirin", soon: "Çok yakında App Store'da",
      open: "Lumora yüklü mü? Hemen aç", privacy: "Gizlilik politikası"
    },
    de: {
      tagline: "Fokussiere dich und lass dein eigenes Universum wachsen.",
      lead: "Jede Fokus-Sitzung wird zu einem Stern. Aus Tagen werden Sternbilder, und dein Himmel wächst weiter.",
      points: ["Ein Stern für jede Fokus-Sitzung", "Dein Fokus treibt Reisen zu neuen Welten an", "Gemeinsam mit Freunden fokussieren", "Keine Werbung, kein Tracking"],
      download: "Laden im App Store", soon: "Bald im App Store",
      open: "Lumora schon installiert? Jetzt öffnen", privacy: "Datenschutzerklärung"
    },
    fr: {
      tagline: "Concentre-toi, et fais grandir ton propre univers.",
      lead: "Chaque séance de concentration devient une étoile. Les jours forment des constellations, et ton ciel ne cesse de grandir.",
      points: ["Une étoile pour chaque séance", "Ta concentration alimente des voyages vers de nouveaux mondes", "Concentre-toi avec un ami", "Ni publicité, ni pistage"],
      download: "Télécharger dans l'App Store", soon: "Bientôt sur l'App Store",
      open: "Lumora déjà installée ? Ouvre-la", privacy: "Politique de confidentialité"
    },
    es: {
      tagline: "Concéntrate y haz crecer tu propio universo.",
      lead: "Cada sesión de concentración se convierte en una estrella. Los días forman constelaciones y tu cielo no deja de crecer.",
      points: ["Una estrella por cada sesión", "Tu concentración impulsa viajes a nuevos mundos", "Concéntrate junto a un amigo", "Sin anuncios ni rastreo"],
      download: "Descargar en el App Store", soon: "Muy pronto en el App Store",
      open: "¿Ya tienes Lumora? Ábrela", privacy: "Política de privacidad"
    },
    it: {
      tagline: "Concentrati e fai crescere il tuo universo.",
      lead: "Ogni sessione di concentrazione diventa una stella. I giorni diventano costellazioni e il tuo cielo continua a crescere.",
      points: ["Una stella per ogni sessione", "La tua concentrazione alimenta viaggi verso nuovi mondi", "Concentrati insieme a un amico", "Niente pubblicità, nessun tracciamento"],
      download: "Scarica su App Store", soon: "Presto su App Store",
      open: "Hai già Lumora? Aprila", privacy: "Informativa sulla privacy"
    },
    "pt-BR": {
      tagline: "Foque e faça crescer o seu próprio universo.",
      lead: "Cada sessão de foco vira uma estrela. Os dias viram constelações, e o seu céu não para de crescer.",
      points: ["Uma estrela para cada sessão", "Seu foco abastece viagens a novos mundos", "Foque junto com um amigo", "Sem anúncios, sem rastreamento"],
      download: "Baixar na App Store", soon: "Em breve na App Store",
      open: "Já tem o Lumora? Abra", privacy: "Política de Privacidade"
    },
    ru: {
      tagline: "Сосредоточься и вырасти свою вселенную.",
      lead: "Каждая сессия фокуса становится звездой. Дни складываются в созвездия, а твоё небо продолжает расти.",
      points: ["Звезда за каждую сессию", "Твой фокус питает путешествия к новым мирам", "Фокусируйся вместе с другом", "Без рекламы и слежки"],
      download: "Загрузите в App Store", soon: "Скоро в App Store",
      open: "Lumora уже установлена? Открой", privacy: "Политика конфиденциальности"
    },
    ar: {
      tagline: "ركّز، ودع كونك الخاص ينمو.",
      lead: "كل جلسة تركيز تصبح نجمة. تتحول الأيام إلى كوكبات، وتواصل سماؤك النمو.",
      points: ["نجمة لكل جلسة تركيز", "تركيزك وقود لرحلات إلى عوالم جديدة", "ركّز مع صديق", "بلا إعلانات ولا تتبّع"],
      download: "تنزيل من App Store", soon: "قريبًا على App Store",
      open: "هل لديك Lumora؟ افتحه", privacy: "سياسة الخصوصية"
    },
    th: {
      tagline: "โฟกัส แล้วปล่อยให้จักรวาลของคุณเติบโต",
      lead: "ทุกเซสชันโฟกัสจะกลายเป็นดาวหนึ่งดวง วันเวลากลายเป็นกลุ่มดาว และท้องฟ้าของคุณจะเติบโตต่อไป",
      points: ["ดาวหนึ่งดวงสำหรับทุกเซสชัน", "โฟกัสของคุณคือพลังสู่การเดินทางไปยังโลกใหม่", "โฟกัสไปพร้อมกับเพื่อน", "ไม่มีโฆษณา ไม่มีการติดตาม"],
      download: "ดาวน์โหลดบน App Store", soon: "เร็วๆ นี้บน App Store",
      open: "มี Lumora แล้ว? เปิดเลย", privacy: "นโยบายความเป็นส่วนตัว"
    },
    ja: {
      tagline: "集中して、あなただけの宇宙を育てよう。",
      lead: "集中セッションのたびに星がひとつ生まれます。日々は星座になり、あなたの空は広がり続けます。",
      points: ["セッションごとに星がひとつ", "集中が新しい世界への旅の燃料に", "友だちと一緒に集中", "広告なし、トラッキングなし"],
      download: "App Storeからダウンロード", soon: "App Storeにて近日公開",
      open: "Lumoraをお持ちですか？ 開く", privacy: "プライバシーポリシー"
    },
    ko: {
      tagline: "집중하고, 나만의 우주를 키워 보세요.",
      lead: "집중 세션 하나하나가 별이 됩니다. 하루하루가 별자리가 되고, 나의 하늘은 계속 자라납니다.",
      points: ["세션마다 별 하나", "집중이 새로운 세계로 떠나는 여정의 연료가 돼요", "친구와 함께 집중", "광고 없음, 추적 없음"],
      download: "App Store에서 다운로드", soon: "곧 App Store에서 만나요",
      open: "이미 Lumora가 있나요? 열기", privacy: "개인정보 처리방침"
    },
    "zh-Hans": {
      tagline: "专注，让属于你的宇宙不断生长。",
      lead: "每一次专注都会化作一颗星星。日子连成星座，你的星空不断扩展。",
      points: ["每次专注，一颗星星", "你的专注为前往新世界的旅程提供燃料", "和朋友一起专注", "无广告，无追踪"],
      download: "在 App Store 下载", soon: "即将登陆 App Store",
      open: "已经安装 Lumora？打开", privacy: "隐私政策"
    }
  };

  // ?lang=xx wins (handy for sharing a page in one language), then the
  // browser's preferred languages, then English.
  function pick() {
    var wanted = [new URLSearchParams(location.search).get("lang") || ""]
      .concat(navigator.languages || [navigator.language || ""]);
    for (var i = 0; i < wanted.length; i++) {
      var tag = (wanted[i] || "").toLowerCase();
      if (!tag) continue;
      if (tag.indexOf("zh") === 0) {
        // The app has Simplified Chinese only.
        if (/hant|tw|hk|mo/.test(tag)) continue;
        return "zh-Hans";
      }
      if (tag.indexOf("pt") === 0) return "pt-BR";
      var base = tag.split("-")[0];
      if (T[base]) return base;
    }
    return "en";
  }

  var lang = pick(), s = T[lang];
  var root = document.documentElement;
  root.lang = lang;
  root.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = "Lumora · " + s.tagline;

  var text = function (id, value) { document.getElementById(id).textContent = value; };
  text("tagline", s.tagline);
  text("lead", s.lead);
  text("open", s.open);
  text("privacy", s.privacy);
  var list = document.getElementById("points");
  list.textContent = "";
  s.points.forEach(function (point) {
    var li = document.createElement("li");
    li.textContent = point;
    list.appendChild(li);
  });

  var shot = document.getElementById("shot");
  shot.src = "/lumora/assets/" + (lang === "tr" ? "tr" : "en") + "-01-home.jpg";

  var store = document.getElementById("store");
  if (APP_STORE_ID) {
    store.href = "https://apps.apple.com/app/id" + encodeURIComponent(APP_STORE_ID);
    store.classList.remove("soon");
    text("store-label", s.download);
  } else {
    store.removeAttribute("href");
    store.setAttribute("aria-disabled", "true");
    store.classList.add("soon");
    text("store-label", s.soon);
  }
})();
