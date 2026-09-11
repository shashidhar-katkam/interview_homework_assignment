export type Args = {
  startDate: string;
  endDate: string;
};

export type NearEarthObject = {
  id: string;
  name: string;
  isPotentiallyHazardousAsteroid: boolean;
  estimatedDiameterMinKm: number;
  estimatedDiameterMaxKm: number;
  closeApproachDate?: string;
  relativeVelocityKph?: string;
  missDistanceKm?: string;
};

export type NearEarthObjectFeed = {
  elementCount: number;
  objects: NearEarthObject[];
};

// Shapes of the NASA response
export type RawCloseApproachData = {
  close_approach_date: string;
  relative_velocity: {
    kilometers_per_hour: string;
  };
  miss_distance: {
    kilometers: string;
  };
};

export type RawNearEarthObject = {
  id: string;
  name: string;
  is_potentially_hazardous_asteroid: boolean;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  close_approach_data: RawCloseApproachData[];
};


export type RawNeoFeedResponse = {
  element_count: number;
  near_earth_objects: Record<string, RawNearEarthObject[]>;
};
