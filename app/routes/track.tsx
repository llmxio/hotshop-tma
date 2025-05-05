import type { Route } from "./+types/track";
import { TrackInfo } from "@/pages/TrackInfo"; // Updated import
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Track - Hot Shop Radio" },
    { name: "description", content: "Track details for Hot Shop Radio" },
  ];
}

export async function loader({ context, params }: Route.LoaderArgs) {
  const trackId = params.id || "";

  return {
    message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
    trackId,
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
    console.error("track", error);
  }
}

export default function TrackRoute({ loaderData }: Route.ComponentProps) {
  return <TrackInfo />;
}
