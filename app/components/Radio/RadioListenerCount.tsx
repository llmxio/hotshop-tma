import React, { useEffect, useState } from "react";
import { Cell, Info } from "@telegram-apps/telegram-ui";
import { useRadioPlayer } from "@/hooks/useRadioPlayer";
import { radioHeartService } from "@/services/RadioHeartService";
import { FaUsers } from "react-icons/fa";

interface RadioListenerCountProps {
  refreshInterval?: number; // in milliseconds
}

export const RadioListenerCount: React.FC<RadioListenerCountProps> = ({
  refreshInterval = 60000, // default to refresh every minute
}) => {
  const { playing } = useRadioPlayer();
  const [listeners, setListeners] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListenerCount = async () => {
    try {
      const count = await radioHeartService.getCurrentListeners();
      setListeners(count);
      setError(null);
    } catch (err) {
      console.error("Error fetching listener count:", err);
      setError("Unable to get listener count");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListenerCount();

    // Only set up polling if playing is true
    if (playing) {
      const interval = setInterval(fetchListenerCount, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [playing, refreshInterval]);

  if (!playing) return null;

  return (
    <Cell
      before={<FaUsers />}
      after={
        error ? (
          <Info type="text">Error</Info>
        ) : loading ? (
          <Info type="text">Loading...</Info>
        ) : (
          <Info type="text">{listeners?.toLocaleString() || "0"}</Info>
        )
      }
    >
      Current Listeners
    </Cell>
  );
};

export default RadioListenerCount;
