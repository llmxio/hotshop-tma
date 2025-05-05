import { Link } from "@/components/Link";
import React from "react";
import { Button, Section } from "@telegram-apps/telegram-ui";

export function Home() {
  return (
    <>
      <Section>
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <img
            src="/assets/ton.svg"
            alt="TON"
            style={{ width: "120px", height: "auto" }}
          />
          <h1 style={{ marginTop: "1rem" }}>Hot Shop Radio</h1>
          <p style={{ marginTop: "0.5rem", color: "#777" }}>
            The best music on TON
          </p>
        </div>
      </Section>
      <Section>
        <Link to="/radio">
          <Button stretched size="l">
            Start Listening
          </Button>
        </Link>
      </Section>
    </>
  );
}
