import { Weekday } from '../../entities/api/types/menu-types';

export const WEEKDAYS: Weekday[] = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];

export const getDateForWeekday = (weekday: Weekday): Date => {
  const dayIndexMap: Record<Weekday, number> = {
    Понедельник: 1,
    Вторник: 2,
    Среда: 3,
    Четверг: 4,
    Пятница: 5,
  };
  const today = new Date();
  const todayIndex = today.getDay();
  const targetIndex = dayIndexMap[weekday];
  let diff = targetIndex - todayIndex;
  if (diff < 0) diff += 7;
  const result = new Date(today);
  result.setDate(today.getDate() + diff);
  return result;
};

export const formatWeekdayDate = (weekday: Weekday): string => {
  const date = getDateForWeekday(weekday);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
};

export const getNearestWeekday = (): Weekday => {
  const today = new Date().getDay();
  if (today >= 1 && today <= 5) return WEEKDAYS[today - 1];
  return 'Понедельник';
};
