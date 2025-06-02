import type { Route } from "./+types/track";
import { TrackInfo } from "@/pages/TrackInfo";
import {
  retrieveLaunchParams,
  useLaunchParams,
} from "@telegram-apps/sdk-react";

export function meta({ params }: Route.MetaArgs) {
  // Use params to dynamically set the meta title if available
  const artist = params.trackArtist
    ? decodeURIComponent(params.trackArtist)
    : "";
  const title = params.trackTitle ? decodeURIComponent(params.trackTitle) : "";

  const trackTitle =
    artist && title
      ? `${artist} - ${title} | Hot Shop Radio`
      : "Track - Hot Shop Radio";

  return [
    { title: trackTitle },
    { name: "description", content: `Track details for ${artist} - ${title}` },
  ];
}

export async function loader({ context, params }: Route.LoaderArgs) {
  // Extract artist and title from URL params
  const trackArtist = params.trackArtist || "";
  const trackTitle = params.trackTitle || "";

  return {
    message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
    trackArtist,
    trackTitle,
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
    console.error("track route error:", error);
    return { error: "Failed to load track data" };
  }
}

export default function TrackRoute({ loaderData }: Route.ComponentProps) {
  return <TrackInfo />;
}
