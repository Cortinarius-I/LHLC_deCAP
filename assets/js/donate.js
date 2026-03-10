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
    }, 220);
  };

  // ── Copy to clipboard ────────────────────────────────────────────────────

  window.donCopyText = function (text, btn) {
    if (!navigator.clipboard) {
      // Fallback for older browsers
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      flashCopyBtn(btn);
      return;
    }
    navigator.clipboard.writeText(text).then(function () {
      flashCopyBtn(btn);
    });
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
