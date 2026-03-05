import { redirect } from "next/navigation";

/**
 * トップはログイン画面へリダイレクト
 */
export default function Home() {
  redirect("/login");
}
