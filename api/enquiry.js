// Receives contact form enquiries and forwards them to FormSubmit, which emails
// solar.novaray@gmail.com. Sending server side means the Referer header FormSubmit
// requires is always present, even when the visitor's browser strips it
// (Safari, Brave and privacy extensions often do).

const FORMSUBMIT_URL = "https://formsubmit.co/ajax/solar.novaray@gmail.com";
const SITE_URL = "https://nova-ray-solar-website.vercel.app/contact.html";
const FIELDS = ["name", "phone", "email", "package", "message"];

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  var body = req.body || {};

  // Honeypot: real visitors never fill this hidden field, so pretend it worked.
  if (body._honey) {
    return res.status(200).json({ success: true });
  }

  var data = {};
  FIELDS.forEach(function (key) {
    data[key] = String(body[key] || "").trim().slice(0, 5000);
  });

  if (!data.name || !data.phone || !data.email) {
    return res.status(400).json({ success: false, message: "Name, phone and email are required" });
  }

  data._subject = "New website enquiry - Nova Ray Solar";
  data._template = "table";
  data._captcha = "false";
  data._replyto = data.email;

  try {
    var response = await fetch(FORMSUBMIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Referer: SITE_URL,
        Origin: "https://nova-ray-solar-website.vercel.app"
      },
      body: JSON.stringify(data)
    });
    var text = await response.text();
    var result = {};
    try {
      result = JSON.parse(text);
    } catch (e) {
      result = { message: "Unexpected response from FormSubmit" };
    }

    if (!response.ok || String(result.success) !== "true") {
      console.error("FormSubmit rejected enquiry:", response.status, text.slice(0, 500));
      return res.status(502).json({ success: false, message: result.message || "Submission failed", upstreamStatus: response.status });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("FormSubmit request failed:", err);
    return res.status(502).json({ success: false, message: "Submission failed" });
  }
};
