/**
 * LHLC Contact Form — Google Apps Script
 * ========================================
 * SETUP INSTRUCTIONS:
 *   1. Go to script.google.com and create a new project.
 *   2. Paste this entire file as Code.gs.
 *   3. Go to Project Settings → Script Properties and add:
 *        CONTACT_EMAIL  →  the email that should receive form submissions
 *        SHEET_ID       →  the ID from your Google Sheets URL (the long string between /d/ and /edit)
 *   4. Click Deploy → New Deployment → Web App.
 *      Set "Execute as" = Me, "Who has access" = Anyone.
 *   5. Copy the web app URL and paste it into _data/contact.yml under form_endpoint.
 *   6. Re-deploy whenever you change this script (Deploy → Manage → edit existing deployment).
 */

var TAB_CONFIG = {
  admissions: {
    name: 'Admissions',
    headers: ['Timestamp', 'Full Name', 'Phone', 'Email', 'City',
              'Student Name', 'Student Age', 'Date 1', 'Date 2', 'Date 3', 'Documents']
  },
  volunteer: {
    name: 'Volunteer',
    headers: ['Timestamp', 'Full Name', 'Phone', 'Email', 'City',
              'Age', 'Availability', 'Skills / Experience', 'CV']
  },
  careers: {
    name: 'Careers',
    headers: ['Timestamp', 'Full Name', 'Phone', 'Email', 'City',
              'Role', 'Additional Notes', 'CV']
  },
  collaborations: {
    name: 'Collaborations',
    headers: ['Timestamp', 'Full Name', 'Phone', 'Email', 'City', 'Idea']
  },
  other: {
    name: 'Other',
    headers: ['Timestamp', 'Full Name', 'Phone', 'Email', 'City', 'Message']
  }
};

// ── Entry point ──────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var props = PropertiesService.getScriptProperties();
    var contactEmail = props.getProperty('CONTACT_EMAIL');
    var sheetId      = props.getProperty('SHEET_ID');

    var typeKey   = (data.type || 'other').toLowerCase();
    var tabConf   = TAB_CONFIG[typeKey] || TAB_CONFIG.other;
    var timestamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, hh:mm a');

    // Build file attachments from base64
    var attachments = (data.files || []).map(function (f) {
      return Utilities.newBlob(Utilities.base64Decode(f.content), f.type, f.name);
    });

    // Send email
    if (contactEmail) {
      var subject = '[LHLC] ' + cap(typeKey) + ' enquiry from ' + (data.full_name || 'Unknown');
      var body    = buildEmailBody(data, typeKey, timestamp);
      var opts    = { name: 'LHLC Website' };
      if (attachments.length > 0) opts.attachments = attachments;
      GmailApp.sendEmail(contactEmail, subject, body, opts);
    }

    // Write to Sheet
    if (sheetId) {
      writeToSheet(sheetId, tabConf, data, typeKey, timestamp, attachments);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log(err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Email body ───────────────────────────────────────────────────────────────

function buildEmailBody(data, typeKey, timestamp) {
  var f = data.fields || {};
  var lines = [
    'Form type : ' + cap(typeKey),
    'Submitted  : ' + timestamp,
    '',
    '── Contact Details ──────────────────────────',
    'Full Name  : ' + (data.full_name       || '—'),
    'Phone      : ' + (data.contact_number  || '—'),
    'Email      : ' + (data.email           || '—'),
    'City       : ' + (data.city            || '—'),
    ''
  ];

  if (Object.keys(f).length > 0) {
    lines.push('── ' + cap(typeKey) + ' Details ─────────────────────────');
    Object.keys(f).forEach(function (k) {
      var label = k.replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
      lines.push(label + ' : ' + (f[k] || '—'));
    });
    lines.push('');
  }

  if (data.files && data.files.length > 0) {
    lines.push('── Attachments ──────────────────────────────');
    data.files.forEach(function (file) {
      lines.push('• ' + file.name + '  (' + file.type + ')');
    });
  }

  return lines.join('\n');
}

// ── Google Sheet ─────────────────────────────────────────────────────────────

function writeToSheet(sheetId, tabConf, data, typeKey, timestamp, attachments) {
  var ss    = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheetByName(tabConf.name);

  // Create tab + header row if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(tabConf.name);
    var headerRange = sheet.getRange(1, 1, 1, tabConf.headers.length);
    headerRange.setValues([tabConf.headers]);
    headerRange.setFontWeight('bold').setBackground('#e04d8a').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  var f         = data.fields || {};
  var fileNames = (data.files || []).map(function (file) { return file.name; }).join(', ') || '—';
  var row;

  switch (typeKey) {
    case 'admissions':
      row = [timestamp, data.full_name, data.contact_number, data.email, data.city,
             f.student_name || '—', f.student_age || '—',
             f.date_1 || '—', f.date_2 || '—', f.date_3 || '—', fileNames];
      break;
    case 'volunteer':
      row = [timestamp, data.full_name, data.contact_number, data.email, data.city,
             f.age || '—', f.availability || '—', f.skills || '—', fileNames];
      break;
    case 'careers':
      row = [timestamp, data.full_name, data.contact_number, data.email, data.city,
             f.role || '—', f.notes || '—', fileNames];
      break;
    case 'collaborations':
      row = [timestamp, data.full_name, data.contact_number, data.email, data.city,
             f.idea || '—'];
      break;
    default:
      row = [timestamp, data.full_name, data.contact_number, data.email, data.city,
             f.message || '—'];
  }

  sheet.appendRow(row);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function cap(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}
