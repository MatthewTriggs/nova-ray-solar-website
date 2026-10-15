document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("open");
      });
    });
  }

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.getElementById("form-status");
      var button = form.querySelector('button[type="submit"]');
      var buttonText = button.textContent;

      var setStatus = function (text, type) {
        status.textContent = text;
        status.className = "form-note" + (type ? " is-" + type : "");
      };

      var data = {};
      new FormData(form).forEach(function (value, key) {
        data[key] = value;
      });

      button.disabled = true;
      button.textContent = "Sending...";
      setStatus("", "");

      // FormSubmit rejects requests without a Referer, so ask the browser to send one.
      // Some browsers and privacy extensions strip it anyway; the WhatsApp fallback covers those.
      fetch("https://formsubmit.co/ajax/solar.novaray@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        referrer: window.location.href,
        referrerPolicy: "no-referrer-when-downgrade",
        body: JSON.stringify(data)
      })
        .then(function (response) {
          return response.json().then(function (result) {
            if (!response.ok || String(result.success) !== "true") {
              throw new Error(result.message || "Submission failed");
            }
          });
        })
        .then(function () {
          setStatus("Thanks! Your enquiry has been sent. We'll be in touch shortly. For a faster response, call or WhatsApp 072 551 9140.", "success");
          form.reset();
        })
        .catch(function () {
          setStatus("Sorry, your enquiry couldn't be sent from this browser. Tap below to send it on WhatsApp instead, or call 072 551 9140.", "error");
          var text = "Hi Nova Ray Solar, I'd like a free quote.\n\n" +
            "Name: " + data.name + "\n" +
            "Phone: " + data.phone + "\n" +
            "Email: " + data.email + "\n" +
            "Interested in: " + (data.package || "Not sure yet") +
            (data.message ? "\n\n" + data.message : "");
          var link = document.createElement("a");
          link.href = "https://wa.me/27725519140?text=" + encodeURIComponent(text);
          link.target = "_blank";
          link.rel = "noopener";
          link.className = "btn btn-primary form-fallback";
          link.textContent = "Send via WhatsApp instead";
          status.appendChild(document.createElement("br"));
          status.appendChild(link);
        })
        .then(function () {
          button.disabled = false;
          button.textContent = buttonText;
        });
    });
  }
});
