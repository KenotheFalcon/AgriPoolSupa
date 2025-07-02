import dynamic from 'next/dynamic';

const DynamicDisplayMap = dynamic(() => import('./display-map').then((mod) => mod.DisplayMap), {
  ssr: false,
  loading: () => <div className='h-[300px] w-full bg-muted rounded-lg animate-pulse' />,
});

export default DynamicDisplayMap;
