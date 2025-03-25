import axios from "axios";

export const checkImage = (file) => {
    let err = ""
    if(!file) return err = "File does not exist."

    if(file.size > 1024 * 1024) // 1mb
    err = "The largest image size is 1mb"

    if(file.type !== 'image/jpeg' && file.type !== 'image/png')
    err = "Image format is incorrect."

    return err;
}

export const imageUpload = async (images) => {
    let imgArr = [];
    for(const item of images){
        const formData = new FormData()

        formData.append("file", item)

        try {
            const res = await axios.post("http://localhost:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            imgArr.push({
                filename: res.data.file.filename,
                url: `http://localhost:5000/file/${res.data.file.filename}`
            });

        } catch (error) {
            console.error("Image upload failed:", error.response?.data || error.message);
        }
    }
    return imgArr
}