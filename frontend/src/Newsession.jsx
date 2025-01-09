import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { RingLoader } from "react-spinners";

function Newsession({ user }) {
  const navigate = useNavigate();
  if (!user) {
    navigate("/");
    return;
  }
  const [location, setLocation] = useState("開催場所未定"); //通常の開催場所。
  const [URL, setURL] = useState(""); //オンラインurl
  const [pass, setPass] = useState(""); //オンラインパスワード
  const [date, setDate] = useState(""); //オンラインurl公開日
  const [fee, setFee] = useState(""); //通常の参加料金
  const [detail, setDetail] = useState(""); //概要
  const [file, setFile] = useState(null); //画像ファイル
  const [fileURL, setFileURL] = useState(""); //ファイルurl
  const [members, setMembers] = useState([user.uid]); //グループメンバー

  const [event, setEvent] = useState(""); //イベント名
  const [eventType, setEventType] = useState(""); //開催形式
  const [freq, setFreq] = useState(null); //開催回数
  const [freqInput, setFreqInput] = useState(""); //開催頻度
  const [oneDate, setOneDate] = useState(""); //単発開催日
  const [oneStart, setOneStart] = useState(""); //単発開始時間
  const [oneEnd, setOneEnd] = useState(""); //単発終了時間
  const [eventDates, setEventDates] = useState([]); //複数回の時の開催日リスト
  const [eventDate, setEventDate] = useState(""); // 開催日
  const [startTime, setStartTime] = useState(""); // 開始時刻
  const [endTime, setEndTime] = useState(""); // 終了時刻
  const [eventlocation, setEventlocation] = useState("開催場所未定"); //各開催日の開催場所。
  const [type, setType] = useState("");
  const [inPersonCapacity, setInPersonCapacity] = useState(null); // 対面の参加定員
  const [onlineCapacity, setOnlineCapacity] = useState(null); // オンラインの参加定員
  const [onlineMember, setOnline] = useState([]);
  const [inpersonMember, setInperson] = useState([]);
  const [notes, setNotes] = useState(""); //特記事項

  const [loading, setLoading] = useState(false);

  const handleAddEvent = () => {
    const eventDateOnly = new Date(eventDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // 開催日が現在日付より前の場合は追加できない
    if (eventDateOnly < currentDate) {
      alert("現在日付より前の開催日は設定できません");
      return;
    }
    if (!eventlocation && (type === "対面" || type === "対面+オンライン")) {
      alert("開催場所を入力して下さい");
      return;
    }

    if (eventDate) {
      setEventDate(eventDate.replace(/-/g, '/'));
      const newEvent = {
        date: eventDate,
        type: type,
        startTime: startTime,
        endTime: endTime,
        notes: notes,
        onlineMember: onlineMember,
        inpersonMember: inpersonMember,
        eventlocation: eventlocation,
        inPersonCapacity:
          eventType === "対面" || eventType === "対面+オンライン"
            ? inPersonCapacity
            : null,
        onlineCapacity:
          eventType === "オンライン" || eventType === "対面+オンライン"
            ? onlineCapacity
            : null,
        url:
          eventType === "オンライン" || eventType === "対面+オンライン"
            ? URL
            : "",
        password:
          eventType === "オンライン" || eventType === "対面+オンライン"
            ? pass
            : "",
        publishDate:
          eventType === "オンライン" || eventType === "対面+オンライン"
            ? date
            : "",
      };
      setEventDates([...eventDates, newEvent]);
      setEventlocation(location);
      setEventDate("");
      setStartTime("");
      setEndTime("");
      setInPersonCapacity(null);
      setOnlineCapacity(null);
      setURL("");
      setPass("");
      setDate("");
      setNotes("");
    } else {
      alert("開催日時を入力してください");
    }
  };

  const handleDeleteEvent = (index) => {
    const updatedEventDates = eventDates.filter((_, i) => i !== index);
    setEventDates(updatedEventDates);
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          const targetAspectRatio = 4 / 3;
          const targetWidth = img.width; // 任意の幅 (必要に応じて調整)
          const targetHeight = targetWidth / targetAspectRatio;
  
          const canvas = document.createElement("canvas");
          canvas.width = targetWidth;
          canvas.height = targetHeight;
  
          const ctx = canvas.getContext("2d");
  
          const sourceAspectRatio = img.width / img.height;
          let sx, sy, sWidth, sHeight;
  
          if (sourceAspectRatio > targetAspectRatio) {
            // 横長画像の場合、幅を縮小
            sHeight = img.height;
            sWidth = img.height * targetAspectRatio;
            sx = (img.width - sWidth) / 2; // 横中央にトリミング
            sy = 0;
          } else {
            // 縦長画像の場合、高さを縮小
            sWidth = img.width;
            sHeight = img.width / targetAspectRatio;
            sx = 0;
            sy = (img.height - sHeight) / 2; // 縦中央にトリミング
          }
  
          // Canvasにリサイズ&トリミングして描画
          ctx.drawImage(
            img,
            sx,
            sy,
            sWidth,
            sHeight,
            0,
            0,
            targetWidth,
            targetHeight
          );
  
          // 結果画像をJPEG形式でデータURLとして取得
          const resizedImage = canvas.toDataURL("image/jpeg");
  
          // 画像をアップロード
          const file = dataURLtoFile(resizedImage, selectedFile.name);  // データURLをFileオブジェクトに変換
          const fileURL = await uploader(file); // 画像をアップロード
  
          // アップロードした画像のURLを表示
          if (fileURL) {
            const outputImg = document.getElementById("output-img");
            outputImg.src = fileURL;
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  // データURLをFileオブジェクトに変換する関数
  function dataURLtoFile(dataURL, fileName) {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }
  
  const uploader = async (file) => {
    if (file) {
      const uniqueFileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, "images/" + uniqueFileName);
  
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setFileURL(downloadURL);
        return downloadURL;
      } catch (error) {
        console.error("ファイルアップロードエラー:", error);
        return null;
      }
    }
  };
  

  const createCircle = async (e) => {
    setLoading(true);
    e.preventDefault();

    let uploadedURL = null;
    if (file) {
      uploadedURL = await uploader(file);
      if (!uploadedURL) {
        alert("ファイルのアップロードに失敗しました");
        setLoading(false);
        return;
      }
    }

    let oneOffValue = "";
    if (freq === "単発") {
      const DateTime = new Date(`${oneDate}T${oneStart}`);
      const current = new Date();
      if (
        oneDate &&
        oneStart &&
        oneEnd &&
        DateTime >= current &&
        oneStart <= oneEnd
      ) {
        oneOffValue = `${oneDate}  ${oneStart}～${oneEnd}`;
        oneOffValue = oneOffValue.replace(/-/g, '/');
      } else {
        setLoading(false);
        alert("イベントの開催日時が正しく入力されていません");
        return;
      }

      setOneDate("");
      setOneStart("");
      setOneEnd("");
    }

    // Firestoreに保存
    try {
      await addDoc(collection(db, "circles"), {
        fileURL: uploadedURL || fileURL,
        name: event,
        freq: freq,
        freqInput: freqInput,
        oneOff: oneOffValue,
        type: eventType,
        location: location ? location : "開催地未定",
        fee: fee,
        detail: detail,
        events: eventDates,
        members: members,
        host: user.uid,
      });

      // フォームのリセット
      setEvent("");
      setFreq(null);
      setFreqInput("");
      setEventType("");
      setLocation("未定");
      setURL("");
      setPass("");
      setDate("");
      setFee("");
      setDetail("");
      setFileURL("");
      setFile(null);
      setEventDates([]);
      setMembers([]);

      // 画面遷移
      setLoading(false);
      navigate("/meetsup");
    } catch (error) {
      console.error("サークル作成エラー:", error);
      setLoading(false);
      alert("サークル作成に失敗しました");
    }
  };

  useEffect(() => {
    setType(eventType);
  }, [eventType]);

  useEffect(() => {
    setEventlocation(location);
  }, [location]);

  return (
    <div>
      {loading ? (
        <div className="d-flex justify-content-center mt-4">
          <RingLoader size={48} color="blue" />
        </div>
      ) : (
        <Container className="border m-5 p-5 fluid">
          <h1 className="text-center">新しいグループの作成</h1>
          <Form onSubmit={createCircle}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>ヘッダー画像 ※4:3にトリミングされます。</Form.Label>
              <Form.Control
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={handleFileChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="event">
              <Form.Label>イベント名</Form.Label>
              <Form.Control
                type="text"
                placeholder="イベント名を入力して下さい"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>開催回数</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  label="単発"
                  name="freq"
                  value="単発"
                  checked={freq === "単発"}
                  onChange={(e) => {
                    setFreq(e.target.value);
                    setFreqInput(""); // 開催頻度の入力をクリア
                  }}
                  required
                />
                <Form.Check
                  type="radio"
                  label="複数回"
                  name="freq"
                  value="複数回"
                  checked={freq === "複数回"}
                  onChange={(e) => setFreq(e.target.value)}
                />
              </div>
            </Form.Group>
            {freq === "単発" && (
              <div>
                <Form.Group className="mb-3">
                  <Form.Label>開催日</Form.Label>
                  <Form.Control
                    type="date"
                    value={oneDate}
                    onChange={(e) => setOneDate(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>開始時刻</Form.Label>
                  <Form.Control
                    type="time"
                    value={oneStart}
                    onChange={(e) => setOneStart(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>終了時刻</Form.Label>
                  <Form.Control
                    type="time"
                    value={oneEnd}
                    onChange={(e) => setOneEnd(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
            )}
            {freq === "複数回" && (
              <Form.Group className="mb-3" controlId="freqInput">
                <Form.Label>開催頻度</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="例）毎週日曜日、不定期"
                  onChange={(e) => setFreqInput(e.target.value)}
                  required
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>開催形式</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  label="対面"
                  name="eventType"
                  value="対面"
                  checked={eventType === "対面"}
                  onChange={(e) => setEventType(e.target.value)}
                  required
                />
                <Form.Check
                  type="radio"
                  label="オンライン"
                  name="eventType"
                  value="オンライン"
                  checked={eventType === "オンライン"}
                  onChange={(e) => setEventType(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  label="対面+オンライン"
                  name="eventType"
                  value="対面+オンライン"
                  checked={eventType === "対面+オンライン"}
                  onChange={(e) => setEventType(e.target.value)}
                />
              </div>
            </Form.Group>

            {(eventType === "対面" || eventType === "対面+オンライン") && (
              <Form.Group className="mb-3" controlId="location">
                <Form.Label>開催場所</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="例）大阪府大阪市北区○○ビル〇階"
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3 mt-3">
              <Form.Label>参加費</Form.Label>
              <Form.Control
                type="text"
                placeholder="例）毎月300円"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>概要</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="グループの紹介"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              />
            </Form.Group>

            {freq === "複数回" && (
              <div className="bg-info-subtle rounded p-5">
                <h2>新しいイベント</h2>
                <Form.Group className="mb-3">
                  <Form.Label>開催日</Form.Label>
                  <Form.Control
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>開始時刻</Form.Label>
                  <Form.Control
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>終了時刻</Form.Label>
                  <Form.Control
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>開催形式</Form.Label>
                  <div>
                    <Form.Check
                      type="radio"
                      label="対面"
                      name="Type"
                      value="対面"
                      checked={type === "対面"}
                      onChange={(e) => setType(e.target.value)}
                      required
                    />
                    <Form.Check
                      type="radio"
                      label="オンライン"
                      name="Type"
                      value="オンライン"
                      checked={type === "オンライン"}
                      onChange={(e) => setType(e.target.value)}
                    />
                    <Form.Check
                      type="radio"
                      label="対面+オンライン"
                      name="Type"
                      value="対面+オンライン"
                      checked={type === "対面+オンライン"}
                      onChange={(e) => setType(e.target.value)}
                    />
                  </div>
                </Form.Group>
                {(type === "対面" || type === "対面+オンライン") && (
                  <Form.Group className="mb-3">
                    <Form.Label>対面参加定員</Form.Label>
                    <Form.Control
                      type="number"
                      value={inPersonCapacity}
                      onChange={(e) => setInPersonCapacity(e.target.value)}
                    />
                  </Form.Group>
                )}

                {(type === "オンライン" || type === "対面+オンライン") && (
                  <Form.Group className="mb-3">
                    <Form.Label>オンライン参加定員</Form.Label>
                    <Form.Control
                      type="number"
                      value={onlineCapacity}
                      onChange={(e) => setOnlineCapacity(e.target.value)}
                    />
                  </Form.Group>
                )}
                {(type === "対面" || type === "対面+オンライン") && (
                  <Form.Group className="mb-3" controlId="location">
                    <Form.Label>開催場所</Form.Label>
                    <Form.Control
                      type="text"
                      value={eventlocation}
                      onChange={(e) => setEventlocation(e.target.value)}
                    />
                  </Form.Group>
                )}
                {(type === "オンライン" || type === "対面+オンライン") && (
                  <div>
                    <Form.Group className="mb-3" controlId="online">
                      <Form.Label>オンラインURL</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="URLを入力して下さい"
                        value={URL}
                        onChange={(e) => setURL(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="pass">
                      <Form.Label>オンラインURLのパスワード</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="パスワードを入力して下さい"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="date">
                      <Form.Label>オンラインURL、パスワード公開日時</Form.Label>
                      <Form.Control
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value.replace(/-/g, '/'))}
                      />
                    </Form.Group>
                  </div>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>特記事項</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="特記事項"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="button"
                  onClick={handleAddEvent}
                >
                  イベントを追加
                </Button>
              </div>
            )}

            {eventDates.length > 0 && (
              <div className="mt-4">
                <h5>追加されたイベント日時:</h5>
                <ul>
                  {eventDates.map((event, index) => (
                    <li key={index}>
                      {event.date}{" "}
                      {event.startTime
                        ? `${event.startTime} 〜 ${event.endTime || ""}`
                        : event.endTime
                        ? `開始時刻未定 〜 ${event.endTime}`
                        : ""}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteEvent(index)}
                        className="ml-2"
                      >
                        削除
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              variant="primary mt-3r"
              type="submit"
              className="d-block mx-auto"
            >
              登録する
            </Button>
          </Form>
        </Container>
      )}
    </div>
  );
}

export default Newsession;
