import React, { useEffect, useState } from "react";
import { Section, List, Button, Spinner } from "@telegram-apps/telegram-ui";
import { useRadioPlayer } from "./RadioPlayer";
import { RadioTrackInfo } from "./RadioTrackInfo";
import type { RadioTrackInfoProps } from "./RadioTrackInfo";

type Track = RadioTrackInfoProps;

interface ApiResponse {
  tracks?: Track[];
  [key: string]: any;
}

// API endpoint for fetching next tracks
const API_ENDPOINT =
  "https://a3.radioheart.ru/api/json?userlogin=user8039&count=10&api=nexttrack";

export const RadioTrackQueue: React.FC = () => {
  const { playing } = useRadioPlayer();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch next tracks
  const fetchNextTracks = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINT);

      if (!response.ok) {
        throw new Error(`Failed to fetch next tracks: ${response.status}`);
      }

      const data = (await response.json()) as ApiResponse | Track[];

      // Handle different response formats
      if (Array.isArray(data)) {
        setTracks(data);
      } else if (data && Array.isArray(data.tracks)) {
        setTracks(data.tracks);
      } else {
        console.warn("Unexpected API response format:", data);
        setTracks([]);
      }
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
            <RadioTrackInfo key={index} name={track.name} index={index + 1} />
          ))}
        </List>
      )}
    </Section>
  );
};

export default RadioTrackQueue;
