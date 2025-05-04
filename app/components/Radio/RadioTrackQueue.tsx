import React, { useEffect, useState } from "react";
import { Section, List, Button, Spinner } from "@telegram-apps/telegram-ui";
import { useRadioPlayer } from "./RadioPlayerContext";
import { RadioTrackInfo } from "./RadioTrackInfo";
import { radioHeartService } from "~/services/RadioHeartService";
import type { Track } from "~/services/RadioHeartService";

export const RadioTrackQueue: React.FC = () => {
  const { playing } = useRadioPlayer();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch next tracks
  const fetchNextTracks = async () => {
    try {
      setLoading(true);
      const upcomingTracks = await radioHeartService.getUpcomingTracks(10);
      setTracks(upcomingTracks);
    } catch (err) {
      console.error("Error fetching next tracks:", err);
      setError(err instanceof Error ? err.message : "Failed to load queue");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tracks when component mounts and when playing state changes
  useEffect(() => {
    fetchNextTracks();

    // Set up periodic refresh while playing
    let interval: number | undefined;
    if (playing) {
      interval = window.setInterval(fetchNextTracks, 30000); // Refresh every 30 seconds while playing
    }

    return () => {
      if (interval !== undefined) {
        window.clearInterval(interval);
      }
    };
  }, [playing]);

  if (loading) {
    return (
      <Section header="Coming Up Next">
        <Spinner size="m" />
      </Section>
    );
  }

  if (error) {
    return (
      <Section header="Coming Up Next">
        <div className="error-state">
          <p>{error}</p>
          <Button onClick={() => fetchNextTracks()}>Retry</Button>
        </div>
      </Section>
    );
  }

  return (
    <Section header="Coming Up Next">
      {tracks.length === 0 ? (
        <div className="empty-state">
          No upcoming tracks information available
        </div>
      ) : (
        <List>
          {tracks.map((track, index) => (
            <RadioTrackInfo
              key={index}
              name={track.name}
              index={index + 1}
              time={track.time}
            />
          ))}
        </List>
      )}
    </Section>
  );
};

export default RadioTrackQueue;
