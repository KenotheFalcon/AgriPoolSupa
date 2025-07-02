const GEOCODING_API_URL = 'https://geocode.maps.co/search';

interface GeoPoint {
  latitude: number;
  longitude: number;
}

export async function geocodeAddress(address: string): Promise<GeoPoint | null> {
  if (!process.env.GEOCODING_API_KEY) {
    console.error('Geocoding API key is missing.');
    // In a real app, you might want to return an error or have a fallback.
    return null;
  }

  try {
    const response = await fetch(
      `${GEOCODING_API_URL}?q=${encodeURIComponent(address)}&api_key=${
        process.env.GEOCODING_API_KEY
      }`
    );

    if (!response.ok) {
      throw new Error(`Geocoding API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      return {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      };
    }

    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  if (!process.env.GEOCODING_API_KEY) {
    console.error('Geocoding API key is missing.');
    return null;
  }

  try {
    const response = await fetch(
      `${GEOCODING_API_URL}/reverse?lat=${lat}&lon=${lng}&api_key=${process.env.GEOCODING_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data?.display_name || null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}

// Haversine formula to calculate distance between two points in km
export function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
