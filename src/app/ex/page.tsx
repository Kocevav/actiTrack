import { auth } from "@/auth";

export default async function Ex() {
  const session = await auth();
  console.log(session);
  return <div>Hiiii</div>;
}
