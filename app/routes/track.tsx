import type { Route } from "./+types/track";
import { TrackInfoPage } from "@/pages/TrackInfoPage";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export function meta({ params }: Route.MetaArgs) {
  const { trackArtist, trackTitle } = params;

  const artist = trackArtist ? decodeURIComponent(trackArtist) : "Artist";
  const title = trackTitle ? decodeURIComponent(trackTitle) : "Track";

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
    ...params,
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
    console.error("track info", error);
    return { trackArtist: params.trackArtist, trackTitle: params.trackTitle };
  }
}

export default function Track({ loaderData }: Route.ComponentProps) {
  return (
    <TrackInfoPage
      trackArtist={loaderData.trackArtist}
      trackTitle={loaderData.trackTitle}
    />
  );
}
