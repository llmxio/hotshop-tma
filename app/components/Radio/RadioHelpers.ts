// Helper to parse URL
export function getLocation(href: string) {
  const match = href.match(
    /^(https?:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
  );
  return (
    match && {
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  );
}

// Helper functions to extract artist and title from song title
export function getArtistFromTitle(trackTitle: string): string {
  if (!trackTitle) return "";

  let split = trackTitle.split(" | ");

  if (split.length > 0) {
    return split[1].split("-")[0].trim();
  }

  return trackTitle;
}

export function getSongFromTitle(trackTitle: string): string {
  if (!trackTitle) return "";
  let split = trackTitle.split(" | ");

  if (split.length > 0) {
    return split[1].split("-")[1].trim();
  }

  return "";
}

// Function to fetch artist image from the API (cloned from app.js)
export function getArtistImage(
  songTitle: string,
  defaultLogo: string,
  onImageFetched: (imageUrl: string) => void
): void {
  fetch(
    `https://image-fetcher.radioheart.ru/api/get-image?artist=${getArtistFromTitle(
      songTitle
    )}&title=${getSongFromTitle(songTitle)}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data: any) => {
      if (data.image) {
        onImageFetched(data.image);
      } else {
        onImageFetched(defaultLogo);
      }
    })
    .catch((err) => {
      console.error(err);
      onImageFetched(defaultLogo);
    });
}
