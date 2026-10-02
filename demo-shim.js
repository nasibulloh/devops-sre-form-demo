/* Demo build of the DevOps / SRE request form: fictional data, nothing is sent anywhere.
   Injected right after telegram-web-app.js by build.py; the page itself is the bot's page, unchanged. */
(() => {
  const FORM = __FIXTURE__;
  const PREFIX = {DEPLOY: "DEP", HOTFIX: "HOT", ROLLBACK: "RBK", INFRA: "INF", ACCESS: "ACC", INCIDENT: "INC", MOBILE: "MOB", ANNOUNCE: "ANN", OTHER: "OTH"};
  const query = new URLSearchParams(location.search);
  const real = window.Telegram && window.Telegram.WebApp;
  const inTelegram = !!(real && real.initData);
  const start = (inTelegram && real.initDataUnsafe && real.initDataUnsafe.start_param) || query.get("startapp") || query.get("tgWebAppStartParam") || "";

  if (!inTelegram) {
    // In a plain browser there are no Telegram buttons: without MainButton the page shows its own «Отправить» button.
    window.Telegram = {WebApp: {initData: "demo", initDataUnsafe: {start_param: start}, ready() {}, expand() {}, close() { location.reload(); }}};
    if (query.get("theme") === "dark") {
      const dark = {"bg-color": "#212121", "secondary-bg-color": "#0f0f0f", "section-bg-color": "#212121", "text-color": "#ffffff",
        "hint-color": "#aaaaaa", "button-color": "#8774e1", "button-text-color": "#ffffff", "link-color": "#8774e1",
        "destructive-text-color": "#ff595a", "section-header-text-color": "#8774e1", "section-separator-color": "#000000"};
      Object.entries(dark).forEach(([k, v]) => document.documentElement.style.setProperty("--tg-theme-" + k, v));
    }
  }

  const reply = body => new Promise(resolve => setTimeout(() => resolve(new Response(JSON.stringify(body),
    {status: 200, headers: {"Content-Type": "application/json"}})), 350));
  const realFetch = window.fetch.bind(window);
  let last = null;

  window.fetch = (url, options) => {
    const u = String(url);
    if (u.startsWith("/miniapp/api/form")) {
      const form = JSON.parse(JSON.stringify(FORM));
      if (start.startsWith("fix_")) {
        // a request DevOps returned for rework, opened from «✏️ Исправить в форме»
        form.prefill = {number: "INF-0007", type: "INFRA", confirmed: [], reason: "Не указано число партиций и срок хранения",
          values: {"Проект": "Payments Backend", "Что нужно": "Новый топик Kafka limits.events", "К какому релизу": "1.3.0"}};
      }
      return reply(form);
    }
    if (u.startsWith("/miniapp/api/requests")) {
      return (async () => {
        const data = options.body;
        const payload = JSON.parse(await data.get("form").text());
        const files = [];
        for (const [part, file] of data.entries()) {
          if (part !== "form") {
            files.push(part + ": " + file.name + " (" + file.size + " B)");
          }
        }
        // the bot replaces secret-looking values with ***
        const hidden = [];
        Object.values(payload.values || {}).forEach(v => String(v).split("\n").forEach(line => {
          const m = line.match(/^\s*([\w.-]*(PASS|SECRET|TOKEN|KEY|PWD)[\w.-]*)\s*=\s*(.+)$/i);
          if (m && m[3].trim() !== "***") {
            hidden.push(m[1]);
          }
        }));
        last = {payload, files};
        const number = payload.fixOf || (PREFIX[payload.type] || "REQ") + "-" + String(Math.floor(1000 + Math.random() * 9000));
        return reply({number, postUrl: null, hidden, failedFiles: []});
      })();
    }
    return realFetch(url, options);
  };

  document.addEventListener("DOMContentLoaded", () => {
    const style = document.createElement("style");
    style.textContent = ".demo-sent{width:100%;text-align:left;background:var(--card);border-radius:12px;padding:10px 14px;margin-top:8px}"
      + ".demo-sent summary{cursor:pointer;color:var(--link);font-weight:600}"
      + ".demo-sent pre{white-space:pre-wrap;word-break:break-word;font-size:12px;margin:8px 0 0}";
    document.head.appendChild(style);
    const main = document.getElementById("app");
    const banner = document.createElement("div");
    banner.className = "alert";
    banner.innerHTML = "<span>🧪</span><span><b>Демо-версия.</b> Проекты вымышленные, заявка никуда не отправляется — "
      + "в конце видно, что ушло бы DevOps.</span>";
    main.insertBefore(banner, main.children[1]);
    const done = document.getElementById("done");
    new MutationObserver(() => {
      if (!done.hidden && last && !done.querySelector(".demo-sent")) {
        const details = document.createElement("details");
        details.className = "demo-sent";
        details.innerHTML = "<summary>Что ушло бы на сервер</summary><pre></pre>";
        details.querySelector("pre").textContent = JSON.stringify(last, null, 2);
        done.appendChild(details);
      }
    }).observe(done, {attributes: true, childList: true});
  });
})();
