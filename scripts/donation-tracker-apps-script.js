// ============================================================
// LITTLE HEARTS LEARNING CENTRE — DONATION TRACKER
// Google Apps Script for Google Sheets
// ============================================================
//
// SETUP INSTRUCTIONS:
// 1. Create a Google Sheet
// 2. Open Extensions → Apps Script
// 3. Paste this entire script
// 4. Update CONFIG below with your actual values
// 5. Run setupSheet() once to create headers and formatting
// 6. Create a Google Docs receipt template (instructions below)
// 7. Link a Google Form to the "Donations" sheet tab
//    (see FORM MAPPING section at the bottom)
// 8. Run createMenu() and refresh the sheet — you'll see a
//    "Donation Tools" menu in the toolbar
//
// ============================================================

// === CONFIGURATION — UPDATE THESE ===
var CONFIG = {
  trustName:    "Dhristi Foundation",
  trustAddress: "Plot No 81C, Sindhi Society, Chembur, Mumbai 400071",
  trustPAN:     "XXXXXXXXXXXXX",       // ← Fill in trust PAN
  trustEmail:   "littlehearts2009@gmail.com",
  trustPhone:   "+91 9967707505",

  // 80G details
  reg80G:       "XXXXXXXXXXXXX",       // ← Fill in 80G registration number
  validFrom80G: "01/04/2024",
  validTo80G:   "31/03/2029",

  // Google Docs receipt template ID
  // Create a Doc with {{PLACEHOLDERS}} (see list below) and paste its ID here
  receiptTemplateId: "PASTE_TEMPLATE_DOC_ID_HERE",

  // Google Drive folder to save generated receipt PDFs
  receiptFolderId: "PASTE_FOLDER_ID_HERE",

  // Receipt number prefix — update each financial year
  // e.g. "LHLC-2526-" for FY 2025-26
  receiptPrefix: "LHLC-2526-",

  emailSubject: "Donation Receipt — Little Hearts Learning Centre / Dhristi Foundation",
};


// ============================================================
// SHEET SETUP
// ============================================================

/**
 * Run once to create the Donations sheet with headers and formatting.
 */
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // --- Donations sheet ---
  var sheet = ss.getSheetByName("Donations") || ss.insertSheet("Donations");
  var headers = [
    "Timestamp",           // A — auto from Google Form
    "Donor Name",          // B
    "Email",               // C
    "Phone",               // D
    "PAN",                 // E — required for 80G receipts
    "Address",             // F
    "Donor Type",          // G — Indian / Foreign
    "Amount (₹)",          // H
    "Date of Transfer",    // I
    "Payment Mode",        // J — UPI / NEFT / IMPS / Wire Transfer / Cash / Cheque
    "Transaction Ref/UTR", // K
    "Purpose",             // L — General / Sponsor a Student / Sponsor an Event / Corpus Fund / Infrastructure
    "Frequency Intent",    // M — One-time / Monthly / Yearly
    "Wants 80G Receipt",   // N — Yes / No
    "Status",              // O — Pending / Verified / Receipt Sent / Rejected
    "Verified By",         // P
    "Verified Date",       // Q
    "Receipt No",          // R
    "Receipt Sent Date",   // S
    "Notes",               // T
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground("#4A0E7A")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setFontSize(10);
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 160);  // Timestamp
  sheet.setColumnWidth(2, 180);  // Name
  sheet.setColumnWidth(3, 210);  // Email
  sheet.setColumnWidth(8, 110);  // Amount
  sheet.setColumnWidth(12, 180); // Purpose
  sheet.setColumnWidth(15, 120); // Status

  // Data validation for Status column
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Pending", "Verified", "Receipt Sent", "Rejected"])
    .build();
  sheet.getRange("O2:O1000").setDataValidation(statusRule);
  sheet.getRange("O2:O1000").setValue("Pending");

  // Conditional formatting
  var rules = [
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Pending").setBackground("#FFF9C4").setRanges([sheet.getRange("O2:O1000")]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Verified").setBackground("#C8E6C9").setRanges([sheet.getRange("O2:O1000")]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Receipt Sent").setBackground("#BBDEFB").setRanges([sheet.getRange("O2:O1000")]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Rejected").setBackground("#FFCDD2").setRanges([sheet.getRange("O2:O1000")]).build(),
  ];
  sheet.setConditionalFormatRules(rules);

  // --- Settings sheet ---
  var settings = ss.getSheetByName("Settings") || ss.insertSheet("Settings");
  var settingsData = [
    ["Setting", "Value"],
    ["Next Receipt Number", 1],
    ["Trust PAN", CONFIG.trustPAN],
    ["80G Registration", CONFIG.reg80G],
    ["80G Valid From", CONFIG.validFrom80G],
    ["80G Valid To", CONFIG.validTo80G],
    ["Receipt Template ID", CONFIG.receiptTemplateId],
    ["Receipt Folder ID", CONFIG.receiptFolderId],
  ];
  settings.getRange(1, 1, settingsData.length, 2).setValues(settingsData);
  settings.getRange(1, 1, 1, 2).setBackground("#4A0E7A").setFontColor("#FFFFFF").setFontWeight("bold");

  SpreadsheetApp.getActiveSpreadsheet().toast("Sheet setup complete!", "✓ Done");
}


