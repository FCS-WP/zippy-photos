import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { usePhotoIDProvider } from "../../providers/PhotoIDProvider";
import Swal from "sweetalert2";
import AuthDialog from "../auth/AuthDialog";
import { AlertStatus, showAlert } from "../../helpers/showAlert";
import { mmToPx } from "../../helpers/editorHelper";
import { format } from "date-fns";
import { photoIDApi, webApi } from "../../api";

const PhotoIDStep = () => {
  const { cropper, urlData, productData, uploadedPhoto } = usePhotoIDProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const alertConfirmRedirect = async () => {
    const confirmed = Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, back to previous step.",
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      } else {
        return false;
      }
    });
    return confirmed;
  };

  const handleBackStep = async () => {
    const confirmRedirect = await alertConfirmRedirect();
    if (confirmRedirect) {
      window.location.replace(productData.link);
    }
  };

  const handleNextStep = async () => {
    setIsLoading(true);
    if (!cropper) {
          showAlert(AlertStatus.warning, "Failed", "Images not found!");
          return;
        }
        const userID = window.admin_data ? window.admin_data.userID : 0;
        if (!userID || userID == 0) {
          setOpen(true);
          return;
        } else {
          await handleSubmitForm();
        }
  };

  const handleRegister = async (
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  ) => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      const error = "Please fill in all the required information.";
      return { status: false, error: error };
    }

    if (password.length < 6) {
      const error = "Password must > 6 characters";
      return { status: false, error: error };
    }

    if (password !== confirmPassword) {
      const error = "Confirm password not match with password!";
      return { status: false, error: error };
    }

    const registerData = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      confirm_password: confirmPassword,
    };

    const { data: response } = await webApi.registerAccount(registerData);

    if (!response || response?.status !== "success") {
      const error =
        response?.message ??
        "Can not rigister account now. Please try again later!";
      return { status: false, error: error };
    }

    window.admin_data = {
      userID: response.data.id,
      email: response.data.email,
    };

    await handleSubmitForm();
    setOpen(false);
    return { status: true, error: null };
  };

  const handleLogin = async (email, password) => {
    if (!email || !password) {
      const error = "Email and Password are required!";
      return { status: false, error: error };
    }

    const loginData = {
      username: email,
      password,
    };

    const { data: response } = await webApi.login(loginData);
    if (!response || response?.status !== "success") {
      const error = response?.message ?? "Failed to login";
      return { status: false, error: error };
    }
    window.admin_data = {
      userID: response.data.id,
      email: response.data.email,
    };
    await handleSubmitForm();
    setOpen(false);
    return { status: true, error: null };
  };

  const defaultSize = {
      width: productData?.variation_data.width
        ? mmToPx(productData?.variation_data.width)
        : 400,
      height: productData?.variation_data.height
        ? mmToPx(productData?.variation_data.height)
        : 600,
    };

  const getCroppedFile = (cropper) => {
    if (!cropper) return;

    const canvas = cropper.getCanvas({
      width: defaultSize.width * 2,
      height: defaultSize.height * 2,
    });

    if (!canvas) return;

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const fileName = format(new Date(), 'yyyy-MM-dd') + '_' + (new Date()).getTime();
          const file = new File([blob], fileName, { type: "image/png" });
          resolve(file);
        } else {
          resolve(null);
        }
      }, "image/png");
    });
  }

  const handleSubmitForm = async () => {
    setIsLoading(true);
    const file = await getCroppedFile(cropper);
    const userId = window.admin_data.userID ?? 0;
    const formData = new FormData();
    formData.append(`file`, file);
    formData.append(`product[variation]`, parseInt(productData?.variation_data.id));
    formData.append(`product[id]`, parseInt(productData?.id));
    formData.append(`product[qty]`, parseInt(urlData.quantity));
    formData.append(`user_id`, parseInt(userId));

    const { data: response } = await photoIDApi.uploadPhotoID(formData);

    if (!response || response.status !== 'success') {
      showAlert(AlertStatus.error, 'Failed', 'This service not available now! Please try again later or contact with us!');
      setIsLoading(false);
      return;
    }

    const trigger_add_to_cart = await handleAddPhotoIdToCart(response.result.photo_id_url);
    if (!trigger_add_to_cart) {
      showAlert(AlertStatus.error, 'Failed', 'This service not available now! Please try again later or contact with us!');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    window.location.href = "/cart";
    return;
  };

  const handleAddPhotoIdToCart = async (photoUrl) =>{ 
    const paramsAddToCart = {
      action: "custom_add_photo_id",
      product_id : parseInt(productData?.id),
      variation_id: parseInt(productData?.variation_data.id),
      quantity: parseInt(urlData.quantity),
      photo_id_url: photoUrl,
    }

    const { data: addToCartData } = await webApi.addToCartAjax(paramsAddToCart);
    
    if (addToCartData) {
      const event = new CustomEvent("wc_fragment_refresh");
      document.body.dispatchEvent(event);
      return true;
    } else {
      return false;
    }
  }

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Button
          className="btn custom-btn custom-btn-secondary"
          onClick={handleBackStep}
          loading={isLoading}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          className="btn custom-btn custom-btn-primary"
          onClick={handleNextStep}
          disabled={isLoading}
          loading={isLoading}
        >
          Next
        </Button>
      </Box>
      <AuthDialog
        open={open}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default PhotoIDStep;
