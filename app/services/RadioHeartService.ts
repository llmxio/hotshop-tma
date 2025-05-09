import type { RadioSong } from "@/types/appTypes";
import { DEFAULT_ARTWORK } from "@/types/appTypes";

export type Track = {
  name: string;
  index?: number;
  time?: string;
};

export interface ApiResponse {
  tracks?: Track[];
  listeners?: number | string;
  [key: string]: any;
}

const BASE_API_URL = "https://a3.radioheart.ru/api/json";
const DEFAULT_USER = "user8039";

// Helper to parse URL
export function getLocation(href: string) {
  const match = href.match(
    /^(https?:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
  );
  return (
    match && {
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  );
}

// Helper functions to extract artist and title from song title
export function getArtistFromTitle(trackTitle: string): string {
  if (!trackTitle) return "";

  let split = trackTitle.split(" | ");

  if (split.length > 0) {
    return split[1].split("-")[0].trim();
  }

  return trackTitle;
}

export function getSongFromTitle(trackTitle: string): string {
  if (!trackTitle) return "";

  let split = trackTitle.split(" | ");

  if (split.length > 0) {
    return split[1].split("-")[1].trim();
  }

  return "";
}

export class RadioHeartService {
  private userLogin: string;

  constructor(userLogin: string = DEFAULT_USER) {
    this.userLogin = userLogin;
  }

  /**
   * Get recently played tracks
   * @param count Number of tracks to fetch (default: 10)
   * @returns Promise with tracks array
   */
  async getRecentTracks(count: number = 10): Promise<Track[]> {
    try {
      const url = this.buildApiUrl("lasttrack", count);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch track history: ${response.status}`);
      }

      const data = (await response.json()) as ApiResponse | Track[];

      // Handle API response format - it could return tracks directly or nested
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.tracks)) {
        return data.tracks;
      }

      console.warn("Unexpected API response format:", data);
      return [];
    } catch (error) {
      console.error("Error fetching recent tracks:", error);
      throw error;
    }
  }

  /**
   * Get upcoming tracks
   * @param count Number of tracks to fetch (default: 10)
   * @returns Promise with tracks array
   */
  async getUpcomingTracks(count: number = 10): Promise<Track[]> {
    try {
      const url = this.buildApiUrl("nexttrack", count);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch upcoming tracks: ${response.status}`);
      }

      const data = (await response.json()) as ApiResponse | Track[];

      // Handle API response format - it could return tracks directly or nested
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray(data.tracks)) {
        return data.tracks;
      }

      console.warn("Unexpected API response format:", data);
      return [];
    } catch (error) {
      console.error("Error fetching upcoming tracks:", error);
      throw error;
    }
  }

  /**
   * Get current listener count
   * @returns Promise with listener count
   */
  async getCurrentListeners(): Promise<number> {
    try {
      const url = this.buildApiUrl("current_listeners", 1);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch listener count: ${response.status}`);
      }

      const data = (await response.json()) as ApiResponse;

      if (data && data.listeners !== undefined) {
        // Cast listeners to number regardless of whether it's a string or number
        const listeners = Number(data.listeners);
        // Return 0 if conversion resulted in NaN
        return isNaN(listeners) ? 0 : listeners;
      }

      console.warn("Unexpected API response format:", data);
      return 0;
    } catch (error) {
      console.error("Error fetching listener count:", error);
      return 0;
    }
  }

  /**
   * Get artist image from external API
   * @param title Full song title string
   * @param defaultLogo Default image URL to use if fetch fails
   * @param onImageFetched Callback function that receives the image URL
   */
  getArtistImage(
    artist: string,
    title: string,
    defaultLogo: string,
    onImageFetched: (imageUrl: string) => void
  ): void {
    fetch(
      `https://image-fetcher.radioheart.ru/api/get-image?artist=${artist}&title=${title}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: any) => {
        if (data.image) {
          onImageFetched(data.image);
        } else {
          onImageFetched(defaultLogo);
        }
      })
      .catch((err) => {
        console.error(err);
        onImageFetched(defaultLogo);
      });
  }

  // Helper method to build API URLs
  private buildApiUrl(apiEndpoint: string, count: number): string {
    return `${BASE_API_URL}?userlogin=${this.userLogin}&count=${count}&api=${apiEndpoint}`;
  }
}

// Export a singleton instance with default configuration
export const radioHeartService = new RadioHeartService();

// Export default for cases where custom configuration is needed
export default RadioHeartService;
