# Open Crew

https://study-crew.web.app/
> 現在、利用実態がなく、昨今のサイバー攻撃の増加を踏まえて非公開としています。内容については以下のスクリーンショット及びデモ動画をご覧ください。

## スクリーンショット

代表的な画面のスクリーンショットを添付しています。より詳細なスクリーンショットやデモ動画については、以下のGoogle Driveをご覧ください。

[詳細資料・スクリーンショット・デモ動画（Google Drive）](https://drive.google.com/drive/folders/196ReEMgOLP86pPstg8r6hi4j2DAxw0bN?usp=sharing)
  
### ホーム画面
<img width="1920" height="1140" alt="ホーム画面" src="https://github.com/user-attachments/assets/426102a1-07bc-4d0b-ac4e-329dcb7c8337" />

### イベント一覧画面
<img width="1920" height="1140" alt="イベント一覧画面" src="https://github.com/user-attachments/assets/92c810b4-8f05-4a53-8ee8-4f9cdf1aeaa2" />

### イベント詳細画面
<img width="1920" height="1140" alt="イベント詳細画面" src="https://github.com/user-attachments/assets/7402e430-3966-4169-bd69-d49dff7b8f85" />

### チャット画面
<img width="1920" height="1140" alt="チャット画面" src="https://github.com/user-attachments/assets/a2a22cad-3062-4dac-84df-1b57f33bffca" />

### イベント作成画面
<img width="1920" height="1140" alt="イベント作成画面" src="https://github.com/user-attachments/assets/d35bc172-56f1-4c0a-892d-83f6a2427054" />











---

## 概要

Open Crewは、社会人サークルや学習・作業仲間に参加する前に 「雰囲気」を知ることができるWebアプリです。

コミュニティ参加において、

- 中の雰囲気が分からない
- 入ってから合わない可能性がある

といった課題に対して、 **事前にグループの様子を把握できる仕組み** を提供しています。

---

## 設計

### 雰囲気の可視化

参加前の不安を減らすために、複数の手段で雰囲気を把握できるようにしています。

- チャット閲覧
- ブログ
- 口コミ

---

### 公開範囲の制御

すべてのチャットを公開するのではなく、

- 公開しても問題ない情報 → 参加前でも閲覧可能
- 集合場所などの情報 → 参加者のみ閲覧可能

とすることで、 **透明性とプライバシーの両立**を意識しています。

---

### Study Crew → Open Crew

当初は学習用途に限定していましたが、

- 用途を限定しない方が価値が広がる
- 社会人サークルなどにも適用できる

と考え、「Open Crew」に変更しました。

一方でFirebaseの構成上、

- 既存データや設定の変更コストが高い

ため、URLなど一部は旧名称のまま維持しています。

## 主な機能

- ユーザー認証（Firebase Authentication）
- グループの作成・参加
- グループチャットの投稿・閲覧
- チャットの公開範囲制御
  - 一部は参加前でも閲覧可能
  - 非公開設定により参加者のみ閲覧可能
- ブログ機能（活動内容の発信）
- 口コミ機能（外部からの評価・感想）
- 画像アップロード（Firebase Storage）
- Firestoreによるリアルタイム更新

---

## 技術スタック

- フロントエンド
  - React
  - Vite
- バックエンド / インフラ
  - Firebase
    - Authentication
    - Firestore
    - Storage
    - Hosting

---

## その他

### 開発期間

2024年12月～2025年2月の2か月弱程度

### 課題・改善点

このサービスは初めて作成したサービスであり、まずは作りきることを目標としたためコードには多くの問題があります。長期インターンなどを通して、設計や可読性の高いコードは勉強中です。

- データ設計の粒度が粗い
- 命名規則・設計の統一性が不十分
- コンポーネント設計の見直し余地
- 状態管理の整理不足
