export const USER_SELECT = {
  id: true,
  username: true,
  first_name: true,
  last_name: true,
  phone: true,
  photo: true,
  role: true,
  status: true,
} as const;

export const USER_SELECT_WITH_DATES = {
  ...USER_SELECT,
  created_at: true,
  updated_at: true,
} as const;

export const USER_NAME_SELECT = {
  first_name: true,
  last_name: true,
} as const;

export const INCLUDE_USER = { user: { select: USER_SELECT } } as const;

export const INCLUDE_USER_WITH_DATES = { user: { select: USER_SELECT_WITH_DATES } } as const;

export const nameFilter = (name: string) => ({
  OR: [
    { first_name: { contains: name, mode: 'insensitive' as const } },
    { last_name: { contains: name, mode: 'insensitive' as const } },
    { username: { contains: name, mode: 'insensitive' as const } },
  ],
});
