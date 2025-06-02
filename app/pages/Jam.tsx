import { Placeholder } from "@telegram-apps/telegram-ui";
import { bem } from "@/css/bem";
import "./Jam.css";

const [, e] = bem("jam-page");

export function Jam() {
  return (
    <div className={e("container")}>
      <Placeholder
        className={e("placeholder")}
        header="Jamulus"
        description={
          <>
            <p>Real-time music collaboration platform</p>
          </>
        }
      />
    </div>
  );
}
