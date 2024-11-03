import axios from 'axios';
import { DateTime } from 'luxon';

import { Identifiable, Meal, MealBody } from '../types';
import { HttpError } from './errors/HttpError';

interface ApiId {
  get name(): string;
}

type ApiMealBody = Omit<MealBody, 'intakeDateTime'> & {
  intakeTimestamp: number;
};

type ApiMealContainer = {
  [name: string]: ApiMealBody;
};

const baseUrl =
  'https://js26-na-default-rtdb.europe-west1.firebasedatabase.app/hw-66';

const getMeals = async (from?: DateTime, to?: DateTime): Promise<Meal[]> => {
  const endpoint = 'meals.json';

  let params:
    | {
        orderBy?: string;
        startAt?: number;
        endAt?: number;
      }
    | undefined;

  if (from) {
    params = {
      orderBy: 'intakeTimestamp',
      startAt: from.toMillis(),
    };

    if (to) {
      params.endAt = from.toMillis();
    }
  }

  const { data, status, statusText } = await axios.get<ApiMealContainer | null>(
    new URL(endpoint, baseUrl).href,
    { params }
  );

  if (status !== 200) {
    throw new HttpError(status, statusText);
  }

  return (
    (data &&
      Object.entries(data).map(([id, data]): Meal => {
        const { intakeTimestamp, ...rest } = data;
        return {
          id,
          ...rest,
          intakeDateTime: DateTime.fromMillis(intakeTimestamp),
        };
      })) ||
    []
  );
};

const addMeal = async (meal: Meal): Promise<Identifiable> => {
  const endpoint = 'meals.json';

  const { data, status, statusText } = await axios.post<ApiId>(
    new URL(endpoint, baseUrl).href,
    (() => {
      const { intakeDateTime, ...rest } = meal;
      return { ...rest, intakeTimestamp: intakeDateTime.toMillis() };
    })()
  );

  if (status !== 200) {
    throw new HttpError(status, statusText);
  }

  return (() => {
    const { name, ...rest } = data;
    return { ...rest, id: name };
  })();
};

const getMeal = async (id: string): Promise<Meal | null> => {
  const endpoint = `meals/${id}.json`;

  const { data, status, statusText } = await axios.get<ApiMealBody | null>(
    new URL(endpoint, baseUrl).href
  );

  if (status !== 200) {
    throw new HttpError(status, statusText);
  }

  return (
    (data &&
      (() => {
        const { intakeTimestamp, ...rest } = data;
        return {
          id,
          ...rest,
          intakeDateTime: DateTime.fromMillis(intakeTimestamp),
        };
      })()) ||
    null
  );
};

const updateMeal = async (id: string, mealBody: MealBody): Promise<Meal> => {
  const endpoint = `meals/${id}.json`;

  const { data, status, statusText } = await axios.put<ApiMealBody>(
    new URL(endpoint, baseUrl).href,
    (() => {
      const { intakeDateTime, ...rest } = mealBody;
      return { ...rest, intakeTimestamp: intakeDateTime.toMillis() };
    })()
  );

  if (status !== 200) {
    throw new HttpError(status, statusText);
  }

  return (() => {
    const { intakeTimestamp, ...rest } = data;
    return {
      id,
      ...rest,
      intakeDateTime: DateTime.fromMillis(intakeTimestamp),
    };
  })();
};

const deleteMeal = async (id: string): Promise<void> => {
  const endpoint = `meals/${id}.json`;

  const { status, statusText } = await axios.delete(
    new URL(endpoint, baseUrl).href
  );

  if (status !== 200) {
    throw new HttpError(status, statusText);
  }
};

export default {
  getMeals,
  addMeal,
  getMeal,
  updateMeal,
  deleteMeal,
};
