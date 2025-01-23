function updatePreviewImage(input) {
  const preview = document.getElementById("updatePreviewImage");
  const file = input.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };

    reader.readAsDataURL(file);
  } else {
    preview.src = "";
    preview.style.display = "none";
  }
}
function addItem() {
  const productBody = document.getElementById("productBody");
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
        <td><input type="text" placeholder="Product Name"></td>
        <td><input type="text" placeholder="Code"></td>
        <td><input type="number" placeholder="Price" oninput="calculateTotal()"></td>
        <td><input type="number" placeholder="Quantity" oninput="calculateTotal()"></td>
        <td><span class="removeItem" onclick="removeItem(this)">&#10006;</span></td>
    `;

  productBody.appendChild(newRow);
  calculateTotal(); // Recalculate total after adding a new row
}

// Function to remove a product row when clicking the cross sign
function removeItem(span) {
  const row = span.parentNode.parentNode; // Get the row containing the cross sign
  row.remove(); // Remove the row from the table
  calculateTotal(); // Recalculate total after removing a row
}

// Function to calculate totals, including tax and discount
function calculateTotal() {
  const productBody = document
    .getElementById("productBody")
    .getElementsByTagName("tr");
  let subtotal = 0;

  // Calculate subtotal by summing up each row's total
  for (let row of productBody) {
    const price =
      parseFloat(row.cells[2].getElementsByTagName("input")[0].value) || 0;
    const quantity =
      parseFloat(row.cells[3].getElementsByTagName("input")[0].value) || 0;
    const total = price * quantity;

    subtotal += total;
  }

  // Get tax and discount values
  const tax = parseFloat(document.getElementById("tax").value) || 0;
  const discount = parseFloat(document.getElementById("discount").value) || 0;

  // Calculate tax and discount amounts
  const taxAmount = (subtotal * tax) / 100;
  const discountAmount = (subtotal * discount) / 100;

  // Calculate final total
  const total = subtotal + taxAmount - discountAmount;

  // Update the total field
  document.getElementById("total").innerText = total.toFixed(2);
}

// Add event listeners to static first row inputs for dynamic calculations
function setupFirstRowListeners() {
  const firstRow = document
    .getElementById("productBody")
    .getElementsByTagName("tr")[0];
  const priceInput = firstRow.cells[2].getElementsByTagName("input")[0];
  const quantityInput = firstRow.cells[3].getElementsByTagName("input")[0];

  priceInput.addEventListener("input", calculateTotal);
  quantityInput.addEventListener("input", calculateTotal);
}

// Initialize event listeners for the first row
setupFirstRowListeners();

// Event listeners for tax and discount inputs
document.getElementById("tax").addEventListener("input", calculateTotal);
document.getElementById("discount").addEventListener("input", calculateTotal);

// Function to update the preview section dynamically
function updatePreview() {
  document.getElementById("previewInvoiceNumber").innerText =
    document.getElementById("invoiceNumber").value || "N/A";
  document.getElementById("previewInvoiceDate").innerText =
    document.getElementById("invoiceDate").value || "N/A";
  document.getElementById("previewDueDate").innerText =
    document.getElementById("dueDate").value || "N/A";
  document.getElementById("previewCompanyName").innerText =
    document.getElementById("companyName").value || "N/A";
  document.getElementById("previewCompanyAddress").innerText =
    document.getElementById("companyAddress").value || "N/A";
  document.getElementById("previewCompanyPhone").innerText =
    document.getElementById("companyPhone").value || "N/A";
  document.getElementById("previewCompanyEmail").innerText =
    document.getElementById("companyEmail").value || "N/A";
  document.getElementById("previewCustomerEmail").innerText =
    document.getElementById("customerEmail").value || "N/A";

  // Update product table in the preview
  const previewProductBody = document.getElementById("previewProductBody");
  previewProductBody.innerHTML = ""; // Clear existing rows

  const productBody = document
    .getElementById("productBody")
    .getElementsByTagName("tr");
  for (let row of productBody) {
    const name = row.cells[0].getElementsByTagName("input")[0].value || "N/A";
    const code = row.cells[1].getElementsByTagName("input")[0].value || "N/A";
    const price =
      parseFloat(row.cells[2].getElementsByTagName("input")[0].value) || 0;
    const quantity =
      parseFloat(row.cells[3].getElementsByTagName("input")[0].value) || 0;
    const total = (price * quantity).toFixed(2);

    const newRow = `
            <tr>
                <td>${name}</td>
                <td>${code}</td>
                <td>${price.toFixed(2)}</td>
                <td>${quantity}</td>
                <td>${total}</td>
            </tr>
        `;
    previewProductBody.innerHTML += newRow; // Append new row
  }

  // Update total amount
  const totalAmount = document.getElementById("total").innerText;
  document.getElementById("previewTotalAmount").innerText = totalAmount;

  // Update bank details and notes
  document.getElementById("previewBankDetails").innerText =
    document.getElementById("bankDetails").value || "N/A";
  document.getElementById("previewNotes").innerText =
    document.getElementById("notes").value || "N/A";
}

// Add event listeners to update the preview in real-time
document
  .getElementById("invoiceNumber")
  .addEventListener("input", updatePreview);
document.getElementById("invoiceDate").addEventListener("input", updatePreview);
document.getElementById("dueDate").addEventListener("input", updatePreview);
document.getElementById("companyName").addEventListener("input", updatePreview);
document
  .getElementById("companyAddress")
  .addEventListener("input", updatePreview);
document
  .getElementById("companyPhone")
  .addEventListener("input", updatePreview);
document
  .getElementById("companyEmail")
  .addEventListener("input", updatePreview);
document
  .getElementById("customerEmail")
  .addEventListener("input", updatePreview);
document.getElementById("bankDetails").addEventListener("input", updatePreview);
document.getElementById("notes").addEventListener("input", updatePreview);
document.getElementById("tax").addEventListener("input", () => {
  calculateTotal();
  updatePreview();
});
document.getElementById("discount").addEventListener("input", () => {
  calculateTotal();
  updatePreview();
});

// Update product table and total when items are added/removed or price/quantity changes
document.getElementById("productBody").addEventListener("input", () => {
  calculateTotal();
  updatePreview();
});

// Also call updatePreview after adding or removing rows in the product table
function printPreview() {
  const invoiceContent = document.getElementById(
    "invoicePreviewContent"
  ).innerHTML;
  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write(`<html>
        <head>
            <title>Print Invoice</title>
            <style>
                            body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                table, th, td {
                    border: 1px solid black;
                }
                th, td {
                    padding: 10px;
                    text-align: left;
                }
                    
            </style>
            </head>
        <body>
            ${invoiceContent}
        </body>
        </html>
        `);
  printWindow.document.close();

  // Focus on the window to ensure it gets attention
  printWindow.focus();

  // Trigger the print dialog
  printWindow.print();

  // Close the print window after printing
  printWindow.close();
}
