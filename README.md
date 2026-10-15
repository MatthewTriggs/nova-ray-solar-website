# Nova Ray Solar Website

Static HTML/CSS/JS website for Nova Ray Solar, a solar installation business based in Moreleta Park, Gauteng.

## Structure

- `index.html`: Home page
- `about.html`: About the business
- `packages.html`: Full solar package pricing (5 packages, prices shown as "From R55,000" up to "From R128,000")
- `gallery.html`: Installation photo gallery
- `contact.html`: Contact details and enquiry form
- `css/styles.css`: Site styles
- `api/enquiry.js`: Vercel function that forwards enquiries to FormSubmit
- `js/main.js`: Mobile nav toggle, footer year, contact form submission (FormSubmit)
- `images/`: Logo, installation photos and package pamphlet images

## Placeholder content

Search the codebase for `PLACEHOLDER` to find copy the client should confirm before this goes live:

- `about.html`: founding year / years of installer experience
- `contact.html`: site inspection operating hours/days
- `packages.html`: current pricing note (flyer pricing was marked "while stocks last" and should be reconfirmed with the client before publishing)

## Contact form

The enquiry form on `contact.html` sends submissions by email to solar.novaray@gmail.com using [FormSubmit](https://formsubmit.co) (free, no account). `js/main.js` posts to `api/enquiry.js` (a Vercel function), which forwards the enquiry to FormSubmit's AJAX endpoint server side. This matters because FormSubmit rejects requests without a Referer header, and many browsers (Safari, Brave, privacy extensions) strip it. The visitor sees a success or error message, and the enquiry email's reply-to is set to the visitor's address; the form's `action` is a fallback for visitors without JavaScript. A hidden `_honey` field filters spam bots.

FormSubmit only delivers after a one-time activation: the first submission sends an activation email to solar.novaray@gmail.com, and the link in it must be clicked. To change the receiving address, update it in both `contact.html` and `api/enquiry.js` (and re-activate).

## Source content

Business details, logo, installation photos and package pricing were supplied directly by the client (Eugene) via WhatsApp images on 2026-08-29.
