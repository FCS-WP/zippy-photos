export const DPI = 150;

export const inchToPx = (inch) => {
  return inch * DPI;
}

export const dataURLToFile = (dataURL, filename) => {
  const arr = dataURL.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

export const downloadPreviewImage = (dataUrl, filename = "download.jpg") => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};