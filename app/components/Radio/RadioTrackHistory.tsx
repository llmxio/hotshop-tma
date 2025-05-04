import React, { useEffect, useState } from "react";
import { Section, List, Button, Spinner } from "@telegram-apps/telegram-ui";
import { RadioTrackInfo } from "./RadioTrackInfo";
import type { RadioTrackInfoProps } from "./RadioTrackInfo";

type Track = RadioTrackInfoProps;

interface ApiResponse {
  tracks?: Track[];
  [key: string]: any;
}

const API_ENDPOINT =
  "https://a3.radioheart.ru/api/json?userlogin=user8039&count=10&api=lasttrack";

export const RadioTrackHistory: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentTracks = async () => {
      try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
          throw new Error(`Failed to fetch track history: ${response.status}`);
        }

        const data = (await response.json()) as ApiResponse | Track[];
        // Handle API response format - it could return tracks directly or nested
        if (Array.isArray(data)) {
          setTracks(data);
        } else if (data && Array.isArray(data.tracks)) {
          setTracks(data.tracks);
        } else {
          console.warn("Unexpected API response format:", data);
          setTracks([]);
        }
      } catch (err) {
        console.error("Error fetching track history:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load track history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTracks();
  }, []);

  if (loading) {
    return (
      <Section header="Recently Played Tracks">
        <Spinner size="m" />
      </Section>
    );
  }

  if (error) {
    return (
      <Section header="Recently Played Tracks">
        <div className="error-state">
          <p>{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </Section>
    );
  }

  return (
    <Section header="Recently Played Tracks">
      {tracks.length === 0 ? (
        <div className="empty-state">No recent tracks found</div>
      ) : (
        <List>
          {tracks.map((track, index) => (
            <RadioTrackInfo
              key={index}
              name={track.name}
              index={0}
              time={track.time}
            />
          ))}
        </List>
      )}
    </Section>
  );
};

export default RadioTrackHistory;
