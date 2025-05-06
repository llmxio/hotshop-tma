import { useState } from "react";
import {
  Section,
  List,
  Cell,
  Avatar,
  Divider,
  Placeholder,
  Text,
  Title,
} from "@telegram-apps/telegram-ui";
import {
  useTonAddress,
  TonConnectButton,
  useTonWallet,
} from "@tonconnect/ui-react";

import "./Profile.css";

import { bem } from "@/css/bem";

const [, e] = bem("ton-connect-page");

export function Profile() {
  const wallet = useTonWallet();

  if (!wallet) {
    return (
      <Placeholder
        className={e("placeholder")}
        header="TON Connect"
        description={
          <>
            <Text data-oid="u2i3kq1">
              To display the data related to the TON Connect, it is required to
              connect your wallet
            </Text>
            <TonConnectButton className={e("button")} data-oid="ip9gl8:" />
          </>
        }
        data-oid="anoiltd"
      />
    );
  }

  const {
    account: { chain, publicKey, address },
    device: { appName, appVersion, maxProtocolVersion, platform, features },
  } = wallet;

  return (
    <List data-oid="e9iae2o">
      {"imageUrl" in wallet && (
        <>
          <Section data-oid="6grn:6_">
            <Cell
              before={
                <Avatar
                  src={wallet.imageUrl}
                  alt="Provider logo"
                  width={60}
                  height={60}
                  data-oid="nscyb2e"
                />
              }
              // after={<Navigation data-oid="q812c-n">About wallet</Navigation>}
              subtitle={wallet.appName}
              // onClick={(e) => {
              //   e.preventDefault();
              //   openLink(wallet.aboutUrl);
              // }}
              data-oid="8enj7vq"
            >
              <Title level="3" data-oid="yraphbu">
                {wallet.name}
              </Title>
            </Cell>
          </Section>
          <TonConnectButton
            className={e("button-connected")}
            data-oid="4xcj7og"
          />
        </>
      )}
      {/* <DisplayData
        header="Account"
        rows={[
          { title: "Address", value: address },
          { title: "Chain", value: chain },
          { title: "Public Key", value: publicKey },
        ]}
        data-oid="75iyf8f"
      />

      <DisplayData
        header="Device"
        rows={[
          { title: "App Name", value: appName },
          { title: "App Version", value: appVersion },
          { title: "Max Protocol Version", value: maxProtocolVersion },
          { title: "Platform", value: platform },
          {
            title: "Features",
            value: features
              .map((f) => (typeof f === "object" ? f.name : undefined))
              .filter((v) => v)
              .join(", "),
          },
        ]}
        data-oid="u1w6.8h"
      /> */}
    </List>
  );
}
