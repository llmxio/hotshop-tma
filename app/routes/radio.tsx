import type { Route } from "./+types/radio";
import { RadioPage } from "~/pages/RadioPage";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return {
    message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
  };
}

export const clientLoader = async ({
  request,
  serverLoader,
  params,
}: Route.ClientLoaderArgs) => {
  try {
    const serverParams = await serverLoader();
    const launchParams = retrieveLaunchParams();

    return { ...launchParams, ...serverParams };
  } catch (error) {
    console.error("radio", error);
  }
};

export default function Radio({ loaderData }: Route.ComponentProps) {
  // console.log("radio", loaderData);
  return <RadioPage />;
}
