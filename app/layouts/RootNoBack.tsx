import { Outlet, useNavigate } from "react-router";
import { useSwipe } from "@/hooks/useSwipe";
import { hideBackButton, isBackButtonMounted } from "@telegram-apps/sdk-react";
import { useEffect } from "react";

export default function RootNoBack() {
  // Set up swipe handlers for navigation between tabs
  // const swipeHandlers = useSwipeable({
  //   onSwipedLeft: () => {
  //     console.log("Swiped left");
  //     // // When swiping left, go to the next tab (if not on the last tab)
  //     // if (activeTab >= 0 && activeTab < routes.length - 1) {
  //     //   const nextTab = activeTab + 1;
  //     //   navigate(routes[nextTab]);
  //     // }
  //   },
  //   onSwipedRight: () => {
  //     console.log("Swiped right");
  //     // // When swiping right, go to the previous tab (if not on the first tab)
  //     // if (activeTab > 0) {
  //     //   const prevTab = activeTab - 1;
  //     //   navigate(routes[prevTab]);
  //     // }
  //   },
  //   // Configure swipe sensitivity
  //   trackMouse: true, // Only track touch events, not mouse
  //   swipeDuration: 70, // Adjust swipe duration for sensitivity
  //   preventScrollOnSwipe: false, // Allow scrolling within pages
  // });

  const navigate = useNavigate();

  const handleLeftSwipe = (direction: "left" | "right") => {
    if (direction === "left") {
      console.log("Swiped left - Dislike");
      navigate(-1);
      // Trigger dislike action
    }
  };

  const handleRightSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      console.log("Swiped right - Like");
      navigate(+1);
      // Trigger like action
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
