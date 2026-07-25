import { redirect } from "next/navigation";

export default function Home() {
  // Instantly redirect the root URL to the admin command center.
  // If you are not logged in, your admin layout will automatically bounce you to /login.
  redirect("/admin");
}