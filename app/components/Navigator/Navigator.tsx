import { Tabbar } from "@telegram-apps/telegram-ui";

import { useTonWallet } from "@tonconnect/ui-react";
import {
  Icon28ListOutline,
  Icon28MusicOutline,
  Icon28UserOutline,
  Icon28UsersOutline,
} from "@vkontakte/icons";

import { useLocation, useNavigate } from "react-router";

import { getActiveTab, getTabRoute } from "./sharedNavigation";

/**
 * Main application navigation component that displays a persistent bottom tab bar
 * on every page of the application
 */
export function Navigator() {
  const location = useLocation();
  const navigate = useNavigate();
  const wallet = useTonWallet();

  const activeTab = getActiveTab(location.pathname);

  const handleNavigate = (route: string, index: number) => {
    if (activeTab !== index) {
      navigate(route);
    }
  };

  return (
    <Tabbar>
      <Tabbar.Item
        text="Radio"
        selected={activeTab === 0}
        onClick={() => handleNavigate(getTabRoute(0), 0)}
      >
        <Icon28MusicOutline />
      </Tabbar.Item>
      <Tabbar.Item
        text="Queue"
        selected={activeTab === 1}
        onClick={() => handleNavigate(getTabRoute(1), 1)}
      >
        <Icon28ListOutline />
      </Tabbar.Item>
      <Tabbar.Item
        text="Bands"
        selected={activeTab === 3}
        onClick={() => handleNavigate(getTabRoute(2), 2)}
      >
        <Icon28UsersOutline />
      </Tabbar.Item>
      <Tabbar.Item
        text="Profile"
        selected={activeTab === 4}
        onClick={() => handleNavigate(getTabRoute(3), 3)}
      >
        <Icon28UserOutline />
      </Tabbar.Item>
    </Tabbar>
  );
}
