import type { Route } from "./+types/about";
import { About } from "@/pages/About"; // Updated import
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About - Hot Shop Radio" },
    { name: "description", content: "About Hot Shop Radio" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  return {
    message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
  };
}

export async function clientLoader({
  request,
  serverLoader,
  params,
}: Route.ClientLoaderArgs) {
  try {
    const serverParams = await serverLoader();
    const launchParams = retrieveLaunchParams();

    return { ...launchParams, ...serverParams };
  } catch (error) {
    console.error("about", error);
  }
}

export default function AboutRoute({ loaderData }: Route.ComponentProps) {
  return <About />;
}
