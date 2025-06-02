import { Placeholder, Button } from "@telegram-apps/telegram-ui";
import { Icon24Add } from "@vkontakte/icons";
import { bem } from "@/css/bem";
import "./Bands.css";

const [, e] = bem("bands-page");

export function Bands() {
  const handleRecordBand = () => {
    // No target specified yet - placeholder function
    console.log("Record Band clicked - no target configured");
  };

  return (
    <Placeholder
      className={e("placeholder")}
      header="Bands"
      description={
        <>
          <p>Underground Not Dead</p>
          <Button
            size="s"
            onClick={handleRecordBand}
            className={e("button")}
            before={<Icon24Add />}
          >
            Record Band
          </Button>
        </>
      }
    />
  );
}
