(function () {
  'use strict';

  var state = { donor: null, purpose: null };

  // ── Step navigation ──────────────────────────────────────────────────────

  function updateStepIndicators(step) {
    for (var i = 1; i <= 3; i++) {
      var ind = document.getElementById('step-ind-' + i);
      if (!ind) continue;
      ind.classList.remove('active', 'done');
      if (i < step) ind.classList.add('done');
      else if (i === step) ind.classList.add('active');
    }
    for (var j = 1; j <= 2; j++) {
      var conn = document.getElementById('conn-' + j);
      if (conn) conn.classList.toggle('done', j < step);
    }
  }

  window.donGoToStep = function (step) {
    document.querySelectorAll('.don-section').forEach(function (s) {
      s.classList.remove('active');
    });
    var el = document.getElementById('step-' + step);
    if (el) el.classList.add('active');
    updateStepIndicators(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Step 1: Donor type ───────────────────────────────────────────────────

  window.donSelectDonorType = function (type) {
    state.donor = type;
    document.querySelectorAll('[data-donor]').forEach(function (c) {
      c.classList.toggle('selected', c.dataset.donor === type);
    });
    setTimeout(function () { donGoToStep(2); }, 220);
  };

  // ── Step 2: Purpose ──────────────────────────────────────────────────────

  window.donSelectPurpose = function (purpose, evt) {
    state.purpose = purpose;
    document.querySelectorAll('.don-purpose-card').forEach(function (c) {
      c.classList.remove('selected');
    });
    if (evt && evt.currentTarget) evt.currentTarget.classList.add('selected');

    setTimeout(function () {
      donGoToStep(3);

      // Show matching info panel, hide the rest
      ['general', 'student', 'event', 'corpus', 'infra'].forEach(function (p) {
        var panel = document.getElementById('panel-' + p);
        if (panel) panel.style.display = (p === purpose) ? 'block' : 'none';
      });

      // Show bank section
      var bankSection = document.getElementById('don-bank-section');
      if (bankSection) bankSection.style.display = 'block';

      // Show correct bank details
      var bankIndian  = document.getElementById('don-bank-indian');
      var bankForeign = document.getElementById('don-bank-foreign');
      if (bankIndian)  bankIndian.style.display  = (state.donor === 'indian')  ? 'block' : 'none';
      if (bankForeign) bankForeign.style.display = (state.donor === 'foreign') ? 'block' : 'none';

      // Pre-fill hidden fields and adapt confirmation form for donor type
      adaptConfirmForm(state.donor, state.purpose);
    }, 220);
  };

  // ── Confirmation form — adapt for donor type ─────────────────────────────

  function adaptConfirmForm(donorType, purpose) {
    var donorTypeField = document.getElementById('don-f-donor-type');
    var purposeField   = document.getElementById('don-f-purpose');
    if (donorTypeField) donorTypeField.value = donorType === 'indian' ? 'Indian' : 'Foreign';
    if (purposeField)   purposeField.value   = purposeLabel(purpose);

    // Currency prefix
    var prefix = document.getElementById('don-currency-prefix');
    if (prefix) prefix.textContent = donorType === 'indian' ? '₹' : '$';

    // Show/hide 80G-specific fields (Indian donors only)
    var groups80g = document.querySelectorAll('.don-80g-group');
    groups80g.forEach(function (g) {
      g.style.display = donorType === 'indian' ? '' : 'none';
    });

    // PAN: required for Indian, hidden for foreign
    var panGroup    = document.getElementById('don-pan-group');
    var panInput    = document.getElementById('don-f-pan');
    var panRequired = document.getElementById('don-pan-required');
    var panOptional = document.getElementById('don-pan-optional');
    var panHint     = document.getElementById('don-pan-hint');
    if (panGroup) {
      panGroup.style.display = '';  // always visible; hint changes
      if (donorType === 'indian') {
        if (panRequired) panRequired.style.display = '';
        if (panOptional) panOptional.style.display = 'none';
        if (panHint)     panHint.textContent = 'Required to receive an 80G tax receipt.';
        if (panInput)    panInput.placeholder = 'e.g. ABCDE1234F';
      } else {
        if (panRequired) panRequired.style.display = 'none';
        if (panOptional) panOptional.style.display = '';
        if (panHint)     panHint.textContent = 'Not applicable for foreign donors.';
        if (panInput)    panInput.removeAttribute('required');
      }
    }

    // Address: required if Indian (needed for 80G); hide for foreign
    var addressGroup = document.getElementById('don-address-group');
    var addressInput = document.getElementById('don-f-address');
    if (addressGroup) addressGroup.style.display = donorType === 'indian' ? '' : 'none';
    if (addressInput) {
      if (donorType === 'indian') {
        addressInput.required = true;
      } else {
        addressInput.required = false;
        addressInput.removeAttribute('required');
      }
    }

    // Payment mode: pre-select first option relevant to donor type
    var modeSelect = document.getElementById('don-f-mode');
    if (modeSelect) modeSelect.value = donorType === 'indian' ? 'UPI' : 'Wire Transfer';
  }

  function purposeLabel(p) {
    var map = {
      general: 'General Donation',
      student: 'Sponsor a Student',
      event:   'Sponsor an Event',
      corpus:  'Corpus Fund',
      infra:   'Infrastructure'
    };
    return map[p] || p;
  }

  // ── Confirmation form submission ─────────────────────────────────────────

  var confirmForm = document.getElementById('don-confirm-form');
  if (confirmForm) {
    confirmForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (typeof DONATION_ENDPOINT === 'undefined' || !DONATION_ENDPOINT) {
        document.getElementById('don-confirm-error').style.display = 'block';
        return;
      }

      var btn = document.getElementById('don-confirm-btn');
      btn.disabled = true;
      btn.textContent = 'Sending\u2026';

      // Hide any previous results
      document.getElementById('don-confirm-success').style.display = 'none';
      document.getElementById('don-confirm-error').style.display = 'none';

      var data = new FormData(confirmForm);
      var params = new URLSearchParams();
      data.forEach(function (val, key) { params.append(key, val); });

      fetch(DONATION_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (json.success) {
            confirmForm.style.display = 'none';
            var successEl = document.getElementById('don-confirm-success');
            successEl.style.display = 'block';
            // Show 80G follow-up message if Indian donor requested receipt
            var wantsReceipt = document.querySelector('input[name="wants_receipt"]:checked');
            var followUp = document.getElementById('don-receipt-follow-up');
            if (followUp && wantsReceipt && wantsReceipt.value === 'Yes' && state.donor === 'indian') {
              followUp.style.display = 'block';
            }
          } else {
            throw new Error(json.error || 'Submission failed');
          }
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = 'Confirm My Donation';
          document.getElementById('don-confirm-error').style.display = 'block';
        });
    });
  }

  // ── Copy to clipboard ────────────────────────────────────────────────────

  window.donCopyText = function (text, btn) {
    if (!navigator.clipboard) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      flashCopyBtn(btn);
      return;
    }
    navigator.clipboard.writeText(text).then(function () { flashCopyBtn(btn); });
  };

  function flashCopyBtn(btn) {
    var orig = btn.textContent;
    btn.textContent = '✓';
    btn.classList.add('don-copy-btn--done');
    setTimeout(function () {
      btn.textContent = orig;
      btn.classList.remove('don-copy-btn--done');
    }, 1600);
  }

})();
