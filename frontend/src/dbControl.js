import EditProfile from "./EditProfile";
import { db } from "./firebase";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

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

//グループ参加
const newMember = async (id, userId, type) => {
  const circleRef = doc(db, "circles", id);
  const circleSnap = await getDoc(circleRef);
  const circle = circleSnap.data();
  if (type==="group"){
    try {
      await updateDoc(circleRef, {
        members: arrayUnion(userId),
      });
      alert("グループへの参加が成功しました!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("グループへの参加に失敗しました。もう一度お試しください。");
    }
  }
  else if (type==="対面" && (circle.oneOffInpersonMember.length < circle.oneOffInpersonCapa || !circle.oneOffInpersonCapa)){
    try {
      await updateDoc(circleRef, {
        members: arrayUnion(userId),
        oneOffInpersonMember: arrayUnion(userId)
      });
      alert("グループへの参加が成功しました!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("グループへの参加に失敗しました。もう一度お試しください。");
    }
  }
  else if (type==="オンライン" && (circle.oneOffOnlineMember.length < circle.oneOffOnlineCapa || !circle.oneOffOnlineCapa)){
    try {
      await updateDoc(circleRef, {
        members: arrayUnion(userId),
        oneOffOnlineMember: arrayUnion(userId)
      });
      alert("グループへの参加が成功しました!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("グループへの参加に失敗しました。もう一度お試しください。");
    }
  }
  else {
    alert("グループへの参加が失敗しました。");
  }
};

 // グループから退会する
const removeMember = async (id, userId, navigate) => {
  const circleRef = doc(db, "circles", id);
  try {
    await updateDoc(circleRef, {
      members: arrayRemove(userId),
      host: arrayRemove(userId),
      oneOffInpersonMember: arrayRemove(userId),
      oneOffOnlineMember: arrayRemove(userId)
    });

    // イベントのメンバーを削除
    const circleSnap = await getDoc(circleRef);
    const circle = circleSnap.data();

    // 各イベントに対して処理を行う
    const updatedEvents = circle.events.map(event => {
      let updatedEvent = { ...event };

      // inpersonMember から userId を削除
      updatedEvent.inpersonMember = updatedEvent.inpersonMember.filter(member => member !== userId);

      // onlineMember から userId を削除
      updatedEvent.onlineMember = updatedEvent.onlineMember.filter(member => member !== userId);

      return updatedEvent;
    });

    // 更新されたイベント情報を Firestore に保存
    await updateDoc(circleRef, { events: updatedEvents });

    // ホストがいない場合はグループを削除
    if (circle.host.length === 0) {
      await deleteDoc(circleRef);
      alert("管理者が不在となったため、このグループは削除されます。");
      navigate("/meetsup"); // ホームページや適切なルートにリダイレクト
    } else {
      alert("退会しました。");
      window.location.reload();
    }
  } catch (error) {
    console.error(error);
    alert("グループ退会に失敗しました。もう一度お試しください。");
  }
};



//イベント参加登録
const joinEvent = async (type, id, userId, identify) => {
  const circleRef = doc(db, "circles", id);
  const circleSnap = await getDoc(circleRef);
  const circle = circleSnap.data();

  const index = circle.events.findIndex(event => event.identify === identify);

  if (index === -1) {
    alert("対象のイベントが見つかりません");
    return;
  }

  const eventToUpdate = circle.events[index];

  if (type === "対面") {
    if (!eventToUpdate.inPersonCapacity || eventToUpdate.inPersonCapacity > eventToUpdate.inpersonMember.length) {
      try {
        const updatedEvents = [...circle.events];
        updatedEvents[index] = {
          ...eventToUpdate,
          inpersonMember: [...eventToUpdate.inpersonMember, userId]
        };

        await updateDoc(circleRef, { events: updatedEvents });
        alert("対面の参加登録に成功しました");
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert("参加登録に失敗しました。")
      }
    }
    else{
      alert("人数制限のため参加できませんでした。");
    }
  }
  else if (type === "オンライン"){
    if (!eventToUpdate.onlineCapacity || eventToUpdate.onlineCapacity > eventToUpdate.onlineMember.length) {
      try {
        const updatedEvents = [...circle.events];
        updatedEvents[index] = {
          ...eventToUpdate,
          onlineMember: [...eventToUpdate.onlineMember, userId]
        };

        await updateDoc(circleRef, { events: updatedEvents });
        alert("オンラインの参加登録に成功しました");
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert("参加登録に失敗しました")
      }
    }
    else{
      alert("人数制限のため参加できませんでした。");
    }
  } 
  else {
    alert("無効な操作です")
    return;
  }
} 

//参加キャンセル
const cancelEvent = async (id, userId, identify) => {
  const circleRef = doc(db, "circles", id);
  const circleSnap = await getDoc(circleRef);
  const circle = circleSnap.data();

  const index = circle.events.findIndex(event => event.identify === identify);

  if (index === -1) {
    alert("対象のイベントが見つかりません");
    return;
  }

  const eventToUpdate = circle.events[index];

  if (eventToUpdate.inpersonMember.includes(userId)){
    try {
      const updatedEvents = [...circle.events];
      updatedEvents[index] = {
        ...eventToUpdate,
        inpersonMember: eventToUpdate.inpersonMember.filter(member => member !== userId) 
      };

      await updateDoc(circleRef, { events: updatedEvents });
      alert("イベントをキャンセルしました");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("キャンセルに失敗しました。")
    }
  }
  else if (eventToUpdate.onlineMember.includes(userId)){
    try {
      const updatedEvents = [...circle.events];
      updatedEvents[index] = {
        ...eventToUpdate,
        onlineMember: eventToUpdate.onlineMember.filter(member => member !== userId) 
      };

      await updateDoc(circleRef, { events: updatedEvents });
      alert("イベントをキャンセルしました");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("キャンセルに失敗しました。")
    }
  }
}

const getProfile = async(userId) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()){
    return null;
  }
  else {
    try{
      const userData = userDoc.data();
      return {
        icon: userData.photoURL || null,
        name: userData.displayName || "匿名ユーザー",
        introduction: userData.introduction || null,
        groups: userData.groups
      };
    }
    catch(error){
      return error;
    }
  }
}

//ファイルの削除
const deleteFile = async(fileURL) => {
  const storage = getStorage();

const desertRef = ref(storage,fileURL);

deleteObject(desertRef).then(() => {
  return;
}).catch((error) => {
  console.log(error);
});
}


export { getCircleDataById, updateCircleEvents, newMember, removeMember, joinEvent, cancelEvent, getProfile, deleteFile };
