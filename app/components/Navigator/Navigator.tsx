import React from "react";
import { Tabbar } from "@telegram-apps/telegram-ui";
import { useLocation, useNavigate } from "react-router";
import {
  Icon28MusicOutline,
  Icon28ListOutline,
  Icon28UserOutline,
} from "@vkontakte/icons";

/**
 * Main application navigation component that displays a persistent bottom tab bar
 * on every page of the application
 */
export function Navigator() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine which tab should be active based on the current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/" || path.startsWith("/radio")) return 0;
    if (path.startsWith("/queue")) return 1;
    if (path.startsWith("/about")) return 2;
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

  // Create tab items with both icon and text for better UX
  const renderTabItem = (
    icon: React.ReactNode,
    text: string,
    isActive: boolean
  ) => (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {icon}
      <span style={{ fontSize: "12px", marginTop: "0px" }}>{text}</span>
    </div>
  );

  return (
    <div className="app-navigation">
      <Tabbar className="app-main-tabbar">
        <Tabbar.Item
          selected={activeTab === 0}
          onClick={() => handleNavigate("/", 0)}
        >
          {renderTabItem(
            <Icon28MusicOutline width={28} height={28} />,
            "Radio",
            activeTab === 0
          )}
        </Tabbar.Item>
        <Tabbar.Item
          selected={activeTab === 1}
          onClick={() => handleNavigate("/queue", 1)}
        >
          {renderTabItem(
            <Icon28ListOutline width={28} height={28} />,
            "Playlist",
            activeTab === 1
          )}
        </Tabbar.Item>
        <Tabbar.Item
          selected={activeTab === 2}
          onClick={() => handleNavigate("/about", 2)}
        >
          {renderTabItem(
            <Icon28UserOutline width={24} height={24} />,
            "Profile",
            activeTab === 2
          )}
        </Tabbar.Item>
      </Tabbar>
    </div>
  );
}
