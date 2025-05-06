import { Outlet, useNavigate } from "react-router";
import { useSwipeable } from "react-swipeable";
import { hideBackButton, isBackButtonMounted } from "@telegram-apps/sdk-react";
import { useEffect } from "react";

export default function RootNoBack() {
  // Set up swipe handlers for navigation between tabs
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      console.log("Swiped left");
      // // When swiping left, go to the next tab (if not on the last tab)
      // if (activeTab >= 0 && activeTab < routes.length - 1) {
      //   const nextTab = activeTab + 1;
      //   navigate(routes[nextTab]);
      // }
    },
    onSwipedRight: () => {
      console.log("Swiped right");
      // // When swiping right, go to the previous tab (if not on the first tab)
      // if (activeTab > 0) {
      //   const prevTab = activeTab - 1;
      //   navigate(routes[prevTab]);
      // }
    },
    // Configure swipe sensitivity
    trackMouse: true, // Only track touch events, not mouse
    swipeDuration: 70, // Adjust swipe duration for sensitivity
    preventScrollOnSwipe: false, // Allow scrolling within pages
  });
  useEffect(() => {
    if (isBackButtonMounted() && hideBackButton.isAvailable()) {
      hideBackButton();
    }
  }, []);

  return (
    <div {...swipeHandlers}>
      <Outlet />
    </div>
  );
}
