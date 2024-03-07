import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { db } from "~/server/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Blinkist Admin" },
    { name: "description", content: "Welcome to Admin!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const value = formData.get("value");

  await db.variants.create({
    data: {
      name: name as string,
      value: value as string,
    },
  });
  
  return json({ message: "Variant added" }, { status: 201 });
}

export async function loader({}: LoaderFunctionArgs) {
  const variants = await db.variants.findMany();

  const totalPageViews = (await db.pageView.findMany()).length;
  const uniqueEventsVariantA = (
    await db.trackEvent.findMany({
      where: { unique: true, variantId: variants[0].id },
    })
  );
  const uniqueEventsVariantB = (
    await db.trackEvent.findMany({
      where: { unique: true, variantId: variants[1].id },
    })
  );

  const ctrVariantA = uniqueEventsVariantA.length / totalPageViews;
  const ctrVariantB = uniqueEventsVariantB.length / totalPageViews;

  return json({ variants, ctrVariantA, ctrVariantB }, { status: 200 });
}

export default function AdminPage() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className="container mx-auto">
      <h1>Admin, all Variants:</h1>
      <p>{JSON.stringify(data, null, 2)}</p>
      <fetcher.Form method="post" action="/admin">
        <Label htmlFor="name">Name</Label>
        <Input type="text" name="name" id="name" placeholder="name" />
        <Label htmlFor="value">Value</Label>
        <Input type="text" name="value" id="value" placeholder="value" />
        <Button type="submit">Add Variant</Button>
      </fetcher.Form>
      <div>
        <h2 className="text-2xl">
          Variant A CTR {data.variants[0].name}:{" "}
          {Math.round((data.ctrVariantA + Number.EPSILON) * 100) / 100}
        </h2>
        <h2 className="text-2xl">
          Variant B CTR {data.variants[1].name}:{" "}
          {Math.round((data.ctrVariantB + Number.EPSILON) * 100) / 100}
        </h2>
      </div>
    </div>
  );
}
