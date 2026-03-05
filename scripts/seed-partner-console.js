/**
 * ブラウザのコンソール（F12）に貼り付けて実行してください。
 * 現在 localStorage に保存されているメールアドレスを
 * role: 'PARTNER' かつ is_profile_completed 相当（levereed_hearing_completed）に強制更新します。
 * 再ログイン前に実行しても、ログイン時に上書きされるため、auth.ts の PARTNER_EMAILS に
 * ご利用のメールを追加したうえで再ログインするか、このスクリプトをログイン後に実行してください。
 */
(function () {
  var email = localStorage.getItem("levereed_user_email");
  if (!email) {
    console.warn("levereed_user_email がありません。先にログインしてください。");
    return;
  }
  localStorage.setItem("levereed_user_role", "partner");
  localStorage.setItem("levereed_hearing_completed", "1");
  console.log("User Role: PARTNER");
  console.log("is_profile_completed 相当を設定しました。ページを再読み込みしてください。");
})();
