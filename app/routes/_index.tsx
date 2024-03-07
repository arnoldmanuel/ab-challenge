import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { SignupButton } from "~/components/signup-button";
import { cn } from "~/lib/utils";
import { db } from "~/server/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Blinkist Blog" },
    { name: "description", content: "Welcome to Blinkist!" },
  ];
};

export async function action({ request }: LoaderFunctionArgs) {

}

export async function loader({ request }: LoaderFunctionArgs) {
  const variants = await db.variants.findMany();
  const isCohortCookieSet = request.headers.get("Cookie")?.includes("cohort");
  
  if (!isCohortCookieSet) {
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    return json(
      { variant: randomVariant },
      {
        status: 200,
        headers: {
          "Set-Cookie":
            "cohort=" +
            randomVariant.id +
            "; Max-Age=31536000; SameSite=Strict; Path=/; Secure; HttpOnly",
        },
      }
    );
  }

  const cohort = request.headers.get("Cookie")?.split(";").find(c => c.includes("cohort"));
  const cohortId = cohort?.split("=")[1];
  const variant = variants.find(v => v.id === Number(cohortId));

  return json({ variant }, { status: 200 });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const variant = data.variant?.name;

  useEffect(() => {
    const trackPageView = async () => {
      const userAgent = navigator.userAgent;
      const variantId = data.variant?.id || 0;
      const requestUrl = window.location.href;

      await fetch("/track-page-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userAgent, variantId, requestUrl }),
      });
    }
    trackPageView();
  }, [])

  return (
    <div>
      <h1>Check out the Blinkist app</h1>
      <img src="/img/hero_image.jpg" alt="Blinkist app" />
      <p>
        Meet the app that revolutionized reading. Meet the app that has 18
        million users. Thanks a lot for reading the article!{" "}
        <SignupButton 
          variantId={data.variant?.id || 0}
          textColor={cn(variant === "red" && "text-red-500", variant === "orange" && "text-orange-500", variant === "green" && "text-green-500", variant === "blue" && "text-blue-500", variant === "purple" && "text-purple-500", variant === "pink" && "text-pink-500", variant === "indigo" && "text-indigo-500", variant === "yellow" && "text-yellow-500", variant === "teal" && "text-teal-500", variant === "cyan" && "text-cyan-500", variant === "gray" && "text-gray-500", variant === "black" && "text-black-500", variant === "white" && "text-white-500" && "text-black-500")} 
        /> for Blinkist.
      </p>
    </div>
  );
}
