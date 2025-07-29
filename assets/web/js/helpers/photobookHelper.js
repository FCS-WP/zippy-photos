import Swal from "sweetalert2";
import { alertConfirm, inputAjaxAlert } from "./showAlert";

export const setDisabledAddToCart = (value) => {
  const buttonATC = document.querySelector(".single_add_to_cart_button");
  if (!buttonATC) {
    return;
  }
  if (value) {
    buttonATC.setAttribute("disabled", true);
    buttonATC.classList.add("error-photos");
  } else {
    buttonATC.removeAttribute("disabled");
    buttonATC.classList.remove("error-photos");
  }
};

$(function () {
  $("form.cart").off("submit");
  // Handle on preview photobook page:
  $(".preview-btns .accept-btn").on("click", function (e) {
    e.preventDefault();
    const item_id = $(this).closest(".preview-btns").data("item_id");
    const confirmed = Swal.fire({
      title: "Are You Sure?",
      text: "Confirm that you intend to use this template.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        handleAcceptTemplate(item_id);
      } else {
        return false;
      }
    });
  });

  function handleAcceptTemplate(item_id) {
    const data = {
      item_id: item_id,
    };
    const updateItemUrl =
      window.location.origin + "/wp-json/zippy-addons/v1/photobook-accept";
    $.ajax({
      url: updateItemUrl,
      type: "POST",
      data: data,
      headers: {
        Authorization:
          "Bearer FEhI30q7ySHtMfzvSDo6RkxZUDVaQ1BBU3lBcGhYS3BrQStIUT09",
      },
      success: function (response) {
        console.log("response", response);
        if (response.status === "success") {
          Swal.fire({
            title: "SUCCESS",
            text: response.message,
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
          }).then(() => {
            window.location.reload();
          });
        }
      },
      error: function (xhr, status, error) {
        console.error("Upload error:", error);
        Swal.fire({
          title: "FAILED",
          text: error,
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
      },
    });
  }

  // Handle Send Whatsapp Request
  $(".preview-btns .update-btn").on("click", function (e) {
    e.preventDefault();
    const wrapper =  $(this).closest(".preview-btns");
    const item_id = wrapper.data("item_id");
    const template_src = wrapper.data("template_src");
    const order_id = wrapper.data("order_id");
    inputAjaxAlert(item_id, template_src, order_id);
  });
  
});
