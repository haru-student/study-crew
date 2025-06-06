import React, { useState, useEffect } from 'react';
import Introduction from './Introduction';
import Toppage from './Toppage';
import { RingLoader } from 'react-spinners';

function Home({ user }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // 1秒後にローディング状態を解除
    }, 500);

    return () => {
      clearTimeout(timer); // クリーンアップ処理
    };
  }, []);

  if (isLoading) {
    // ローディング画面を表示
    return (
      <div className="d-flex justify-content-center text-center mt-4">
        <RingLoader size={48} color="blue" />
      </div>
    );
  }

  // ローディングが終わったら適切なコンポーネントを表示
  if (user) {
    return <Toppage user={user} />;
  } else {
    return <Introduction />;
  }
}

export default Home;
