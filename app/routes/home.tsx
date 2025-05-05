import type { Route } from "./+types/home";
import { Home } from "@/pages/Home"; // Updated import
import {
  retrieveLaunchParams,
  useLaunchParams,
} from "@telegram-apps/sdk-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home - Hot Shop Radio" },
    { name: "description", content: "Welcome to Hot Shop Radio!" },
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
    console.error("home", error);
  }
}

export default function HomeRoute({ loaderData }: Route.ComponentProps) {
  return <Home />;
}
