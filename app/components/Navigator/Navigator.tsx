import React from "react";
import { Tabbar } from "@telegram-apps/telegram-ui";

import { useLocation, useNavigate } from "react-router";
import {
  Icon28MusicOutline,
  Icon28ListOutline,
  Icon28UserOutline,
} from "@vkontakte/icons";
import { useTonWallet } from "@tonconnect/ui-react";

/**
 * Main application navigation component that displays a persistent bottom tab bar
 * on every page of the application
 */
export function Navigator() {
  const location = useLocation();
  const navigate = useNavigate();

  const wallet = useTonWallet();

  // Define all available routes for navigation
  // const routes = ["/", "/queue", "/profile"];

  // Determine which tab should be active based on the current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/" || path.startsWith("/radio")) return 0;
    if (path.startsWith("/playlist")) return 1;
    if (path.startsWith("/profile")) return 2;
    // For any other pages like track info, don't highlight any tab
    // but still show the navigation
    return -1;
  };

  const activeTab = getActiveTab();

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
        onClick={() => handleNavigate("/", 0)}
      >
        <Icon28MusicOutline />
      </Tabbar.Item>
      <Tabbar.Item
        text="Queue"
        selected={activeTab === 1}
        onClick={() => handleNavigate("/playlist", 1)}
      >
        <Icon28ListOutline />
      </Tabbar.Item>
      <Tabbar.Item
        text={wallet ? "Me" : "Login"}
        selected={activeTab === 2}
        onClick={() => handleNavigate("/profile", 2)}
      >
        <Icon28UserOutline />
      </Tabbar.Item>
    </Tabbar>
  );
}
