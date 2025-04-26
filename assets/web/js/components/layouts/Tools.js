import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { useMainProvider } from "../../providers/MainProvider";
import { AlertStatus, showAlert } from "../../helpers/showAlert";
import { webApi } from "../../api";
import AuthDialog from "../auth/AuthDialog";

const Tools = () => {
  const { uploadedImages, setUploadedImages, croppedFiles } = useMainProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [authError, setAuthError] = useState(null);

  const updateIdForImage = (newArr = []) => {
    if (newArr.length <= 0) {
      return;
    }
    const updatedData = uploadedImages.map((image, index) => {
      const getNewId = newArr.find((item) => item.temp_id === index);
      if (!getNewId) {
        return image;
      }
      const newData = {
        ...image,
        id: getNewId.photo_id,
        detail_id: getNewId.detail_id,
      };
      return newData;
    });

    setUploadedImages(updatedData);
  };

  const getCroppedFile = (previewUrl) => {
    const croppedItem = croppedFiles.find(
      (item) => item.preview === previewUrl
    );
    return croppedItem ? croppedItem.file : null;
  };

  const handleRegister = async (
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  ) => {
    setAuthError(null);
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setAuthError("Missing Information");
      return false;
    }

    if (password.length < 6) {
      setAuthError("Password must > 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setAuthError("Confirm password not match with password!");
      return false;
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
      setAuthError(
        response?.message ??
          "Can not rigister account now. Please try again later!"
      );
      return false;
    }
    window.admin_data = {
      userID: response.data.id,
      email: response.data.email,
    };
    await handleSubmitForm();
    setAuthError(null);
    setOpen(false);
    return true;
  };

  const handleLogin = async (email, password) => {
    setAuthError(null);
    if (!email || !password) {
      setAuthError("Missing Information");
      return false;
    }

    const loginData = {
      username: email,
      password,
    };

    const { data: response } = await webApi.login(loginData);
    if (!response || response?.status !== "success") {
      setAuthError(response?.message ?? "Failed to login");
      return false;
    }
    window.admin_data = {
      userID: response.data.id,
      email: response.data.email,
    };
    await handleSubmitForm();
    setAuthError(null);
    setOpen(false);
    return true;
  };

  const handleSubmitForm = async () => {
    setIsLoading(true);
    const formData = new FormData();
    const userID = window.admin_data ? window.admin_data.userID : 0;

    uploadedImages.forEach((item, index) => {
      formData.append(`files[${index}][file]`, getCroppedFile(item.preview));
      formData.append(`files[${index}][user_id]`, userID);
      formData.append(`files[${index}][photo_id]`, item.id ?? null);
      formData.append(`files[${index}][detail_id]`, item.detail_id ?? null);
      formData.append(`files[${index}][quantity]`, item.quantity);
      formData.append(`files[${index}][paper]`, item.paper);
      formData.append(`files[${index}][temp_id]`, index);
      formData.append(`files[${index}][product_id]`, item.size.id);
    });

    const { data: response } = await webApi.savePhotos(formData);
    updateIdForImage(response.data);

    if (!response || response.status !== "success") {
      showAlert(AlertStatus.warning, "Failed", "Failed to save images");
      setIsLoading(false);
      return;
    }

    showAlert(
      AlertStatus.success,
      "Successfully",
      "Your images have been saved!"
    );

    if (response.payment_url) {
      window.location.href = response.payment_url;
    }

    setIsLoading(false);
    return;
  };

  const handleSaveImages = async () => {
    if (uploadedImages.length <= 0) {
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

  return (
    <Box display={"flex"} justifyContent={"flex-end"} p={2}>
      <Button
        loading={isLoading}
        variant="contained"
        sx={{ color: "#fff" }}
        onClick={handleSaveImages}
      >
        Order now
      </Button>
      <AuthDialog
        open={open}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        onClose={() => setOpen(false)}
        authError={authError}
      />
    </Box>
  );
};

export default Tools;
