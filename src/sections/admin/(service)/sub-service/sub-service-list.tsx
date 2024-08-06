import type { BoxProps } from '@mui/material/Box';
import type { ISubServiceItem } from 'src/types/service';

import Box from '@mui/material/Box';

import { MotionViewport } from 'src/components/animate';

import SubServiceItem from './sub-service-item';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  data: ISubServiceItem[];
  serviceId: string;
};

export default function SubServiceList({ data, serviceId, ...other }: Props) {
  const renderList = (
    <>
      {data?.map((product, index) => (
        <MotionViewport
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.5, duration: 0.5 }}
        >
          <SubServiceItem key={product.id} currentItem={product} serviceId={serviceId} />{' '}
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
