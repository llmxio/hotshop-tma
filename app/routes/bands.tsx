import type { Route } from "./+types/bands";
import { Bands } from "@/pages/Bands";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bands - Hot Shop Radio" },
    { name: "description", content: "Bands - Hot Shop Radio" },
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
    console.error("bands", error);
    return {};
  }
}

export default function BandsRoute({ loaderData }: Route.ComponentProps) {
  return <Bands />;
}
