import axios from "axios";
import { BASE_URL } from './config';

export const checkImage = (file) => {
  let err = "";
  if (!file) return (err = "File does not exist.");
  if (file.size > 1024 * 1024) err = "The largest image size is 1MB";
  if (file.type !== 'image/jpeg' && file.type !== 'image/png')
    err = "Image format is incorrect.";
  return err;
};

export const uploadMediaToServer = async (images, token) => {
  let imgArr = [];

  for (const item of images) {
    const isWebFile = typeof File !== 'undefined' && item instanceof File;
    const formData = new FormData();

    if (isWebFile) {
      formData.append('image', item); // must match backend field
    } else {
      const uri = item.uri;
      const name = item.fileName || uri.split('/').pop();
      const extension = name.split('.').pop().toLowerCase();
      const type = `image/${extension === 'jpg' ? 'jpeg' : extension}`;

      formData.append('image', {
        uri,
        name,
        type,
      });
    }

    try {
      const res = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

      if (typeof res.data === 'string') {
        imgArr.push({ url: res.data });
      } else if (res.data?.url) {
        imgArr.push({ url: res.data.url });
      } else {
        console.warn('Unexpected response:', res.data);
      }

    } catch (error) {
      console.error("S3 upload failed:", error.response?.data || error.message);
    }
  }

  return imgArr;
};