// ============================================================
// CUSTOM MENU
// ============================================================

function onOpen() {
  createMenu();
}

function createMenu() {
  SpreadsheetApp.getUi().createMenu("♥ Donation Tools")
    .addItem("✓ Mark Selected as Verified", "markVerified")
    .addItem("📧 Generate & Send 80G Receipt", "generateReceiptForSelected")
    .addSeparator()
    .addItem("📊 Donation Summary", "showSummary")
    .addItem("🔧 Initial Setup", "setupSheet")
    .addToUi();
}


// ============================================================
// VERIFICATION
// ============================================================

/**
 * Mark selected row(s) as Verified and record who verified it.
 */
function markVerified() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var startRow = sheet.getActiveRange().getRow();
  var numRows  = sheet.getActiveRange().getNumRows();
  var user     = Session.getActiveUser().getEmail();
  var now      = new Date();
  var count    = 0;

  for (var i = 0; i < numRows; i++) {
    var row = startRow + i;
    if (row < 2) continue;
    if (sheet.getRange(row, 15).getValue() === "Pending") {
      sheet.getRange(row, 15).setValue("Verified");
      sheet.getRange(row, 16).setValue(user);
      sheet.getRange(row, 17).setValue(now);
      count++;
    }
  }

  SpreadsheetApp.getActiveSpreadsheet().toast(count + " row(s) marked as Verified", "✓ Done");
}


// ============================================================
// RECEIPT GENERATION
// ============================================================

/**
 * Generate an 80G receipt PDF and email it to the donor.
 * Select the donation row first, then run this function (or use the menu).
 *
 * RECEIPT TEMPLATE PLACEHOLDERS:
 *   {{RECEIPT_NO}}        — e.g. LHLC-2526-0001
 *   {{RECEIPT_DATE}}      — date receipt was generated
 *   {{FINANCIAL_YEAR}}    — e.g. 2025-26
 *   {{DONOR_NAME}}
 *   {{DONOR_ADDRESS}}
 *   {{DONOR_PAN}}
 *   {{DONOR_EMAIL}}
 *   {{DONOR_PHONE}}
 *   {{AMOUNT_FIGURES}}    — Indian-formatted number, e.g. 5,000
 *   {{AMOUNT_WORDS}}      — e.g. Five Thousand
 *   {{DONATION_DATE}}     — date donor made the transfer
 *   {{PAYMENT_MODE}}
 *   {{TRANSACTION_REF}}
 *   {{DONATION_PURPOSE}}
 *   {{DONATION_FREQUENCY}}
 *   {{80G_REG_NO}}
 *   {{80G_VALID_FROM}}
 *   {{80G_VALID_TO}}
 *   {{TRUST_PAN}}
 */
