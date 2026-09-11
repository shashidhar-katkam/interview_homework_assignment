import { ExecutionResult, GraphQLError } from 'graphql';
import { execute } from '../../../.mesh';
import { Args, NearEarthObject, NearEarthObjectFeed, RawNearEarthObject, RawNeoFeedResponse } from './types';

const NEO_FEED_QUERY = `
  query NeoFeed($startDate: String!, $endDate: String!) {
    neoFeed(startDate: $startDate, endDate: $endDate) {
      element_count
      near_earth_objects
    }
  }
`;

// Cache - 30 requests/hour, 50/day
const CACHE_MS = 5 * 60 * 1000;
const feedCache = new Map<string, { expiresAt: number; feed: RawNeoFeedResponse }>();

const fetchNeoFeed = async (args: Args): Promise<RawNeoFeedResponse> => {
  const cacheKey = `${args.startDate}:${args.endDate}`;
  const cached = feedCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.feed;
  }

  const result = (await execute(NEO_FEED_QUERY, args)) as ExecutionResult<{ neoFeed: RawNeoFeedResponse }>;

  if (result.errors?.length || !result.data?.neoFeed) {
    throw new GraphQLError('Failed to fetch Near Earth Object feed');
  }

  const feed = result.data.neoFeed;
  feedCache.set(cacheKey, { expiresAt: Date.now() + CACHE_MS, feed });
  return feed;
};

const mapNearEarthObject = (raw: RawNearEarthObject): NearEarthObject => {
  const closeApproach = raw.close_approach_data[0];
  return {
    id: raw.id,
    name: raw.name,
    isPotentiallyHazardousAsteroid: raw.is_potentially_hazardous_asteroid,
    estimatedDiameterMinKm: raw.estimated_diameter.kilometers.estimated_diameter_min,
    estimatedDiameterMaxKm: raw.estimated_diameter.kilometers.estimated_diameter_max,
    closeApproachDate: closeApproach?.close_approach_date,
    relativeVelocityKph: closeApproach?.relative_velocity.kilometers_per_hour,
    missDistanceKm: closeApproach?.miss_distance.kilometers,
  };
};

export const getNearEarthObjects = async (_: any, args: Args, context: any): Promise<NearEarthObjectFeed> => {
  context.logger.info('nearEarthObjects: Enter resolver');

  const feed = await fetchNeoFeed(args);

  const objects = Object.values(feed.near_earth_objects ?? {})
    .flat()
    .map(mapNearEarthObject);

  context.logger.info('nearEarthObjects: Returning feed');
  return {
    elementCount: feed.element_count,
    objects,
  };
};
