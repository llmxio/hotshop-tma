import { Placeholder, Button } from "@telegram-apps/telegram-ui";
import { openLink } from "@telegram-apps/sdk-react";
import { Icon24FlashOutline } from "@vkontakte/icons";
import { bem } from "@/css/bem";
import "./Jam.css";

const [, e] = bem("jam-page");

export function Jam() {
  const handleJamNow = () => {
    openLink("https://jamulus.io/");
  };

  return (
    <Placeholder
      className={e("placeholder")}
      header="Jamulus"
      description={
        <>
          <p>Real-time music collaboration platform</p>
          <Button
            size="s"
            onClick={handleJamNow}
            className={e("button")}
            before={<Icon24FlashOutline />}
          >
            Jamulus now!
          </Button>
        </>
      }
    />
  );
}
