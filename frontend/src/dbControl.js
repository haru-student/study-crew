import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

//グループデータの取得
const getCircleDataById = async (id) => {
  const circleRef = doc(db, "circles", id);
  const circleSnapshot = await getDoc(circleRef);
  if (circleSnapshot.exists()) {
    return { id: circleSnapshot.id, ...circleSnapshot.data() };
  } else {
    return null;
  }
};

//イベントの追加、削除、更新
const updateCircleEvents = async (id, updatedEvents) => {
  const circleRef = doc(db, "circles", id);
  await updateDoc(circleRef, { events: updatedEvents });
};

const newMember = async (id, userId) => {
    const circleRef = doc(db, "circles", id);
    await circleRef.UpdateAsync("members", FieldValue.ArrayUnion(userId));
};

export { getCircleDataById, updateCircleEvents, newMember };
