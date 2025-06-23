import axios from "axios";

export const checkImage = (file) => {
  let err = "";
  if (!file) return (err = "File does not exist.");

  if (file.size > 5 * 1024 * 1024)  // 5MB limit for S3
    err = "The largest image size is 5MB";

  if (file.type !== 'image/jpeg' && file.type !== 'image/png')
    err = "Image format is incorrect.";

  return err;
};

export const imageUpload = async (images, token) => {
  let imgArr = [];

  for (const item of images) {
    const formData = new FormData();

    if (item.camera) {
      formData.append("image", item.camera);
    }
    else {
      formData.append("image", item);
    }

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

      imgArr.push({ url: res.data }); // S3 URL directly
    } catch (error) {
      console.error("S3 upload failed:", error.response?.data || error.message);
    }
  }

  return imgArr;
};