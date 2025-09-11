import { Box, Button, IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useMainProvider } from "../../providers/MainProvider";
import { AlertStatus, showAlert } from "../../helpers/showAlert";
import { webApi } from "../../api";
import AuthDialog from "../auth/AuthDialog";
import { toast } from "react-toastify";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

const Tools = () => {
  const { uploadedImages, setUploadedImages, croppedFiles, minimumOrder } =
    useMainProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUploaded, setCurrentUploaded] = useState(0);
  const [open, setOpen] = useState(false);

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

  const calcPhotoPrice = (items) => {
    return items.reduce((total, item) => {
      const price = item.size?.price || 0;
      return total + parseFloat(price) * item.quantity;
    }, 0);
  };

  const handleAddPhotosToCart = async (savedPhotos) => {
    const mappedData = mappingData(savedPhotos);

    const requestData = {
      action: "custom_add_to_cart",
      items: mappedData,
    };

    const { data: responseAddToCart } = await webApi.addToCartAjax(requestData);

    if (responseAddToCart) {
      const event = new CustomEvent("wc_fragment_refresh");
      document.body.dispatchEvent(event);
      return true;
    } else {
      return false;
    }
  };

  const mappingData = (savedPhotos) => {
    const userID = window.admin_data ? window.admin_data.userID : 0;
    const results = uploadedImages.map((item, index) => {
      const responseItem = savedPhotos.find((item) => item.temp_id === index);
      return {
        ...responseItem,
        quantity: item.quantity,
        paper_type: item.paper,
        user_id: userID,
      };
    });

    return results;
  };

  const getPhotoGalleryID = async () => {
    const user_id = window.admin_data ? window.admin_data.userID : 0;
    const params =  {
      user_id
    };
    const { data: response } = await webApi.getPhotoGallery(params);
    if (!response) {
      return null;
    }
    return response.drive_folder.folder_id;
  }

  const handleSubmitForm = async () => {
    setIsLoading(true);
    // Get Photo Editor ID: 
    const folderId = await getPhotoGalleryID();
    if (!folderId) {
      showAlert(AlertStatus.warning, "Failed", "Something went wrong! try again later.");
      return;
    }

    const handleFiles = await handle_upload_files(folderId);
    setIsLoading(false);
    window.location.href = "/cart";
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

  const get_isolate_imgs = () => {
    let step = 2;

    let result = [];
    let temp_array = [];
    let counter = 0;

    uploadedImages.map((item, index) => {
      temp_array.push(item);
      counter++;
      if (counter == step || index === uploadedImages.length - 1) {
        result.push(temp_array);
        temp_array = [];
        counter = 0;
      }
    });

    return result;
  };

  const handle_upload_files = async (folderId) => {
    setIsLoading(true);
    const isolatedImgs = get_isolate_imgs();

    if (!isolatedImgs || isolatedImgs.length == 0) {
      return false;
    }

    const postFilePromises = isolatedImgs.map((item, index) => {
      const isLastItem = index === isolatedImgs.length - 1;
      return save_to_drives(folderId, item, isLastItem, index + 1);
    });

    try {
      const results = await Promise.all(postFilePromises);
      return true;
    } catch (err) {
      setIsLoading(false);
      return false;
    }
  };

  const save_to_drives = async (
    folderId,
    imgs,
    isLastItem = false,
    requestNo
  ) => {
    let formData = new FormData();
    formData.append("request_no", requestNo);
    formData.append("last_photos", isLastItem);
    formData.append("folder_id", folderId);

    imgs.forEach((item, index) => {
      formData.append(`files[${index}][file]`, getCroppedFile(item.preview));
      formData.append(`files[${index}][photo_id]`, item.id ?? null);
      formData.append(`files[${index}][temp_id]`, index);
      formData.append(`files[${index}][product_id]`, item.size.id);
    });

    const { data: savedPhotos } = await webApi.savePhotos(formData);

    if (savedPhotos.success !== true) {
      console.log("Failed to save photos. Request number: ", requestNo);
    }

    const actionAddToCart = await handleAddPhotosToCart(savedPhotos.results);

    if (actionAddToCart.data) {
      setCurrentUploaded((prev) => prev + imgs.length);
    }
    return true;
  };

  return (
    <Box display={"flex"} justifyContent={"flex-end"} p={2}>
      <Tooltip title="Order now" placement="right">
        <Button
          sx={{
            ":hover": { backgroundColor: "#c51414" },
            backgroundColor: "#222",
            minHeight: "auto !important",
            color: "#fff",
            px: "40px",
          }}
          loading={isLoading}
          className="next-step-btn"
          onClick={handleSaveImages}
        >
          Next Step <ArrowRightAltIcon />{" "}
        </Button>
      </Tooltip>
      <AuthDialog
        open={open}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        onClose={() => setOpen(false)}
      />
    </Box>
  );
};

export default Tools;
