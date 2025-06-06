import React, { useCallback, useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  getBlogs,
  getCircleDataById,
  deleteBlog,
  changeBlogName,
} from "./dbControl";
import NewBlog from "./NewBlog";
import { toast } from "react-toastify";
import Report from "./Report";

function Blog({ user }) {
  const { id } = useParams();
  const [circle, setCircle] = useState();
  const [addBlog, setAddBlog] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [text, setText] = useState(""); // 初期テキスト状態
    const [report, setReport] = useState(false);
    const [improper, setImproper] = useState(null);

  // サークルデータを取得する共通関数
  const fetchCircleData = useCallback(() => {
    if (!id) return;
    getCircleDataById(id)
      .then(setCircle)
      .catch((error) => console.error("データ取得エラー:", error));
  }, [id]);

  // ブログデータを取得する共通関数
  const fetchBlogs = useCallback(() => {
    if (!id) return;
    getBlogs(id)
      .then(setBlogs)
      .catch((error) => console.log(error));
  }, [id]);

  // id が変わったときにデータを再取得
  useEffect(() => {
    fetchCircleData();
    fetchBlogs();
  }, [fetchCircleData, fetchBlogs]);

  // circle.blogName の更新 (null の場合はデフォルト値を設定)
  useEffect(() => {
    if (circle && circle.blogName) {
      setText(circle.blogName); // blogName が存在する場合のみ設定
    } else {
      setText("デフォルトのブログ名"); // blogName が null または undefined の場合
    }
  }, [circle]);

  // 新規投稿時にサークルデータを再取得
  useEffect(() => {
    if (!addBlog) {
      fetchBlogs();
    }
  }, [addBlog]);

  // ブログ削除
  const handleDeleteBlog = async (blogId, image) => {
    if (!id || !blogId) return;
    try {
      await deleteBlog(id, blogId, image);
      fetchBlogs(); // ✅ 削除後にブログデータを再取得
    } catch (error) {
      console.error(error);
    }
  };

  // ブログ名の保存
  const handleBlur = (e) => {
    const inputText = e.target.innerText.trim();
    if (!inputText) {
      // テキストが空の場合、デフォルトのブログ名をセット
      const defaultText = circle.blogName;
      setText(defaultText);
      e.target.innerText = defaultText; // h1 の内容を更新
      toast.warning("ブログの名前は必須です");
    } else {
      changeBlogName(id, inputText)
        .then(() => {
          setText(inputText);
          toast.success("ブログ名を更新しました");
        })
        .catch((error) => {
          console.error("Firestore更新エラー:", error);
          toast.error("ブログ名の更新に失敗しました");
        });
    }
  };
  const handleReport = async(data)=>{
    setImproper(data);
    setReport(true)
  }

  return (
    <Container className="blog position-relative">
      <Report report={report} setReport={setReport} user={user ? user.uid : null} data={improper}/>
      <NewBlog addBlog={addBlog} setAddBlog={setAddBlog} circle={circle} />
      {user && circle && circle.host.includes(user.uid) && (
        <Button className="d-flex ms-auto" onClick={() => setAddBlog(true)}>
          新規投稿
        </Button>
      )}

      {circle &&
        (user && circle.host.includes(user.uid) ? (
          <>
            <h1
              className="editable-text text-center"
              contentEditable
              suppressContentEditableWarning={true}
              onBlur={handleBlur} // カーソルが外れたら保存
            >
              {text || circle.blogName}
            </h1>
          </>
        ) : (
          <>
            <h1 className="text-center">{circle.blogName}</h1>
            <div className="mt-3"></div>
          </>
        ))}

      {blogs && blogs.length > 0 ? (
        <div>
          <ul className="list-unstyled mx-5">
            {blogs.map((blog, index) => (
              <li key={index} className="mx-5 position-relative mt-4">
                {user && circle && circle.host.includes(user.uid) ? (
                  <img
                    src="/trash.svg"
                    alt="削除アイコン"
                    className="position-absolute top-0 end-0 mt-1 me-1 icon"
                    onClick={() => {
                      handleDeleteBlog(blog.id, blog.data.image);
                    }}
                  />
                ) : (
                  <p className="position-absolute top-0 end-0 mt-1 me-1 icon" onClick={() => handleReport(blog)}>
                  ︙
                </p>
                )}
                <h2>{blog.data.title}</h2>
                <p className="mx-1">{blog.data.content}</p>
                {blog.data.image && (
                  <img
                    src={blog.data.image}
                    alt="ブログ画像"
                    className="img-fluid mb-4 d-block mx-auto"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center">
          ブログがまだ投稿されていないか、ブログデータを取得できません。
        </p>
      )}
    </Container>
  );
}

export default Blog;
