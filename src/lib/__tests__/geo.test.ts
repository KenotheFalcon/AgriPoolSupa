import { getDistanceFromLatLonInKm } from '../geo';

describe('getDistanceFromLatLonInKm', () => {
  it('should return 0 for the same point', () => {
    expect(getDistanceFromLatLonInKm(0, 0, 0, 0)).toBe(0);
  });

  it('should return the correct distance for known points', () => {
    // Distance from Paris to London
    const lat1 = 48.8566;
    const lon1 = 2.3522;
    const lat2 = 51.5074;
    const lon2 = -0.1278;
    const distance = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
    expect(distance).toBeCloseTo(343.5, 0); // Approximately 343.5 km
  });
});
