import { db } from "./firebase";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { toast } from "react-toastify";

//グループデータの取得
const getCircleDataById = async (id) => {
  try {
    const circleRef = doc(db, "circles", id);
    const circleSnapshot = await getDoc(circleRef);

    if (circleSnapshot.exists()) {
      return { id: circleSnapshot.id, ...circleSnapshot.data() };
    } else {
      return null;
    }
  } catch (error) {
    toast.Error("グループデータの取得に失敗しました");
  }
};

//イベントの追加、削除、更新
const updateCircleEvents = async (id, updatedEvents) => {
  const circleRef = doc(db, "circles", id);
  await updateDoc(circleRef, { events: updatedEvents });
};

const registerEvent = async (id, newEvent) => {
  const circleRef = doc(db, "circles", id);
  try {
    await updateDoc(circleRef, {
      events: arrayUnion(newEvent),
    });
  } catch (error) {
    console.error(error);
    toast.error("イベントの追加に失敗しました。もう一度お試しください。");
  }
};

//グループ参加
const newMember = async (id, userId, type) => {
  const circleRef = doc(db, "circles", id);
  const circleSnap = await getDoc(circleRef);
  const circle = circleSnap.data();
  if (type === "group") {
    try {
      await updateDoc(circleRef, {
        members: arrayUnion(userId),
      });
      console.log("toast!");
      toast.success("グループへの参加が成功しました!");
      addGroupList(id, userId);
    } catch (error) {
      console.error(error);
      toast.warning("グループへの参加に失敗しました。もう一度お試しください。");
    }
  } else if (
    type === "対面" &&
    (circle.oneOffInpersonMember.length < circle.oneOffInpersonCapa ||
      !circle.oneOffInpersonCapa)
  ) {
    try {
      await updateDoc(circleRef, {
        members: arrayUnion(userId),
        oneOffInpersonMember: arrayUnion(userId),
      });
      toast.success("グループへの参加が成功しました!");
      addGroupList(id, userId);
    } catch (error) {
      console.error(error);
      toast.warning("グループへの参加に失敗しました。もう一度お試しください。");
    }
  } else if (
    type === "オンライン" &&
    (circle.oneOffOnlineMember.length < circle.oneOffOnlineCapa ||
      !circle.oneOffOnlineCapa)
  ) {
    try {
      await updateDoc(circleRef, {
        members: arrayUnion(userId),
        oneOffOnlineMember: arrayUnion(userId),
      });
      toast.success("グループへの参加が成功しました!");
      addGroupList(id, userId);
    } catch (error) {
      console.error(error);
      toast.warning("グループへの参加に失敗しました。もう一度お試しください。");
    }
  } else {
    toast.warning("グループへの参加が失敗しました。");
  }
};

// グループから退会する
const removeMember = async (id, userId, navigate) => {
  const circleRef = doc(db, "circles", id);
  try {
    // サークル情報を取得
    const circleSnap = await getDoc(circleRef);
    const circle = circleSnap.data();

    if (!circle) {
      console.warn("Circle not found");
      return;
    }

    // 削除前にメンバー情報を取得して保持
    const currentMembers = [...circle.members];

    // メンバーリストを更新（userIdを削除）
    await updateDoc(circleRef, {
      members: arrayRemove(userId),
      host: arrayRemove(userId),
      oneOffInpersonMember: arrayRemove(userId),
      oneOffOnlineMember: arrayRemove(userId),
    });

    // 各イベントに対して処理を行う
    const updatedEvents = circle.events.map((event) => {
      return {
        ...event,
        inpersonMember: event.inpersonMember.filter(
          (member) => member !== userId
        ),
        onlineMember: event.onlineMember.filter((member) => member !== userId),
      };
    });

    // 更新されたイベント情報を Firestore に保存
    await updateDoc(circleRef, { events: updatedEvents });

    // ホストがいない場合はグループを削除
    if (circle.host.length === 1 && circle.host.includes(userId)) {
      await deleteCircle(id, currentMembers); // 削除前のメンバーリストを渡す
      toast.warning("管理者が不在となったため、このグループは削除されます。");
      navigate("/meetsup"); // ホームページや適切なルートにリダイレクト
    } else {
      toast.success("グループを退会しました");
      removeGroupList(id, userId);
    }
  } catch (error) {
    console.error("Error in removeMember:", error);
    toast.error("グループ退会に失敗しました。もう一度お試しください。");
  }
};

//グループの削除
const deleteCircle = async (id, members) => {
  try {
    const circleRef = doc(db, "circles", id);

    // Firestoreバッチ処理を作成
    const batch = writeBatch(db);

    // メンバーのgroupsリストを更新
    for (const memberId of members) {
      const userRef = doc(db, "users", memberId);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const updatedGroups = (userData.groups || []).filter(
          (groupId) => groupId !== id
        );

        console.log(`Updating groups for user: ${memberId}`, updatedGroups);

        // groupsフィールドを更新または作成
        batch.set(
          userRef,
          { groups: updatedGroups },
          { merge: true } // マージオプションを有効化
        );
      } else {
        console.warn(`User with ID ${memberId} does not exist.`);
      }
    }
    batch.delete(circleRef);

    // バッチ処理をコミット
    await batch.commit();
    console.log(`Batch commit successful for circle ID: ${id}`);
  } catch (error) {
    console.error("Error deleting circle or updating members:", error);
  }
};

