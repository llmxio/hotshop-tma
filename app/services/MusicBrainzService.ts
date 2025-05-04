import {
  MusicBrainzApi,
  type IArtist,
  type IArtistMatch,
  type IRecording,
  type Gender,
  type IRelease,
} from "musicbrainz-api";
import type { RadioTrackInfoProps } from "@/components/Radio";

// Define types for the service responses
export interface ArtistInfo extends Partial<IArtist> {
  name: string;
  mbid: string;
  bio?: string;
  country?: string;
  type: string;
  gender?: Gender;
  genres?: string[];
}

export interface AlbumInfo extends Partial<IRelease> {
  name: string;
  mbid: string;
  year?: string;
  cover?: string;
  trackCount?: number;
  type?: string;
}

export interface TrackInfo extends Partial<IRecording> {
  name: string;
  mbid?: string;
  duration?: number;
  position?: number;
  artistMbid?: string;
  albumMbid?: string;
  genres?: string[];
}

/**
 * Configuration options for the MusicBrainz API client
 */
export interface MusicBrainzServiceConfig {
  appName: string;
  appVersion: string;
  appContactInfo: string;
  userAgent?: string;
}

/**
 * Default configuration for MusicBrainz API
 */
const DEFAULT_CONFIG: MusicBrainzServiceConfig = {
  appName: "HotShop-TMA",
  appVersion: "1.0.0",
  appContactInfo: "info@llmx.io",
};

/**
 * Service class for interacting with MusicBrainz API
 * Provides methods to search for artists, albums, covers, bio and genre information
 */
export class MusicBrainzService {
  private api: MusicBrainzApi;
  private coverArtBaseUrl = "https://coverartarchive.org";
  private wikidataBaseUrl = "https://www.wikidata.org/wiki/Special:EntityData";

  /**
   * Constructor for the MusicBrainzService
   * @param config Configuration options for the API client
   */
  constructor(config: Partial<MusicBrainzServiceConfig> = {}) {
    // Merge default config with provided config
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };

