import { Tabbar, Navigation } from "@telegram-apps/telegram-ui";

import { useTonWallet } from "@tonconnect/ui-react";
import {
  Icon28ListOutline,
  Icon28Music,
  Icon28MusicOutline,
  Icon28User,
  Icon28UserOutline,
  Icon28Users,
  Icon28UsersOutline,
} from "@vkontakte/icons";

import { useLocation } from "react-router";
import { Link } from "@/components/Link";

import { getActiveTab, getTabRoute } from "./shared";
import { RadioController } from "@/components/Radio";
import "./Navigator.css";

/**
 * Main application navigation component that displays a persistent bottom tab bar
 * on every page of the application
 */
export function Navigator() {
  const location = useLocation();
  const wallet = useTonWallet();

  const activeTab = getActiveTab(location.pathname);

  return (
    <>
      <RadioController />
      <Tabbar className="navigator-tabbar">
        <Link to={getTabRoute(0)} viewTransition>
          <Tabbar.Item text="Radio" selected={activeTab === 0}>
            <Navigation>
              {activeTab === 0 ? <Icon28Music /> : <Icon28MusicOutline />}
            </Navigation>
          </Tabbar.Item>
        </Link>
        <Link to={getTabRoute(1)} viewTransition>
          <Tabbar.Item text="Jam" selected={activeTab === 1}>
            <Navigation>
              <Icon28ListOutline />
            </Navigation>
          </Tabbar.Item>
        </Link>
        <Link to={getTabRoute(2)} viewTransition>
          <Tabbar.Item text="Bands" selected={activeTab === 2}>
            <Navigation>
              {activeTab === 2 ? <Icon28Users /> : <Icon28UsersOutline />}
            </Navigation>
          </Tabbar.Item>
        </Link>
        <Link to={getTabRoute(3)} viewTransition>
          <Tabbar.Item text="Profile" selected={activeTab === 3}>
            <Navigation>
              {activeTab === 3 ? <Icon28User /> : <Icon28UserOutline />}
            </Navigation>
          </Tabbar.Item>
        </Link>
      </Tabbar>
    </>
  );
}
