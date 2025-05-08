import { Placeholder } from "@telegram-apps/telegram-ui";
import { bem } from "@/css/bem";
import "./Bands.css";

const [, e] = bem("bands-page");

export function Bands() {
  return (
    <Placeholder
      className={e("placeholder")}
      header="Bands"
      description={
        <>
          <p>Coming soon</p>
        </>
      }
    />
  );
}
