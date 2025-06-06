import axios from "axios";
import { BASE_URL } from './config'; // 'http://172.20.20.20:5000/api'

export const checkImage = (file) => {
  let err = "";
  if (!file) return (err = "File does not exist.");

  if (file.size > 1024 * 1024) err = "The largest image size is 1mb";

  if (file.type !== 'image/jpeg' && file.type !== 'image/png')
    err = "Image format is incorrect.";

  return err;
};

// export const uploadMediaToServer = async (asset) => {
//   const uri = asset.uri;

//   // Skip invalid URIs
//   if (!uri || uri.startsWith('data:') || uri.startsWith('blob:')) {
//     console.warn('Skipped invalid uri:', uri);
//     return null;
//   }

//   const name = uri.split('/').pop();
//   const extension = name.split('.').pop().toLowerCase();

//   const allowed = ['jpg', 'jpeg', 'png'];
//   if (!allowed.includes(extension)) {
//     console.warn('Skipped non-image file:', name);
//     return null;
//   }

//   const type = `image/${extension === 'jpg' ? 'jpeg' : extension}`;

//   const formData = new FormData();
//   formData.append('file', {
//     uri,
//     name,
//     type,
//   });

//   try {
//     // remove `/api` part to hit the base upload server
//     const uploadUrl = `${BASE_URL.replace('/api', '')}/upload`;
//     const res = await axios.post(uploadUrl, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     const filename = res.data?.file?.filename;
//     if (!filename) {
//       console.warn('Upload response missing filename:', res.data);
//       return null;
//     }

//     const fileUrl = `${BASE_URL.replace('/api', '')}/file/${filename}`;
//     console.log('Uploaded to:', fileUrl);

//     return { filename, url: fileUrl };

//   } catch (err) {
//     console.error('Upload failed:', err.response?.data || err.message);
//     return null;
//   }
// };

export const uploadMediaToServer = async (asset) => {
  // For React Native: asset = { uri: 'file://...', name, type }
  // For Web: asset = File object

  const isWebFile = typeof File !== 'undefined' && asset instanceof File;

  const formData = new FormData();
  if (isWebFile) {
    // Web file upload
    formData.append('file', asset);
  } else {
    // Mobile (React Native)
    const uri = asset.uri;
    const name = uri.split('/').pop();
    const extension = name.split('.').pop().toLowerCase();
    const type = `image/${extension === 'jpg' ? 'jpeg' : extension}`;

    formData.append('file', {
      uri,
      name,
      type,
    });
  }

  try {
    const uploadUrl = `${BASE_URL.replace('/api', '')}/upload`;
    const res = await axios.post(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const filename = res.data?.file?.filename;
    if (!filename) {
      console.warn('Upload response missing filename:', res.data);
      return null;
    }

    return {
      filename,
      url: `${BASE_URL.replace('/api', '')}/file/${filename}`,
    };
  } catch (err) {
    console.error('Upload failed:', err.response?.data || err.message);
    return null;
  }
};