function generateReceiptForSelected() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var row   = sheet.getActiveRange().getRow();

  if (row < 2) {
    SpreadsheetApp.getUi().alert("Please select a donation row (not the header).");
    return;
  }

  var data        = sheet.getRange(row, 1, 1, 20).getValues()[0];
  var status      = data[14]; // Column O
  var wantsReceipt = data[13]; // Column N
  var donorType   = data[6];  // Column G

  if (status !== "Verified") {
    SpreadsheetApp.getUi().alert(
      "This donation must be marked as 'Verified' before generating a receipt.\n" +
      "Current status: " + status
    );
    return;
  }

  if (donorType === "Foreign") {
    SpreadsheetApp.getUi().alert(
      "80G receipts are for Indian donors only.\n" +
      "For foreign donors, issue an FCRA receipt manually."
    );
    return;
  }

  if (wantsReceipt !== "Yes") {
    var proceed = SpreadsheetApp.getUi().alert(
      "This donor did not request an 80G receipt. Generate and send anyway?",
      SpreadsheetApp.getUi().ButtonSet.YES_NO
    );
    if (proceed !== SpreadsheetApp.getUi().Button.YES) return;
  }

  // Get next receipt number
  var settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  var nextNum  = settingsSheet.getRange("B2").getValue();
  var receiptNo = CONFIG.receiptPrefix + String(nextNum).padStart(4, "0");

  var replacements = {
    "{{RECEIPT_NO}}":         receiptNo,
    "{{RECEIPT_DATE}}":       Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy"),
    "{{FINANCIAL_YEAR}}":     getFinancialYear(data[8] || new Date()),
    "{{DONOR_NAME}}":         data[1]  || "",
    "{{DONOR_ADDRESS}}":      data[5]  || "",
    "{{DONOR_PAN}}":          data[4]  || "",
    "{{DONOR_EMAIL}}":        data[2]  || "",
    "{{DONOR_PHONE}}":        data[3]  || "",
    "{{AMOUNT_FIGURES}}":     formatIndianNumber(data[7]),
    "{{AMOUNT_WORDS}}":       numberToWords(data[7]),
    "{{DONATION_DATE}}":      data[8]  ? Utilities.formatDate(new Date(data[8]), "Asia/Kolkata", "dd/MM/yyyy") : "",
    "{{PAYMENT_MODE}}":       data[9]  || "",
    "{{TRANSACTION_REF}}":    data[10] || "",
    "{{DONATION_PURPOSE}}":   data[11] || "General",
    "{{DONATION_FREQUENCY}}": data[12] || "One-time",
    "{{80G_REG_NO}}":         CONFIG.reg80G,
    "{{80G_VALID_FROM}}":     CONFIG.validFrom80G,
    "{{80G_VALID_TO}}":       CONFIG.validTo80G,
    "{{TRUST_PAN}}":          CONFIG.trustPAN,
  };

  try {
    var templateDoc = DriveApp.getFileById(CONFIG.receiptTemplateId);
    var folder      = DriveApp.getFolderById(CONFIG.receiptFolderId);
    var fileName    = "80G_Receipt_" + receiptNo + "_" + (data[1] || "Donor");
    var copy        = templateDoc.makeCopy(fileName, folder);
    var doc         = DocumentApp.openById(copy.getId());
    var body        = doc.getBody();

    for (var placeholder in replacements) {
      body.replaceText(escapeRegex(placeholder), replacements[placeholder]);
    }
    doc.saveAndClose();

    var pdfBlob = DriveApp.getFileById(copy.getId())
      .getAs("application/pdf")
      .setName(fileName + ".pdf");
    folder.createFile(pdfBlob);

    // Email donor
    var donorEmail = data[2];
    if (donorEmail) {
      GmailApp.sendEmail(donorEmail, CONFIG.emailSubject, "", {
        htmlBody:    buildReceiptEmail(data[1], data[7], receiptNo),
        attachments: [pdfBlob],
        name:        CONFIG.trustName,
        replyTo:     CONFIG.trustEmail,
      });
    }

    // Update sheet
    sheet.getRange(row, 15).setValue("Receipt Sent");
    sheet.getRange(row, 18).setValue(receiptNo);
    sheet.getRange(row, 19).setValue(new Date());
    settingsSheet.getRange("B2").setValue(nextNum + 1);

    // Clean up the Docs copy (keep only the PDF)
    DriveApp.getFileById(copy.getId()).setTrashed(true);

    SpreadsheetApp.getActiveSpreadsheet().toast(
      "Receipt " + receiptNo + " sent to " + (donorEmail || "donor"),
      "📧 Receipt Sent"
    );

  } catch (e) {
    SpreadsheetApp.getUi().alert("Error generating receipt:\n" + e.message);
    Logger.log(e);
  }
}


