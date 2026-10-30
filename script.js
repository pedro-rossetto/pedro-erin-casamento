// As traduções ficam em translations.pt.js e translations.en.js,
// que preenchem window.translations antes deste arquivo rodar.
const translations = window.translations || {};

function applyLanguage(lang) {
  if (!translations[lang]) lang = "pt"; // segurança: idioma desconhecido ou arquivo não carregado
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang][key] !== undefined) {
      el.textContent = translations[lang][key];
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[lang][key] !== undefined) {
      el.setAttribute("placeholder", translations[lang][key]);
    }
  });
  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-lang-btn") === lang);
  });
  localStorage.setItem("wedding-lang", lang);
  window.__currentLang = lang;
  if (typeof refreshStatus === "function") refreshStatus();
}

document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
  btn.addEventListener("click", () => applyLanguage(btn.getAttribute("data-lang-btn")));
});

const savedLang = localStorage.getItem("wedding-lang");
const browserLang = navigator.language && navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
applyLanguage(savedLang || browserLang);

// RSVP submit via Web3Forms (AJAX so we can show a message in the current language)
const form = document.getElementById("rsvp-form");
const status = document.getElementById("form-status");
const submitBtn = form.querySelector(".submit-btn");

// Guarda a chave do status atual para retraduzir ao trocar de idioma
var statusKey = null; // var (e não let): applyLanguage() já roda acima e chama refreshStatus()
function setStatus(key) {
  statusKey = key;
  refreshStatus();
}
function refreshStatus() {
  if (!statusKey) return;
  const lang = window.__currentLang || "pt";
  status.hidden = false;
  status.textContent = translations[lang][statusKey];
}

// Esconde número de pessoas e restrições alimentares quando a resposta é "Não"
const attendingOnly = form.querySelectorAll(".attending-only");
function updateAttendingFields() {
  const checked = form.querySelector('input[name="attending"]:checked');
  const notComing = checked && checked.value === "Não";
  attendingOnly.forEach((el) => {
    el.hidden = notComing;
    el.querySelectorAll("input, select").forEach((input) => {
      input.disabled = notComing; // campos desativados não são enviados
    });
  });
}
form.querySelectorAll('input[name="attending"]').forEach((radio) => {
  radio.addEventListener("change", updateAttendingFields);
});
form.addEventListener("reset", () => setTimeout(updateAttendingFields, 0));

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (submitBtn.disabled) return;
  submitBtn.disabled = true;
  setStatus("rsvp.form.sending");

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    // O Web3Forms responde com JSON: { success: true | false, ... }
    const result = await response.json();
    if (response.ok && result.success) {
      setStatus("rsvp.form.success");
      form.reset();
    } else {
      setStatus("rsvp.form.error");
    }
  } catch (err) {
    setStatus("rsvp.form.error");
  } finally {
    submitBtn.disabled = false;
  }
});
