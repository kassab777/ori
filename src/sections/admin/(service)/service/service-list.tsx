import type { BoxProps } from '@mui/material/Box';
import type { IServiceItem } from 'src/types/service';

import Box from '@mui/material/Box';

import { MotionViewport } from 'src/components/animate';

import ServiceItem from './service-item';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  data: IServiceItem[];
};

export default function ServiceList({ data, ...other }: Props) {
  const renderList = (
    <>
      {data?.map((product, index) => (
        <MotionViewport
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.5, duration: 0.5 }}
        >
          <ServiceItem key={product.id} currentItem={product} />{' '}
        </MotionViewport>
      ))}
    </>
  );

  return (
    <Box
      gap={4}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      }}
      {...other}
    >
      {renderList}
    </Box>
  );
}
