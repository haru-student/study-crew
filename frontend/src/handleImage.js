import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL, getStorage, deleteObject } from "firebase/storage";
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

const uploaderIcon = async (file, fileName, id) => {
  if (file) {
    const uniqueFileName = `${Date.now()}_${fileName}`;
    const storageRef = ref(storage, "users/" + `${id}/` + uniqueFileName);

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

//ファイルの削除
const deleteFile = async (fileURL) => {
  try {
    const storage = getStorage();

    // ファイルパスを抽出
    const filePath = fileURL
      .replace(
        "https://firebasestorage.googleapis.com/v0/b/study-crew.firebasestorage.app/o/",
        ""
      )
      .replace(/%2F/g, "/")
      .split("?")[0]; // クエリパラメータを除去

    const desertRef = ref(storage, filePath);

    // ファイル削除
    await deleteObject(desertRef);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

export { uploader, uploaderIcon, resizeImage, deleteFile };