// ============================================================
// DONATION SUMMARY
// ============================================================

function showSummary() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Donations");
  if (!sheet) {
    SpreadsheetApp.getUi().alert("Donations sheet not found. Run Setup first.");
    return;
  }

  var data      = sheet.getDataRange().getValues();
  var total     = 0;
  var verified  = 0;
  var pending   = 0;
  var byPurpose = {};
  var byMonth   = {};

  for (var i = 1; i < data.length; i++) {
    var row     = data[i];
    var amount  = Number(row[7]) || 0;
    var status  = row[14];
    var purpose = row[11] || "General";
    var date    = row[8];

    if (status === "Verified" || status === "Receipt Sent") {
      total += amount;
      verified++;
      byPurpose[purpose] = (byPurpose[purpose] || 0) + amount;
      if (date) {
        var key = Utilities.formatDate(new Date(date), "Asia/Kolkata", "MMM yyyy");
        byMonth[key] = (byMonth[key] || 0) + amount;
      }
    } else if (status === "Pending") {
      pending++;
    }
  }

  var html = "<style>"
    + "body{font-family:Arial,sans-serif;padding:16px;color:#3d3d3d;}"
    + "h2{color:#4A0E7A;margin:0 0 4px;}"
    + "h3{color:#4A0E7A;margin:16px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:.05em;}"
    + ".big{font-size:26px;color:#4A0E7A;font-weight:bold;}"
    + ".stat{display:inline-block;text-align:center;padding:8px 16px;}"
    + ".stat-label{font-size:11px;color:#6B7280;text-transform:uppercase;}"
    + "table{width:100%;border-collapse:collapse;margin:4px 0;}"
    + "td{padding:5px 6px;border-bottom:1px solid #eee;font-size:13px;}"
    + "td:last-child{text-align:right;font-weight:bold;color:#e04d8a;}"
    + "</style>";

  html += "<h2>Donation Summary</h2>";
  html += "<div class='stat'><div class='big'>₹" + formatIndianNumber(total) + "</div><div class='stat-label'>Total Verified</div></div>";
  html += "<div class='stat'><div class='big'>" + verified + "</div><div class='stat-label'>Verified</div></div>";
  html += "<div class='stat'><div class='big'>" + pending  + "</div><div class='stat-label'>Pending</div></div>";

  html += "<h3>By Purpose</h3><table>";
  for (var p in byPurpose) {
    html += "<tr><td>" + p + "</td><td>₹" + formatIndianNumber(byPurpose[p]) + "</td></tr>";
  }
  html += "</table><h3>By Month</h3><table>";
  for (var m in byMonth) {
    html += "<tr><td>" + m + "</td><td>₹" + formatIndianNumber(byMonth[m]) + "</td></tr>";
  }
  html += "</table>";

  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutput(html).setWidth(420).setHeight(520),
    "📊 Donation Summary"
  );
}


// ============================================================
// RECEIPT EMAIL TEMPLATE
// ============================================================

