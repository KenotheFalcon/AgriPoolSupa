'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { geocodeAddress, reverseGeocode } from '@/lib/geo'; // Assume reverseGeocode exists

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface MapPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

export function MapPicker({ onLocationSelect }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number]>([9.082, 8.6753]); // Default to Nigeria
  const [address, setAddress] = useState('');
  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = useMemo(
    () => ({
      async dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
          const fetchedAddress = await reverseGeocode(lat, lng);
          if (fetchedAddress) {
            setAddress(fetchedAddress);
            onLocationSelect({ lat, lng, address: fetchedAddress });
          }
        }
      },
    }),
    [onLocationSelect]
  );

  const handleSearch = useCallback(
    async (searchAddress: string) => {
      const coords = await geocodeAddress(searchAddress);
      if (coords) {
        setPosition([coords.latitude, coords.longitude]);
        setAddress(searchAddress);
        onLocationSelect({ lat: coords.latitude, lng: coords.longitude, address: searchAddress });
      }
    },
    [onLocationSelect]
  );

  return (
    <div className='space-y-4'>
      <div>
        <input
          type='text'
          placeholder='Search for an address'
          onChange={(e) => setAddress(e.target.value)}
          onBlur={(e) => handleSearch(e.target.value)}
          className='w-full p-2 border rounded'
        />
      </div>
      <MapContainer
        center={position}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef}>
          <Popup>
            Drag the marker to the pickup location. <br />
            {address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
