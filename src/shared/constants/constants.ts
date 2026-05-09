// Сообщения валидации и ошибок

export const VALIDATION_MESSAGES = {
  REQUIRED_LOGIN: 'Это обязательное поле',
  REQUIRED_PASSWORD: 'Это обязательное поле',
  INVALID_CREDENTIALS: 'Неправильный логин или пароль',
  REQUEST_ERROR: 'Ошибка при выполнении запроса',
} as const;

// Меню аккаунта клиента

export const ACCOUNT_MENU_ITEMS = [
  { id: '1', title: 'Мои заказы' },
  { id: '2', title: 'Поддержка' },
  { id: '3', title: 'Адреса' },
  { id: '4', title: 'О сервисе' },
  { id: '5', title: 'Способы оплаты' },
] as const;

// Меню аккаунта ресторана

export const RESTAURANT_MENU_ITEMS = [
  { id: '1', title: 'Наше меню' },
  { id: '2', title: 'Поддержка' },
  { id: '3', title: 'Уведомления' },
  { id: '4', title: 'О сервисе' },
] as const;

// Названия дней недели для доставки

export const DAY_NAMES: Record<number, string> = {
  1: 'понедельник',
  2: 'вторник',
  3: 'среду',
  4: 'четверг',
  5: 'пятницу',
};

// Маппинг фильтров главного экрана

export const FILTER_MAPPING: Record<string, string> = {
  горячее: 'Горячее',
  салаты: 'Салаты',
  десерты: 'Десерты',
  закуски: 'Бизнес-ланч',
  новинки: 'Новинки',
};
