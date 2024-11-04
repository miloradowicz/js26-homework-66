import { DateTime } from 'luxon';

import { Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import { Meal } from '@/types';

interface Props {
  meals: Meal[];
}

const TrackerTotal: FC<Props> = ({ meals }) => {
  const [today] = useState(DateTime.now().startOf('day'));
  const [kCal, setKCal] = useState(0);

  useEffect(() => {
    const kCal = meals
      .filter(
        (x) =>
          x.intakeDateTime.valueOf() >= today.valueOf() &&
          x.intakeDateTime.valueOf() < today.plus({ days: 1 }).valueOf()
      )
      .reduce((sum, meal) => sum + meal.kCal, 0);

    setKCal(kCal);
  }, [meals, today]);

  return (
    <>
      <Typography>
        Today is <b>{today.toFormat('ccc, MMM dd, yyyy')}</b>
      </Typography>
      <Typography>Total calories today:</Typography>
      <Typography fontWeight='bold'>{kCal} kCal</Typography>
    </>
  );
};

export default TrackerTotal;
