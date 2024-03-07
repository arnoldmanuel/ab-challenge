import { LoaderFunctionArgs, json } from "@remix-run/node";
import { db } from "~/server/db.server";

export async function action({ request }: LoaderFunctionArgs) {
  const data = await request.json();
  const { variantId, id } = data;

  const trackedCookie = request.headers.get("Cookie")?.includes("tracked");
  
  await db.trackEvent.create({
    data: {
      name: id,
      variantId: variantId,
      unique: !trackedCookie,
    },
  });

  return json(
    { "tracked": true },
    {
      status: 201,
      headers: {
        "Set-Cookie":
          "tracked=" +
          id +
          "; Max-Age=31536000; SameSite=Strict; Path=/; Secure; HttpOnly",
      },
    }
   );
}
