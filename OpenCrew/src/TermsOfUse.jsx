import React from "react";
import { Container } from "react-bootstrap";

function TermsOfUse() {
  return (
    <Container className="rules">
      <h1 className="text-center f4">利用規約</h1>
      <p>
        本利用規約（以下「本規約」）は、当サービス（以下「本サービス」）の利用条件を定めるものです。
        本サービスを利用するすべてのユーザー（以下「ユーザー」）は、本規約に同意したものとみなします。
      </p>
      <h2 className="fs-4">第1条(適用)</h2>
      <ol>
        <li>
          本規約は、ユーザーと本サービスの運営者（以下「運営者」）との間のすべての関係に適用されます。
        </li>
        <li>
          運営者は、本規約の内容を適宜変更できるものとし、
          変更後の規約は、本サービス上に掲載した時点で効力を生じるものとします。
        </li>
      </ol>
      <h2 className="fs-4">第2条(サービスの内容)</h2>
      <p>本サービスは、以下の機能を提供します。</p>
      <ul>
        <li>イベントの作成・募集</li>
        <li>グループの作成・募集</li>
        <li>口コミの投稿・閲覧</li>
        <li>チャット機能</li>
        <li>ブログ機能</li>
      </ul>
      <p>
        本サービスは、広告を掲載する場合がありますが、金銭の取り扱いは行いません。
      </p>
      <h2 className="fs-4">第3条(アカウント管理)</h2>
      <ol>
        <li>
          ユーザーは、自己の責任においてアカウントを管理・利用するものとします。
        </li>
        <li>
          アカウントの不正利用により生じた損害について、運営者は一切の責任を負いません。
        </li>
        <li>
          運営者は、ユーザーが以下のいずれかに該当する場合、
          事前の通知なしにアカウントを削除または利用停止できるものとします。
          <ul>
            <li>本規約に違反した場合</li>
            <li>不正行為を行った場合</li>
            <li>その他、運営者が不適切と判断した場合</li>
          </ul>
        </li>
      </ol>
      <h2 className="fs-4">第4条(禁止事項)</h2>
      <p>ユーザーは、本サービスの利用にあたり、以下の行為を禁止します。</p>
      <ol>
        <li>法律・条例に違反する行為</li>
        <li>他のユーザーや第三者の権利を侵害する行為</li>
        <li>誹謗中傷、嫌がらせ、差別的表現を含む投稿</li>
        <li>スパム行為、迷惑行為</li>
        <li>本サービスの運営を妨害する行為</li>
        <li>虚偽情報の投稿</li>
        <li>その他、運営者が不適切と判断する行為</li>
      </ol>
      <h2 className="fs-4">第5条(免責事項)</h2>
      <ol>
        <li>運営者は、本サービスの内容や機能について、正確性・有用性を保証するものではありません。</li>
        <li>ユーザー間のトラブルについて、運営者は一切の責任を負いません。</li>
        <li>本サービスの提供に際し、システム障害・メンテナンス等によりサービスが一時停止する場合があります。</li>
        <li>運営者は、ユーザーが本サービスを利用したことにより生じた損害について、一切の責任を負いません。</li>
      </ol>
      <h2 className="fs-4">第6条(サービスの変更・終了)</h2>
      <ol>
        <li>運営者は、ユーザーに事前に通知することなく、本サービスの内容を変更または終了することができます。</li>
        <li>本サービスの変更または終了によってユーザーに生じた損害について、運営者は一切の責任を負いません。</li>
      </ol>
      <h2 className="fs-4">第7条(個人情報の取り扱い)</h2>
      <p>運営者は、ユーザーの個人情報を適切に取り扱い、<a href="/privacy">プライバシーポリシー</a>に基づいて管理します。</p>
      <h2 className="fs-4">第8条(準拠法・管轄)</h2>
      <p className="mb-0">本規約は、日本法に準拠し、解釈されるものとします。</p>
      <p>本サービスに関する紛争が生じた場合、運営者の指定する裁判所を第一審の専属的合意管轄とします。</p>
    </Container>
  );
}

export default TermsOfUse;
