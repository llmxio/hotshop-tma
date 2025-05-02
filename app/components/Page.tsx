import { useNavigate } from "react-router";
import {
  hideBackButton,
  onBackButtonClick,
  showBackButton,
  isBackButtonMounted,
} from "@telegram-apps/sdk-react";

import { type PropsWithChildren, useEffect } from "react";

export function Page({
  children,
  back = true,
}: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   */ back?: boolean;
}>) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isBackButtonMounted()) {
      return;
    }

    if (back) {
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
  }, [back]);

  return <>{children}</>;
}
