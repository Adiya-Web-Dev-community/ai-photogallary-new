import {ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase";

const uploadImage = async (fileName, file,name) => {
  const uniqueIdentifier = `image_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  try {
      // Create a reference to the storage bucket
      const storageRef = ref(storage, `${fileName}/${uniqueIdentifier} ${name}`);
  
      // Upload the file to the storage bucket
      const snapshot = await uploadBytes(storageRef, file);

      // Get the download URL of the uploaded image
    
      return await getDownloadURL(snapshot.ref);

  } catch (error) {
      console.error("Error uploading image:", error);
      throw error; // Re-throw the error for handling in the caller function
  }
};


export { uploadImage };
