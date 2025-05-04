import type { Route } from "./+types/track";
import { TrackInfoPage } from "@/pages/TrackInfoPage";
import RootWithBack from "@/layouts/RootWithBack";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export function meta({ params }: Route.MetaArgs) {
  const { trackArtist, trackName } = params;

  const artist = trackArtist ? decodeURIComponent(trackArtist) : "Artist";
  const title = trackName ? decodeURIComponent(trackName) : "Track";

  return [
    { title: `${artist} - ${title} | Hot Shop Radio` },
    {
      name: "description",
      content: `Track information for ${artist} - ${title}`,
    },
  ];
}

export async function loader({ params, context }: Route.LoaderArgs) {
  return {
    trackArtist: params.trackArtist,
    trackName: params.trackName,
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

    const result = { ...launchParams, ...serverParams };

    console.log("clientLoader", result);

    return result;
  } catch (error) {
    console.error("track info", error);
    return { trackArtist: params.trackArtist, trackName: params.trackName };
  }
}

export default function Track({ loaderData }: Route.ComponentProps) {
  return <TrackInfoPage />;
}
