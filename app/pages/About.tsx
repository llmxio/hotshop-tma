import React from "react";
import { Section, List, Cell } from "@telegram-apps/telegram-ui";

export function About() {
  return (
    <>
      <Section header="About">
        <List>
          <Cell multiline>
            Hot Shop Radio is an internet radio project broadcasting live from
            St. Petersburg, Russia. It offers a selection of music 24/7,
            featuring talented DJs and producers.
          </Cell>
        </List>
      </Section>
      <Section header="Contact">
        <List>
          <Cell multiline>
            If you have any questions or suggestions, please contact us at
            info@hotshopradio.com or visit our website at www.hotshopradio.com.
          </Cell>
        </List>
      </Section>
    </>
  );
}
