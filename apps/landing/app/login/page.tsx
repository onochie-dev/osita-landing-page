import { redirect } from "next/navigation";

export default function LoginPage() {
  const webappUrl = process.env.NEXT_PUBLIC_WEBAPP_URL || "http://localhost:5173";
  redirect(`${webappUrl}/login`);
}


