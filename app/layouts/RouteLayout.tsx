import { useNavigate } from "react-router";
import {
  hideBackButton,
  onBackButtonClick,
  showBackButton,
  isBackButtonMounted,
} from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import { Outlet } from "react-router";

/**
 * RouteLayout component that handles back button visibility and navigation
 * Uses React Router's Outlet for rendering child routes
 *
 * @param showBackBtn - Whether to show the back button (default: true)
 */
export default function RouteLayout({
  showBackBtn = true,
}: {
  showBackBtn?: boolean;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isBackButtonMounted()) {
      return;
    }

    if (showBackBtn) {
      if (showBackButton.isAvailable()) {
        showBackButton();
      }
      return onBackButtonClick(() => {
        navigate(-1);
      });
    }

    if (hideBackButton.isAvailable()) {
      hideBackButton();
    }
  }, [showBackBtn, navigate]);

  return <Outlet />;
}
