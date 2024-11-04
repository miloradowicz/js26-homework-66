import { DateTime } from 'luxon';

import {
  ChangeEvent,
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid2 as Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';

import { MealTime } from '@/types.d';
import Api from '@/lib/api';

interface FormData {
  mealTime?: MealTime;
  description?: string;
  kCal?: string;
  intakeDateTime: DateTime;
}

const Editor = () => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    intakeDateTime: DateTime.now(),
  });
  const { id } = useParams();
  const navigate = useNavigate();

  const loadMeal = useCallback(async () => {
    if (id) {
      try {
        setLoading(true);

        const data = await Api.getMeal(id);

        if (data) {
          setFormData({
            mealTime: data.mealTime,
            description: data.description,
            kCal: data.kCal.toString(),
            intakeDateTime: data.intakeDateTime,
          });
        } else {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    }

    setLoaded(true);
  }, [id, navigate]);

  useEffect(() => {
    loadMeal();
  }, [id, loadMeal]);

  const handleSubmit: FormEventHandler = async (e) => {
    try {
      setLoading(true);

      e.preventDefault();

      if (
        formData.mealTime &&
        formData.description &&
        formData.kCal &&
        formData.intakeDateTime
      ) {
        if (id) {
          void (await Api.updateMeal(id, {
            mealTime: formData.mealTime,
            description: formData.description,
            kCal: Number.parseInt(formData.kCal),
            intakeDateTime: formData.intakeDateTime,
          }));
        } else {
          void (await Api.addMeal({
            mealTime: formData.mealTime,
            description: formData.description,
            kCal: Number.parseInt(formData.kCal),
            intakeDateTime: formData.intakeDateTime,
          }));

          navigate('/');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    setFormData((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <Typography component={'h5'} gutterBottom>
        {id ? 'Edit meal' : 'Add meal'}
      </Typography>
      <Grid container justifyContent='center'>
        <Grid size={{ xs: 12, sm: 6, lg: 5 }} position='relative'>
          <Box
            position='absolute'
            sx={{ left: 0, top: 0, right: 0, bottom: 0 }}
            visibility={!loaded ? 'visible' : 'hidden'}
            display='flex'
            justifyContent='center'
            alignItems='center'
            pb={10}
          >
            <CircularProgress />
          </Box>
          <Box visibility={loaded ? 'visible' : 'hidden'}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={1}>
                <FormControl>
                  <InputLabel id='demo-simple-select-label'>
                    Meal time
                  </InputLabel>
                  <Select
                    name='mealTime'
                    labelId='demo-simple-select-helper-label'
                    id='demo-simple-select-helper'
                    value={formData?.mealTime ?? ''}
                    label='Meal time'
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value={MealTime.Breakfast}>Breakfast</MenuItem>
                    <MenuItem value={MealTime.Snack}>Snack</MenuItem>
                    <MenuItem value={MealTime.Lunch}>Lunch</MenuItem>
                    <MenuItem value={MealTime.Dinner}>Dinner</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  name='description'
                  label='Description'
                  variant='outlined'
                  value={formData.description ?? ''}
                  onChange={handleChange}
                  required
                />
                <TextField
                  type='number'
                  name='kCal'
                  label='kCal'
                  variant='outlined'
                  value={formData.kCal ?? ''}
                  onChange={handleChange}
                  required
                />
                <DatePicker
                  label='Intake date'
                  value={formData.intakeDateTime}
                  onChange={(x) =>
                    setFormData((data) => ({
                      ...data,
                      intakeDateTime: x ?? DateTime.now(),
                    }))
                  }
                />
                <LoadingButton type='submit' loading={loaded && loading}>
                  Save
                </LoadingButton>
              </Stack>
            </form>
          </Box>
          <Button to='/' component={Link} sx={{ width: '100%' }}>
            Go back
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Editor;
