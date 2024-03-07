import { LoaderFunctionArgs, json } from "@remix-run/node";
import { db } from "~/server/db.server";

export async function action({ request }: LoaderFunctionArgs) {
  const data = await request.json();
  const { userAgent, requestUrl } = data;
  
  const pageView = await db.pageView.create({
    data: {
      userAgent: userAgent,
      url: requestUrl,
    },
  });

  return json(pageView, { status: 201 });
}
