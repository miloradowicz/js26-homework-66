import { DateTime } from 'luxon';
import { FC, memo, useState } from 'react';

import {
  Card,
  CardActions,
  CardContent,
  Grid2 as Grid,
  Stack,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  id: string;
  mealTime: string;
  description: string;
  kCal: number;
  intakeDateTime: DateTime;
  onEdit: (_: string) => void;
  onDelete: (_: string) => void;
}

const MealCard: FC<Props> = ({
  id,
  mealTime,
  description,
  kCal,
  intakeDateTime,
  onEdit,
  onDelete,
}) => {
  const [deleting, setDeleting] = useState(false);

  return (
    <>
      <Card variant='outlined'>
        <Grid container>
          <Grid size={{ xs: 10, md: 11 }}>
            <CardContent>
              <Grid container>
                <Grid size={{ xs: 4, md: 3 }}>
                  <Typography>
                    {intakeDateTime.toFormat('ccc, MMM dd, yyyy')}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 7, md: 8 }}>
                  <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                    {mealTime}
                  </Typography>
                  <Typography variant='body2'>{description}</Typography>
                </Grid>
                <Grid size={1}>
                  <Typography>{kCal}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
          <Grid size={{ xs: 2, md: 1 }}>
            <CardActions>
              <Stack>
                <LoadingButton onClick={() => onEdit(id)}>
                  <EditIcon />
                </LoadingButton>
                <LoadingButton
                  onClick={() => {
                    setDeleting(true);
                    onDelete(id);
                  }}
                  loading={deleting}
                >
                  <DeleteIcon />
                </LoadingButton>
              </Stack>
            </CardActions>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default memo(
  MealCard,
  (prev, next) =>
    prev.id === next.id &&
    prev.mealTime === next.mealTime &&
    prev.description === next.description &&
    prev.kCal === next.kCal &&
    prev.intakeDateTime.valueOf() === next.intakeDateTime.valueOf() &&
    prev.onEdit === next.onEdit &&
    prev.onDelete === next.onDelete
);
