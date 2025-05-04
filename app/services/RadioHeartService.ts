/**
 * RadioHeartService - Service for handling RadioHeart API calls
 */

import { useCallback, useEffect, useState } from "react";
import type { RadioTrackInfoProps } from "@/components/Radio/RadioTrackInfo";

export type Track = RadioTrackInfoProps;

export interface ApiResponse {
  tracks?: Track[];
  listeners?: number | string; // Updated to accept both number and string
  [key: string]: any;
}

const BASE_API_URL = "https://a3.radioheart.ru/api/json";
const DEFAULT_USER = "user8039";

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

  // Helper method to build API URLs
  private buildApiUrl(apiEndpoint: string, count: number): string {
    return `${BASE_API_URL}?userlogin=${this.userLogin}&count=${count}&api=${apiEndpoint}`;
  }
}

// Export a singleton instance with default configuration
export const radioHeartService = new RadioHeartService();

// Export default for cases where custom configuration is needed
export default RadioHeartService;
