import { toast } from "react-toastify";
import Swal from "sweetalert2";

$(function () {
  $(".button.custom-upload-btn").on("click", function (e) {
    e.preventDefault();
    const wrapper = $(this).closest(".upload-pdf-wrapper");
    wrapper.find(".custom-upload-input").trigger("click");
  });

  $(".custom-upload-input").on("change", function () {
    const file = this.files[0];
    const folderId = $(this).closest(".upload-pdf-wrapper").data("folder-id");
    const itemId = $(this).closest(".upload-pdf-wrapper").data("item-id");
    if (!file || !folderId) return alert("Missing PDF file or folder ID.");
    const popupTitle = `Confirm upload template: ${file.name}`;

    const confirmUploadPdf = Swal.fire({
      title: popupTitle,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, upload it!",
    }).then((result) => {
      if (result.isConfirmed) {
        uploadPhotobookTemplate(file, folderId, itemId);
        return true;
      } else {
        console.log("Cancel upload");
        return false;
      }
    });
  });

  function uploadPhotobookTemplate(file, folderId, itemId) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder_id", folderId);
    formData.append("item_id", itemId);

    const uploadUrl =
      window.location.origin + "/wp-json/zippy-addons/v1/photobook-template";

    $.ajax({
      url: uploadUrl,
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      headers: {
        Authorization:
          "Bearer FEhI30q7ySHtMfzvSDo6RkxZUDVaQ1BBU3lBcGhYS3BrQStIUT09",
      },
      success: function (response) {
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
});
