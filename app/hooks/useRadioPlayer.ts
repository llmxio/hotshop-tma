import { useContext } from "react";
import { RadioPlayerContext, type RadioPlayerProps } from "@/components/Radio";

/**
 * Custom hook to access the radio player context throughout the application
 * @returns The radio player context value
 */
export const useRadioPlayer = (): RadioPlayerProps =>
  useContext(RadioPlayerContext);
