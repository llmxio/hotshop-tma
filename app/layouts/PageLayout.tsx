import { useNavigate } from "react-router";
import {
  hideBackButton,
  onBackButtonClick,
  showBackButton,
  isBackButtonMounted,
} from "@telegram-apps/sdk-react";
import { type PropsWithChildren, useEffect } from "react";

/**
 * PageLayout component that handles back button visibility and navigation
 *
 * @param children - Page content to render
 * @param showBackBtn - Whether to show the back button (default: true)
 */
export function PageLayout({
  children,
  showBackBtn = true,
}: PropsWithChildren<{
  showBackBtn?: boolean;
}>) {
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

  return <>{children}</>;
}