//イベント参加登録
const joinEvent = async (type, id, userId, identify) => {
  const circleRef = doc(db, "circles", id);
  const circleSnap = await getDoc(circleRef);
  const circle = circleSnap.data();

  const index = circle.events.findIndex((event) => event.identify === identify);

  if (index === -1) {
    toast.warning("対象のイベントが見つかりません");
    return;
  }

  const eventToUpdate = circle.events[index];

  if (type === "対面") {
    if (
      !eventToUpdate.inPersonCapacity ||
      eventToUpdate.inPersonCapacity > eventToUpdate.inpersonMember.length
    ) {
      try {
        const updatedEvents = [...circle.events];
        updatedEvents[index] = {
          ...eventToUpdate,
          inpersonMember: [...eventToUpdate.inpersonMember, userId],
        };

        await updateDoc(circleRef, { events: updatedEvents });
        toast.success("対面の参加登録に成功しました");
      } catch (error) {
        console.error(error);
        toast.error("参加登録に失敗しました。");
      }
    } else {
      toast.error("人数制限のため参加できませんでした。");
    }
  } else if (type === "オンライン") {
    if (
      !eventToUpdate.onlineCapacity ||
      eventToUpdate.onlineCapacity > eventToUpdate.onlineMember.length
    ) {
      try {
        const updatedEvents = [...circle.events];
        updatedEvents[index] = {
          ...eventToUpdate,
          onlineMember: [...eventToUpdate.onlineMember, userId],
        };

        await updateDoc(circleRef, { events: updatedEvents });
        toast.success("オンラインの参加登録に成功しました");
      } catch (error) {
        console.error(error);
        toast.error("参加登録に失敗しました");
      }
    } else {
      toast.error("人数制限のため参加できませんでした。");
    }
  } else {
    toast.error("無効な操作です");
    return;
  }
};

//参加キャンセル
const cancelEvent = async (id, userId, identify) => {
  const circleRef = doc(db, "circles", id);
  const circleSnap = await getDoc(circleRef);
  const circle = circleSnap.data();

  const index = circle.events.findIndex((event) => event.identify === identify);

  if (index === -1) {
    toast.error("対象のイベントが見つかりませんでした");
    return;
  }

  const eventToUpdate = circle.events[index];

  if (eventToUpdate.inpersonMember.includes(userId)) {
    try {
      const updatedEvents = [...circle.events];
      updatedEvents[index] = {
        ...eventToUpdate,
        inpersonMember: eventToUpdate.inpersonMember.filter(
          (member) => member !== userId
        ),
      };

      await updateDoc(circleRef, { events: updatedEvents });
      removeGroupList(id, userId);
      toast.success("イベントをキャンセルしました");
    } catch (error) {
      console.error(error);
      toast.error("キャンセルに失敗しました。");
    }
  } else if (eventToUpdate.onlineMember.includes(userId)) {
    try {
      const updatedEvents = [...circle.events];
      updatedEvents[index] = {
        ...eventToUpdate,
        onlineMember: eventToUpdate.onlineMember.filter(
          (member) => member !== userId
        ),
      };

      await updateDoc(circleRef, { events: updatedEvents });
      removeGroupList(id, userId);
      toast.success("イベントをキャンセルしました");
    } catch (error) {
      console.error(error);
      toast.error("キャンセルに失敗しました。");
    }
  }
};

const getProfile = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return null;
  } else {
    try {
      const userData = userDoc.data();
      return {
        icon: userData.icon,
        name: userData.name,
        introduction: userData.introduction,
        groups: userData.groups,
      };
    } catch (error) {
      return error;
    }
  }
};

//ファイルの削除
const deleteFile = async (fileURL) => {
  const storage = getStorage();

  const desertRef = ref(storage, fileURL);

  deleteObject(desertRef)
    .then(() => {
      return;
    })
    .catch((error) => {
      toast.error("エラーが発生しました");
    });
};

const createAccount = async (uid, name, icon, introduction) => {
  try {
    // ユーザードキュメントへの参照を作成
    const userDocRef = doc(db, "users", uid);

    // データを保存
    await setDoc(userDocRef, {
      name: name || "ゲストユーザー",
      icon: icon || "",
      introduction: introduction || "",
      groups: [],
    });
  } catch (error) {
    toast.error("エラーが発生しました");
    throw new Error("ユーザー情報の保存に失敗しました");
  }
};

const updateUserInfo = async (userId, icon, name, introduction) => {
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    icon: icon,
    name: name,
    introduction: introduction,
  });
};

const checkIfNewUser = async (uid) => {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);
  return !userDoc.exists(); // ドキュメントが存在しなければ新規ユーザー
};

const addGroupList = async (id, userId) => {
  const userRef = doc(db, "users", userId);
  try {
    await updateDoc(userRef, {
      groups: arrayUnion(id),
    });
  } catch {
    toast.error("エラーが発生しました");
  }
};
const removeGroupList = async (id, userId) => {
  const userRef = doc(db, "users", userId);
  try {
    await updateDoc(userRef, {
      groups: arrayRemove(id),
    });
  } catch {
    toast.error("エラーが発生しました");
  }
};

export {
  getCircleDataById,
  updateCircleEvents,
  newMember,
  removeMember,
  joinEvent,
  cancelEvent,
  getProfile,
  deleteFile,
  createAccount,
  updateUserInfo,
  checkIfNewUser,
  addGroupList,
  registerEvent,
};
