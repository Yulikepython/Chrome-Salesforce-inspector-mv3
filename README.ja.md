<img src="https://raw.githubusercontent.com/sorenkrabbe/Chrome-Salesforce-inspector/master/addon/icon128.png" align="right">

# Salesforce inspector

SalesforceのUI上にメタデータレイアウトを追加し、Salesforceの設定、開発、連携作業の生産性と満足度を向上させるChromeおよびFirefox拡張機能です。

## インストール方法

現在、公式のChrome Web StoreおよびFirefox Add-onsからは削除されているため、このリポジトリからビルドしてインストールする必要があります。

## 機能
* レコード詳細ページ、編集ページ、Visualforceページから直接フィールド情報をすばやく表示
* ページレイアウトに表示されていないデータを含め、レコードのすべてのデータをすばやく表示・編集
* Salesforce内から直接、簡易的なデータのエクスポートとインポートを実行。データはExcelとの間で簡単にコピー可能。ブラウザでログイン済みの場合、再ログイン不要
* 現在の制限使用状況の表示
* ユーザーレコード詳細への簡単なアクセス（「ログイン」機能を含む）。テストユーザー間の切り替えに便利
* その他多数...

<img alt="Inspector menu" src="https://raw.githubusercontent.com/sorenkrabbe/Chrome-Salesforce-inspector/master/docs/screenshots/1.png" height="100">
<img alt="Show field metadata" src="https://raw.githubusercontent.com/sorenkrabbe/Chrome-Salesforce-inspector/master/docs/screenshots/2.png" height="100">
<img alt="Show all data for record" src="https://raw.githubusercontent.com/sorenkrabbe/Chrome-Salesforce-inspector/master/docs/screenshots/3.png" height="100">
<img alt="Data exporter" src="https://raw.githubusercontent.com/sorenkrabbe/Chrome-Salesforce-inspector/master/docs/screenshots/4.png" height="100">
<img alt="Data importer" src="https://raw.githubusercontent.com/sorenkrabbe/Chrome-Salesforce-inspector/master/docs/screenshots/5.png" height="100">
<img alt="Monitor limits" src="https://raw.githubusercontent.com/sorenkrabbe/Chrome-Salesforce-inspector/master/docs/screenshots/6.png" height="100">

## セキュリティとプライバシー
Salesforce Inspectorブラウザ拡張機能/プラグインは、ユーザーのWebブラウザとSalesforceサーバー間で直接通信します。データは他の第三者に送信されず、ユーザーがSalesforce Inspectorページを離れた後にSalesforceサーバー外にデータが永続化されることもありません。

Inspectorは、現在ログインしているユーザーに代わって、公式のSalesforce WebサービスAPIを通じて通信します。つまり、Inspectorはユーザーがアクセス権を与えられたデータと機能以外にアクセスすることはできません。

InspectorからのすべてのSalesforce API呼び出しは、ブラウザがSalesforceにアクセスするために使用しているアクセストークン/セッションを再利用します。このアクセストークンを取得するために、Salesforce InspectorはSalesforceドメインのブラウザCookie情報を読み取る権限が必要です。

このセキュリティ説明の正確性を確認するには、ソースコードの検査、ブラウザのネットワークトラフィックの監視、または説明を信頼してください。

## 免責事項
このソフトウェアは「現状のまま」で提供され、いかなる種類の保証もありません。このソフトウェアの作者および保守管理者は、ソフトウェアの使用に起因するいかなる請求、損害、その他の責任も負いません。自己責任でご使用ください。

これは元のSalesforce Inspectorをコミュニティがメンテナンスするフォークであり、現代のブラウザ要件をサポートするための修正が加えられています。Salesforceと公式に関連付けられているものではありません。

## トラブルシューティング
* インストール後にSalesforce Inspectorが利用できない場合、最も考えられる問題はブラウザが最新ではないことです。
* SalesforceでMy Domain機能を有効にした場合、ブラウザを再起動するまで（または古いSalesforceドメインの「sid」Cookieを他の方法で削除するまで）Salesforce Inspectorが機能しない場合があります。

