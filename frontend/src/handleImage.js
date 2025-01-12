import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// 画像をアップロードする関数
const uploader = async (file, fileName) => {
  if (file) {
    const uniqueFileName = `${Date.now()}_${fileName}`;
    const storageRef = ref(storage, "images/" + uniqueFileName);

    try {
      // 画像をFirebase Storageにアップロード
      const snapshot = await uploadBytes(storageRef, file);
      
      // アップロード後にダウンロードURLを取得
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("ファイルアップロードエラー:", error);
      return null;
    }
  }
};

export { uploader };
