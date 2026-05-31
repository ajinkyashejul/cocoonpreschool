/* ============================================================
   Cocoon Preschool — landing page behaviour
   - Handles the callback form (Web3Forms + WhatsApp fallback)
   - Honeypot spam protection
   - Google Ads conversion hooks (optional)
   ============================================================ */

(function () {
  "use strict";

  // Current year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // WhatsApp number — country code + number, no "+" or spaces
  var WHATSAPP_NUMBER = "919834994505";

  // OPTIONAL Google Ads conversion label. Fill both, then events will fire.
  // Example: { send_to: 'AW-XXXXXXXXX/AbC-D_efG' }
  var ADS_CONVERSION = { send_to: "" };

  function track(action) {
    // Fire a Google Ads / GA event if gtag is present
    if (typeof window.gtag === "function") {
      window.gtag("event", action, { event_category: "engagement" });
      if (ADS_CONVERSION.send_to && action === "lead_success") {
        window.gtag("event", "conversion", ADS_CONVERSION);
      }
    }
  }

  // Lightweight click tracking on any element with data-track
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-track]");
    if (el) track(el.getAttribute("data-track"));
  });

  var form = document.getElementById("lead-form");
  var statusEl = document.getElementById("form-status");
  var successEl = document.getElementById("lead-success");

  if (!form) return;

  var action = form.getAttribute("action") || "";

  // Is a real email backend wired up yet? Supports Web3Forms or Formspree.
  var keyEl = form.querySelector('[name="access_key"]');
  var web3Configured =
    action.indexOf("web3forms.com") !== -1 &&
    keyEl && keyEl.value.indexOf("YOUR_WEB3FORMS") === -1 && keyEl.value.length > 10;
  var formspreeConfigured =
    action.indexOf("formspree.io") !== -1 && action.indexOf("YOUR_FORM_ID") === -1;
  var backendConfigured = web3Configured || formspreeConfigured;

  function showStatus(msg, kind) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = "form-status" + (kind ? " " + kind : "");
  }

  function showSuccess() {
    track("lead_success");
    if (successEl) {
      form.style.display = "none";
      successEl.hidden = false;
      successEl.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      showStatus("Thank you! We'll call you back shortly.", "ok");
    }
  }

  // Build a prefilled WhatsApp message from the form fields
  function whatsappFallback(data) {
    var msg =
      "Hi Cocoon Preschool, please call me back.%0A" +
      "Name: " + encodeURIComponent(data.parent_name || "") + "%0A" +
      "Phone: " + encodeURIComponent(data.phone || "") + "%0A" +
      "Child's age: " + encodeURIComponent(data.child_age || "");
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + msg;
  }

  form.addEventListener("submit", function (e) {
    // Honeypot: if filled, silently drop (bot)
    if (form._gotcha && form._gotcha.value) {
      e.preventDefault();
      showSuccess();
      return;
    }

    var data = {
      parent_name: form.parent_name ? form.parent_name.value.trim() : "",
      phone: form.phone ? form.phone.value.trim() : "",
      child_age: form.child_age ? form.child_age.value : ""
    };

    // If no email backend is set up yet, fall back to WhatsApp so no lead is lost.
    if (!backendConfigured) {
      e.preventDefault();
      track("form_submit_fallback_whatsapp");
      window.open(whatsappFallback(data), "_blank");
      showSuccess();
      return;
    }

    // Backend configured → submit via fetch for a smooth, no-reload UX.
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
    showStatus("");

    fetch(action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        // Web3Forms returns 200 with { success: true|false }. Formspree returns ok.
        return res.json().catch(function () { return {}; }).then(function (json) {
          if (res.ok && json.success !== false) {
            showSuccess();
          } else {
            throw new Error("submit_failed");
          }
        });
      })
      .catch(function () {
        // Network/Formspree error → don't lose the lead, offer WhatsApp.
        showStatus("Couldn't send just now. Opening WhatsApp so we don't miss you…", "err");
        window.open(whatsappFallback(data), "_blank");
      })
      .finally(function () {
        if (btn) { btn.disabled = false; btn.textContent = "Request my callback"; }
      });
  });
})();