## 開発方法

1. Node.jsとnpmをインストール
2. `npm install`

### Chrome
1. `npm run chrome-dev-build`
2. `chrome://extensions/`を開く
3. `開発者モード`を有効にする
4. `パッケージ化されていない拡張機能を読み込む`をクリック
5. このリポジトリの`addon`サブディレクトリを選択

### Firefox
1. `npm run firefox-dev-build`
2. Firefoxで`about:debugging`を開く
3. `一時的なアドオンを読み込む`をクリック
4. `addon/manifest.json`ファイルを選択

## ユニットテスト
1. 組織（Developer Editionなど）をセットアップし、以下のカスタマイズを適用します:
   1.a. `test/org/`にあるメタデータに記述されているすべてを適用。`sfdx force:mdapi:deploy --deploydir test/org -w 1000 -u [your-test-org-alias]`で組織にプッシュ
   1.b. _「ユーザーが連絡先を複数の取引先に関連付けることを許可する」_ が有効になっていることを確認（設定→取引先設定）
   1.c. 組織に _名前空間プレフィックス_ がないことを確認（設定→パッケージマネージャー）
2. 拡張機能のページに移動し、ファイル名を`test-framework.html`に置き換えます。例：`chrome-extension://example/test-framework.html?host=example.my.salesforce.com`
3. 「Salesforce Inspector unit test finished successfully」と表示されるまで待ちます
4. テストが失敗した場合は、ブラウザの開発者ツールコンソールを開いてエラーメッセージを確認してください

### リンティング
1. `npm run eslint`

## リリース
バージョン番号は[addon/manifest-template.json](addon/manifest-template.json)ファイル内で手動で増分する必要があります

### Chrome
バージョン番号がChrome Web Storeの現在のバージョンより大きい場合、リビジョンはパッケージ化されストアにアップロードされ、手動でリリースする準備が整います。

### Firefox
1. `npm run firefox-release-build`
2. `target/firefox/firefox-release-build.zip`からファイルをaddons.mozilla.orgにアップロード

## デザイン原則
(すべてに完全に準拠しているわけではありません。プルリクエスト歓迎します)
* ユーザーが明示的に操作するまで完全に非アクティブ状態を維持します。このツールはモンキーパッチングや内部APIに依存しているため、使用時にSalesforce機能を壊す可能性があります。ツールがインストールまたは有効化されているだけでSalesforceを壊さないようにする必要があります。例えば、設定検索プレースホルダーのバグは修正しません。
* 手動のアドホックタスク専用です。このツールは、管理者や開発者がブラウザでSalesforceを操作するのを支援するために設計されています。結局のところ、これはブラウザアドオンです。自動化の実現は目標ではありません。
* ユーザーエクスペリエンスは重要です。機能は直感的で発見しやすいものであるべきですが、効率性は発見可能性よりも重要です。より高度な機能は隠され、主要な機能は中心的であるべきです。パフォーマンスが鍵です。
* ユーザーを圧倒することなく、できるだけ多くの文脈情報を自動的に提供します。必要なときに自動的に提示される情報は、明示的にリクエストする必要がある情報よりもはるかに有用です。例えば、すべての入力に自動補完を提供します。
* 生のSalesforce APIへの簡単なアクセスを提供します。拡張機能が失敗した場合でも、コアユースケースを壊さない方法でインタラクションを強化します。例えば、SOQLクエリを解析できない場合でも、データエクスポートの結果を表示できるようにします。
* コアSalesforce UIですでに利用可能な機能も、より簡単、よりスマート、より速く実行できる場合は実装して構いません。
* できるだけ多くのユーザーが使用できるようにします（システム管理者、標準ユーザー、個人アカウント、マルチ通貨、大量データボリューム、Professional Edition、遅いネットワークなど）。
* Salesforce APIリクエストの数と複雑さについては保守的であるべきですが、それを行うために他の原則を犠牲にしないでください。
* システム管理者、開発者、インテグレーターに焦点を当てます。

## 作者について
Søren KrabbeとJesper Kristensenによって開発

## ライセンス
MIT