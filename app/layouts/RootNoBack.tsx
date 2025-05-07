import { Outlet, useNavigate } from "react-router";
import { useSwipe } from "@/hooks/useSwipe";
import { hideBackButton, isBackButtonMounted } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import {
  getActiveTab,
  getNextTab,
  getPrevTab,
  getTabRoute,
} from "@/components/Navigator/sharedNavigation";
import { useLocation } from "react-router";

export default function RootNoBack() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = getActiveTab(location.pathname);

  const handleLeftSwipe = (direction: "left" | "right") => {
    if (direction === "left") {
      const nextTab = getNextTab(activeTab);
      if (nextTab !== activeTab) {
        navigate(getTabRoute(nextTab));
      }
    }
  };

  const handleRightSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      const prevTab = getPrevTab(activeTab);
      if (prevTab !== activeTab) {
        navigate(getTabRoute(prevTab));
      }
    }
  };

  useSwipe(handleLeftSwipe, handleRightSwipe, { threshold: 70 });

  useEffect(() => {
    if (isBackButtonMounted() && hideBackButton.isAvailable()) {
      hideBackButton();
    }
  }, []);

  return (
    <div>
      <Outlet />
    </div>
  );
}
