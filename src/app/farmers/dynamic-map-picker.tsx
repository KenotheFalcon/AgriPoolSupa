import dynamic from 'next/dynamic';

const DynamicMapPicker = dynamic(() => import('./map-picker').then((mod) => mod.MapPicker), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default DynamicMapPicker;
