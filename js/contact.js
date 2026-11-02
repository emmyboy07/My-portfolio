(function () {
  var form = document.getElementById("contact-form");
  if (!form) {
    return;
  }

  var fields = {
    name: {
      input: document.getElementById("name"),
      error: document.getElementById("name-error"),
      validate: function (value) {
        return value.trim().length > 0 ? "" : "Please enter your name.";
      },
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("email-error"),
      validate: function (value) {
        if (!value.trim()) {
          return "Please enter your email address.";
        }
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value) ? "" : "Please enter a valid email address.";
      },
    },
    phone: {
      input: document.getElementById("phone"),
      error: document.getElementById("phone-error"),
      validate: function (value) {
        if (!value.trim()) {
          return "Please enter your phone number.";
        }
        var digitsOnly = /^[0-9]+$/;
        return digitsOnly.test(value) ? "" : "Phone number must contain digits only.";
      },
    },
    message: {
      input: document.getElementById("message"),
      error: document.getElementById("message-error"),
      validate: function (value) {
        return value.trim().length > 0 ? "" : "Please enter a message.";
      },
    },
  };

  var statusEl = document.getElementById("form-status");

  function validateField(key) {
    var field = fields[key];
    var message = field.validate(field.input.value);
    field.error.textContent = message;
    field.input.classList.toggle("invalid", Boolean(message));
    return message === "";
  }

  Object.keys(fields).forEach(function (key) {
    fields[key].input.addEventListener("input", function () {
      validateField(key);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var isValid = Object.keys(fields)
      .map(validateField)
      .every(Boolean);

    statusEl.classList.remove("success", "error");

    if (!isValid) {
      statusEl.textContent = "Please fix the highlighted fields before submitting.";
      statusEl.classList.add("error");
      return;
    }

    statusEl.textContent = "Thanks! Your message has been received. I'll get back to you soon.";
    statusEl.classList.add("success");
    form.reset();
  });
})();
