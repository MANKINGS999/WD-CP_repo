// Hardcoded data
let products = [
  { name: "Product 1", hsn: "1001", price: 500, cgst: 9, sgst: 9 },
  { name: "Product 2", hsn: "1002", price: 800, cgst: 9, sgst: 9 },
  { name: "Product 3", hsn: "1003", price: 1200, cgst: 6, sgst: 6 },
  { name: "Product 4", hsn: "1004", price: 300, cgst: 9, sgst: 9 }
];

$(document).ready(function () {

  loadProducts();

  // DELETE
  $(document).on("click", ".delete-btn", function () {
    $(this).closest("tr").remove();
  });

  // EDIT
  $(document).on("click", ".edit-btn", function () {

    let row = $(this).closest("tr");

    let name = row.find("td:eq(1)").text();
    let price = row.find("td:eq(3)").text();

    let newName = prompt("Edit Product Name:", name);
    let newPrice = prompt("Edit Price:", price);

    if (newName !== null && newPrice !== null) {
      row.find("td:eq(1)").text(newName);
      row.find("td:eq(3)").text(newPrice);
    }

  });

});

// Load products into table
function loadProducts() {
  let rows = "";

  products.forEach((p, index) => {
    rows += `
      <tr>
        <td>${index + 1}</td>
        <td>${p.name}</td>
        <td>${p.hsn}</td>
        <td>${p.price}</td>
        <td>${p.cgst}</td>
        <td>${p.sgst}</td>
        <td>
          <button class="btn btn-warning btn-sm edit-btn">Edit</button>
          <button class="btn btn-danger btn-sm delete-btn">Delete</button>
        </td>
      </tr>
    `;
  });

  $("#productTable").html(rows);
}