import { Placeholder } from "@telegram-apps/telegram-ui";
import { bem } from "@/css/bem";

const [, e] = bem("playlist-page");

export function Playlist() {
  return (
    <Placeholder
      className={e("placeholder")}
      header="Playlist"
      description={
        <>
          <p>Coming soon</p>
        </>
      }
    />
  );
}