function buildReceiptEmail(donorName, amount, receiptNo) {
  return '<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">'
    + '<div style="text-align:center;padding:20px 0;border-bottom:3px solid #4A0E7A;">'
    + '<h1 style="color:#4A0E7A;margin:0 0 4px;">Dhristi Foundation</h1>'
    + '<p style="color:#6B7280;margin:0;font-size:14px;">Little Hearts Learning Centre</p>'
    + '</div>'
    + '<div style="padding:24px 0;">'
    + '<p>Dear <strong>' + (donorName || 'Donor') + '</strong>,</p>'
    + '<p>Thank you for your generous donation of <strong style="color:#4A0E7A;">₹'
    + formatIndianNumber(amount) + '</strong> to Dhristi Foundation.</p>'
    + '<p>Your 80G donation receipt (<strong>' + receiptNo + '</strong>) is attached. '
    + 'Please keep it for your income tax records.</p>'
    + '<div style="background:#F3EAF8;border-radius:8px;padding:16px;margin:16px 0;">'
    + '<p style="margin:0;font-size:14px;line-height:1.6;">Your contribution directly supports the education, '
    + 'therapy, and care of children with special needs at Little Hearts Learning Centre. '
    + 'We are deeply grateful for your generosity.</p>'
    + '</div>'
    + '<p>With gratitude,<br><strong>Reshmy Nikith</strong><br>Director, Dhristi Foundation<br>'
    + CONFIG.trustPhone + '<br>' + CONFIG.trustEmail + '</p>'
    + '</div>'
    + '<div style="text-align:center;padding:16px;border-top:1px solid #eee;font-size:12px;color:#6B7280;">'
    + CONFIG.trustAddress
    + '</div></body></html>';
}


// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getFinancialYear(date) {
  var d     = new Date(date);
  var year  = d.getFullYear();
  var month = d.getMonth(); // 0-indexed, 0 = January
  if (month < 3) {          // Jan–Mar belongs to previous FY
    return (year - 1) + "-" + String(year).slice(2);
  }
  return year + "-" + String(year + 1).slice(2);
}

function formatIndianNumber(num) {
  num = Number(num) || 0;
  var str  = num.toFixed(0);
  var len  = str.length;
  if (len <= 3) return str;

  var result    = str.slice(len - 3);
  var remaining = str.slice(0, len - 3).split("");

  while (remaining.length > 0) {
    var chunk = remaining.splice(Math.max(remaining.length - 2, 0)).join("");
    result = chunk + "," + result;
  }
  return result;
}

function numberToWords(num) {
  num = Math.floor(Number(num) || 0);
  if (num === 0) return "Zero";

  var ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
    "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen",
    "Seventeen","Eighteen","Nineteen"];
  var tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];

  function convert(n) {
    if (n < 20)       return ones[n];
    if (n < 100)      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000)     return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " and " + convert(n % 100) : "");
    if (n < 100000)   return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
    if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
    return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
  }

  return convert(num) + " Only";
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


// ============================================================
// GOOGLE FORM → SHEET COLUMN MAPPING
// ============================================================
//
// Create a Google Form and link it to the "Donations" sheet tab.
// Map questions to columns in this order:
//
// Form Question                             → Column
// ─────────────────────────────────────────────────────
// (auto) Timestamp                          → A
// Full Name                                 → B
// Email Address                             → C
// Phone Number                              → D
// PAN Number (for 80G receipt)              → E
// Address                                   → F
// Donor Type [Indian / Foreign]             → G
// Donation Amount (₹)                      → H
// Date of Transfer                          → I
// Payment Mode                              → J
//   [UPI / NEFT / IMPS / Wire Transfer / Cash / Cheque]
// Transaction Reference / UTR Number        → K
// Donation Purpose                          → L
//   [General / Sponsor a Student /
//    Sponsor an Event / Corpus Fund /
//    Infrastructure]
// Frequency Intent                          → M
//   [One-time / Monthly / Yearly]
// Do you need an 80G tax receipt? [Yes/No]  → N
//
// Columns O–T are managed by staff in the sheet.
//
// ============================================================
