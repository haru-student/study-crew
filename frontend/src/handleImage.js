import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Resizer from 'react-image-file-resizer';

const resizeImage = (file) => {
  return new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      file,
      1800, // 最大幅
      1200, // 最大高さ
      'JPEG', // 出力フォーマット
      90, // 圧縮品質（0〜100）
      0, // 回転角度
      async (resizedImage) => {
        try {
          const blob = await fetch(resizedImage).then((r) => r.blob());
          resolve(blob); // Blob を返す
        } catch (error) {
          reject(error); // エラーを返す
        }
      },
      'base64' // Base64形式で取得
    );
  });
};


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
      return null;
    }
  }
};

export { uploader, resizeImage };
