function calculateTotal(){

  let subtotal = 0;

  $("#invoiceTable tbody tr").each(function(){

    let qty =
      parseFloat($(this).find(".qty").val()) || 0;

    let price =
      parseFloat($(this).find(".price").val()) || 0;

    let total = qty * price;

    $(this)
      .find(".row-total")
      .text("₹" + total.toFixed(2));

    subtotal += total;

  });

  let cgst = subtotal * 0.09;

  let sgst = subtotal * 0.09;

  let grandTotal = subtotal + cgst + sgst;

  $("#subtotal")
    .text("₹" + subtotal.toFixed(2));

  $("#cgst")
    .text("₹" + cgst.toFixed(2));

  $("#sgst")
    .text("₹" + sgst.toFixed(2));

  $("#grandTotal")
    .text("₹" + grandTotal.toFixed(2));

}

/* ADD PRODUCT ROW */

$("#addRow").click(function(){

  let row = `

    <tr>

      <td>

        <input
          type="text"
          class="form-control product"
          placeholder="Product name"
        >

      </td>

      <td>

        <input
          type="number"
          class="form-control qty"
          value="1"
        >

      </td>

      <td>

        <input
          type="number"
          class="form-control price"
          value="0"
        >

      </td>

      <td class="row-total">
        ₹0
      </td>

      <td>

        <button
          class="btn btn-danger removeRow"
        >
          Remove
        </button>

      </td>

    </tr>

  `;

  $("#invoiceTable tbody").append(row);

});

/* REMOVE PRODUCT ROW */

$(document).on(
  "click",
  ".removeRow",
  function(){

    $(this)
      .closest("tr")
      .remove();

    calculateTotal();

  }
);

/* CALCULATE ON INPUT */

$(document).on(
  "input",
  ".qty, .price",
  function(){

    calculateTotal();

  }
);

calculateTotal();