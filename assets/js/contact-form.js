(function () {
  'use strict';

  var reasonSelect   = document.getElementById('contact-reason');
  var sectionCommon  = document.getElementById('section-common');
  var formActions    = document.getElementById('form-actions');
  var ctxBlocks      = document.querySelectorAll('.context-block');
  var specificSects  = document.querySelectorAll('.form-section--specific');
  var carRoleSelect  = document.getElementById('car-role');
  var carRoleOtherGrp = document.getElementById('car-role-other-group');
  var carRoleOther   = document.getElementById('car-role-other');
  var form           = document.getElementById('contact-form');
  var submitBtn      = document.getElementById('form-submit-btn');
  var donTypeRadios  = document.querySelectorAll('input[name="don-type"]');
  var donMoneyInfo   = document.getElementById('ctx-donations-money');
  var donSection     = document.getElementById('section-donations');

  // Enable/disable all inputs inside a fieldset
  function setEnabled(section, enabled) {
    if (!section) return;
    section.querySelectorAll('input, select, textarea').forEach(function (f) {
      f.disabled = !enabled;
    });
  }

  // Reset: hide everything and disable all specific inputs
  function reset() {
    ctxBlocks.forEach(function (b) { b.hidden = true; });
    specificSects.forEach(function (s) { s.hidden = true; setEnabled(s, false); });
    setEnabled(sectionCommon, false);
    sectionCommon.hidden = true;
    formActions.hidden = true;
    donTypeRadios.forEach(function (r) { r.checked = false; r.disabled = true; });
    if (donMoneyInfo) donMoneyInfo.hidden = true;
  }

  function onReasonChange() {
    reset();
    var val = reasonSelect.value;
    if (!val) return;

    // Show context block
    var ctx = document.getElementById('ctx-' + val);
    if (ctx) ctx.hidden = false;

    // Donations: enable radio buttons, let onDonTypeChange drive the rest
    if (val === 'donations') {
      donTypeRadios.forEach(function (r) { r.disabled = false; });
      return;
    }

    // Show common section
    sectionCommon.hidden = false;
    setEnabled(sectionCommon, true);
    formActions.hidden = false;

    // Show type-specific section
    var specific = document.getElementById('section-' + val);
    if (specific) {
      specific.hidden = false;
      setEnabled(specific, true);
    }

    // Careers sub-select: re-apply state
    if (val === 'careers') onCarRoleChange();
  }

  if (reasonSelect) {
    reasonSelect.addEventListener('change', onReasonChange);
    // Initial disabled state
    specificSects.forEach(function (s) { setEnabled(s, false); });
    setEnabled(sectionCommon, false);
    if (carRoleOther) carRoleOther.disabled = true;
    donTypeRadios.forEach(function (r) { r.disabled = true; });
  }

  // Donation type radio → show money info or goods form
  function onDonTypeChange() {
    var selected = '';
    donTypeRadios.forEach(function (r) { if (r.checked) selected = r.value; });

    if (donMoneyInfo) donMoneyInfo.hidden = (selected !== 'money');

    if (selected === 'goods') {
      sectionCommon.hidden = false;
      setEnabled(sectionCommon, true);
      if (donSection) { donSection.hidden = false; setEnabled(donSection, true); }
      formActions.hidden = false;
    } else {
      sectionCommon.hidden = true;
      setEnabled(sectionCommon, false);
      if (donSection) { donSection.hidden = true; setEnabled(donSection, false); }
      formActions.hidden = true;
    }
  }

  donTypeRadios.forEach(function (r) {
    r.addEventListener('change', onDonTypeChange);
  });

  // Careers role → show "Other" description field
  function onCarRoleChange() {
    if (!carRoleSelect || !carRoleOtherGrp) return;
    var isOther = carRoleSelect.value === 'Other';
    carRoleOtherGrp.hidden = !isOther;
    if (carRoleOther) {
      carRoleOther.disabled = !isOther;
      if (isOther) {
        carRoleOther.setAttribute('required', '');
      } else {
        carRoleOther.removeAttribute('required');
        carRoleOther.value = '';
      }
    }
  }

  if (carRoleSelect) {
    carRoleSelect.addEventListener('change', onCarRoleChange);
  }

  // Weekday-only validation for date inputs
  function isWeekday(dateStr) {
    if (!dateStr) return true;
    var d = new Date(dateStr + 'T00:00:00');
    var day = d.getDay();
    return day !== 0 && day !== 6;
  }

  ['adm-date1', 'adm-date2', 'adm-date3'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', function () {
      if (this.value && !isWeekday(this.value)) {
        this.setCustomValidity('Please choose a weekday (Monday to Friday).');
      } else {
        this.setCustomValidity('');
      }
    });
  });

  // Convert a file to { name, type, content (base64) }
  function fileToBase64(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        resolve({ name: file.name, type: file.type, content: reader.result.split(',')[1] });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function collectFiles(inputId) {
    var el = document.getElementById(inputId);
    if (!el || !el.files || el.files.length === 0) return Promise.resolve([]);
    return Promise.all(Array.from(el.files).map(fileToBase64));
  }

  // Form submission
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (!CONTACT_FORM_ENDPOINT) {
        document.getElementById('form-error').hidden = false;
        return;
      }

      var reason = reasonSelect.value;
      var payload = {
        type: reason,
        full_name:       document.getElementById('field-name').value,
        contact_number:  document.getElementById('field-phone').value,
        email:           document.getElementById('field-email').value,
        city:            document.getElementById('field-city').value,
        fields: {},
        files: []
      };

      var filePromise = Promise.resolve([]);

      switch (reason) {
        case 'admissions':
          payload.fields = {
            student_name: document.getElementById('adm-student-name').value,
            student_age:  document.getElementById('adm-student-age').value,
            date_1:       document.getElementById('adm-date1').value,
            date_2:       document.getElementById('adm-date2').value,
            date_3:       document.getElementById('adm-date3').value
          };
          filePromise = collectFiles('adm-document');
          break;

        case 'volunteer':
          payload.fields = {
            age:          document.getElementById('vol-age').value,
            availability: document.getElementById('vol-availability').value,
            skills:       document.getElementById('vol-skills').value
          };
          filePromise = collectFiles('vol-cv');
          break;

        case 'careers':
          var role = document.getElementById('car-role').value;
          payload.fields = {
            role:  role === 'Other'
                     ? (document.getElementById('car-role-other').value + ' (Other)')
                     : role,
            notes: document.getElementById('car-notes').value
          };
          filePromise = collectFiles('car-cv');
          break;

        case 'collaborations':
          payload.fields = { idea: document.getElementById('col-idea').value };
          break;

        case 'donations':
          var checkedDropoff = document.querySelector('input[name="don-dropoff"]:checked');
          payload.fields = {
            items:       document.getElementById('don-items').value,
            location:    document.getElementById('don-location').value,
            can_drop_off: checkedDropoff ? checkedDropoff.value : ''
          };
          break;

        case 'other':
          payload.fields = { message: document.getElementById('oth-message').value };
          break;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending\u2026';

      filePromise.then(function (files) {
        payload.files = files;
        return fetch(CONTACT_FORM_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload)
        });
      }).then(function () {
        form.hidden = true;
        document.getElementById('form-success').hidden = false;
      }).catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        document.getElementById('form-error').hidden = false;
      });
    });
  }
})();
