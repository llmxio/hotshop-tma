import { Outlet, useNavigate } from "react-router";
import { hideBackButton, isBackButtonMounted } from "@telegram-apps/sdk-react";
import { useEffect } from "react";

export default function RouteLayoutNoBack() {
  useEffect(() => {
    if (!isBackButtonMounted()) return;
    if (hideBackButton.isAvailable()) {
      hideBackButton();
    }
  }, []);

  return <Outlet />;
}
