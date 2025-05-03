import { useNavigate, Outlet } from "react-router";
import {
  showBackButton,
  onBackButtonClick,
  isBackButtonMounted,
} from "@telegram-apps/sdk-react";
import { useEffect } from "react";

export default function RouteLayoutWithBack() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isBackButtonMounted()) return;

    if (showBackButton.isAvailable()) {
      showBackButton();
    }

    return onBackButtonClick(() => {
      navigate(-1);
    });
  }, [navigate]);

  return <Outlet />;
}