    // Initialize API with provided configuration
    this.api = new MusicBrainzApi({
      appName: mergedConfig.appName,
      appVersion: mergedConfig.appVersion,
      appContactInfo: mergedConfig.appContactInfo,
      // baseUrl: mergedConfig.baseUrl,
    });
  }

  /**
   * Search for an artist by name
   * @param artistName Name of the artist to search for
   * @returns Promise with artist search results
   */
  async searchArtist(artistName: string): Promise<ArtistInfo | null> {
    try {
      console.log(`searching for artist: ${artistName}`);

      const response = await this.api.search("artist", { query: artistName });

      console.log("Artist search response:", response);

      if (response.artists && response.artists.length > 0) {
        const artist = response.artists[0];
        return {
          name: artist.name,
          mbid: artist.id,
          country: artist.country,
          type: artist.type,
          gender: artist["gender"],
          // genres: artist.tags?.map((tag: { name: string }) => tag.name) || [],
        };
      }
    } catch (error) {
      console.error("Error searching for artist:", error);
    }

    return null;
  }

  /**
   * Get artist information by MBID (MusicBrainz ID)
   * @param mbid MusicBrainz ID of the artist
   * @returns Promise with artist details
   */
  async getArtistById(mbid: string): Promise<ArtistInfo | null> {
    try {
      const artist = await this.api.lookup("artist", mbid, [
        "recordings",
        "releases",
      ]);

      // Extract Wikipedia/Wikidata links for bio fetching
      let wikiDataId = null;

      if (artist.relations) {
        const wikiDataRel = artist.relations.find(
          (rel) => rel.type === "wikidata"
        );
        if (wikiDataRel && wikiDataRel.url) {
          wikiDataId = wikiDataRel.url.resource.split("/").pop();
        }
      }

      // Fetch bio from Wikidata if available
      let bio = undefined;

      if (wikiDataId) {
        bio = await this.fetchArtistBio(wikiDataId);
      }

      return {
        name: artist.name,
        mbid: artist.id,
        bio: bio,
        country: artist.country,
        type: artist.type,
        gender: artist["gender"],
        // genres: artist.tags?.map((tag) => tag.name) || [],
      };
    } catch (error) {
      console.error("Error getting artist by ID:", error);
      return null;
    }
  }

  /**
   * Search for albums by artist MBID
   * @param artistMbid MusicBrainz ID of the artist
   * @param limit Maximum number of albums to return (default: 5)
   * @returns Promise with array of album info
   */
  async getAlbumsByArtistId(
    artistMbid: string | null,
    limit: number = 5
  ): Promise<AlbumInfo[]> {
    if (!artistMbid) {
      console.error("Artist MBID is null or undefined");
      return [];
    }

    try {
      const response = await this.api.browse(
        "release",
        {
          track_artist: artistMbid,
          limit: 0,
          offset: 0,
          // type: "album",
        },
        ["url-rels", "isrcs", "recordings"]
      );

      const albums: AlbumInfo[] = [];

      for (const release of response["releases"]) {
        const album: AlbumInfo = {
          name: release.title,
          mbid: release.id,
          // type: release["primary-type"],
          // year: release["first-release-date"]?.split("-")[0] || undefined,
        };

        // Add cover art if available
        try {
          const coverUrl = await this.getAlbumCoverUrl(release.id);
          if (coverUrl) {
            album.cover = coverUrl;
          }
        } catch (err) {
          // Continue even if cover art fetch fails
        }

        albums.push(album);
      }

      return albums;
    } catch (error) {
      console.error("Error getting albums by artist ID:", error);
      return [];
    }
  }

  /**
   * Look up a track by artist name and track title
   * @param artistName Name of the artist
   * @param trackTitle Title of the track
   * @returns Promise with track info
   */
  async lookupTrack(
    artistName: string,
    trackTitle: string
  ): Promise<TrackInfo | null> {
    try {
      const response = await this.api.search("recording", {
        query: `artist:"${artistName}" AND recording:"${trackTitle}"`,
        limit: 1,
      });

      if (response.recordings && response.recordings.length > 0) {
        const recording = response.recordings[0];

        return {
          name: recording.title,
          mbid: recording.id,
          duration: recording.length
            ? Math.floor(recording.length / 1000)
            : undefined, // Convert from ms to seconds
          artistMbid: recording["artist-credit"]?.[0]?.artist?.id,
          // genres: recording.tags?.map((tag) => tag.name) || [],
        };
      }

      return null;
    } catch (error) {
      console.error("Error looking up track:", error);
      return null;
    }
  }

  /**
   * Get album cover art URL by album MBID
   * @param albumMbid MusicBrainz ID of the album
   * @returns Promise with cover art URL (or undefined if not found)
   */
  async getAlbumCoverUrl(albumMbid: string): Promise<string | undefined> {
    try {
      const url = `${this.coverArtBaseUrl}/release-group/${albumMbid}/front-500`;
      const response = await fetch(url, { method: "HEAD" });

      if (response.ok) {
        return url;
      }

      return undefined;
    } catch (error) {
      console.error("Error getting album cover:", error);
      return undefined;
    }
  }

  /**
   * Fetch artist biography from Wikidata
   * @param wikiDataId Wikidata ID
   * @returns Promise with biography text or undefined
   */
  private async fetchArtistBio(
    wikiDataId: string
  ): Promise<string | undefined> {
    try {
      const response = await fetch(
        `${this.wikidataBaseUrl}/${wikiDataId}.json`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch biography data");
      }

      const data = (await response.json()) as any;
      const entities = data.entities;

      if (entities && entities[wikiDataId]) {
        const entity = entities[wikiDataId];

        // Try to get English description, or fall back to any description
        const description =
          entity.descriptions?.en?.value ||
          (
            Object.values(entity.descriptions || {})[0] as
              | { value?: string }
              | undefined
          )?.value;

        return description;
      }

      return undefined;
    } catch (error) {
      console.error("Error fetching artist bio:", error);
      return undefined;
    }
  }

  /**
   * Get comprehensive artist and track information
   * Combines multiple API calls to provide full details
   * @param artistName Name of the artist
   * @param trackTitle Title of the track
   * @returns Promise with combined artist, track and albums info
   */
  async getFullTrackInfo(
    artistName: string,
    trackTitle: string
  ): Promise<{
    artist: ArtistInfo | null;
    track: TrackInfo | null;
    albums: AlbumInfo[];
  }> {
    let artistInfo: ArtistInfo | null = null;
    let trackInfo: TrackInfo | null = null;
    let albums: AlbumInfo[] = [];

    try {
      // First look up the artist
      artistInfo = await this.searchArtist(artistName);

      if (artistInfo && artistInfo?.mbid) {
        // Get full artist info including bio
        artistInfo = await this.getArtistById(artistInfo.mbid);

        // Get artist albums
        if (artistInfo && artistInfo.mbid) {
          albums = await this.getAlbumsByArtistId(artistInfo.mbid, 5);
        }

        // Look up the track
        trackInfo = await this.lookupTrack(artistName, trackTitle);
      }
    } catch (error) {
      console.error("Error getting full track info:", error);
    }

    return {
      artist: artistInfo,
      track: trackInfo,
      albums: albums,
    };
  }
}

// Export singleton instance with default configuration
export const musicBrainzService = new MusicBrainzService(DEFAULT_CONFIG);

// Export default for cases where custom configuration is needed
export default MusicBrainzService;
