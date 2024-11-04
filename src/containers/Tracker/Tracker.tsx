import { inPlaceSort } from 'fast-sort';
import {
  Box,
  Button,
  CircularProgress,
  Grid2 as Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Meal } from '@/types';
import Api from '@/lib/api.ts';

import TrackerTotal from '@/components/TrackerTotal/TrackerTotal';
import MealCard from '@/components/MealCard/MealCard';

const Tracker = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadMeals = useCallback(async () => {
    try {
      setLoading(true);

      const data = await Api.getMeals();
      inPlaceSort(data).desc((u) => u.intakeDateTime);

      setMeals(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  const editMeal = useCallback(
    (id: string) => {
      navigate(`/meals/${id}`);
    },
    [navigate]
  );

  const deleteMeal = useCallback(
    async (id: string) => {
      void (await Api.deleteMeal(id));

      await loadMeals();
    },
    [loadMeals]
  );

  return (
    <>
      <Grid container justifyContent='space-between' py={2}>
        <Grid size={6}>
          <TrackerTotal meals={meals} />
        </Grid>
        <Grid>
          <Button to='/meals/new' component={Link}>
            Add meal
          </Button>
        </Grid>
      </Grid>
      {!meals.length ? (
        <Box display='flex' justifyContent='center' alignItems='center'>
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography>No meals yet.</Typography>
          )}
        </Box>
      ) : (
        <Stack spacing={1}>
          {meals.map((x) => (
            <MealCard
              key={x.id}
              id={x.id}
              mealTime={x.mealTime}
              description={x.description}
              kCal={x.kCal}
              intakeDateTime={x.intakeDateTime}
              onEdit={editMeal}
              onDelete={deleteMeal}
            />
          ))}
        </Stack>
      )}
    </>
  );
};

export default Tracker;
