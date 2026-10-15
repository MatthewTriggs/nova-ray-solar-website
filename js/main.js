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

      fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
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
          setStatus("Sorry, your enquiry couldn't be sent. Please call or WhatsApp us on 072 551 9140, or email solar.novaray@gmail.com.", "error");
        })
        .then(function () {
          button.disabled = false;
          button.textContent = buttonText;
        });
    });
  }
});
