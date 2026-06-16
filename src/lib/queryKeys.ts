/**
 * Centralised React Query key factory.
 *
 * Usage:
 *   useQuery({ queryKey: queryKeys.users.all(), ... })
 *   useQuery({ queryKey: queryKeys.users.detail(id), ... })
 */

export const queryKeys = {
  users: {
    all: () => ['users'] as const,
    detail: (id: number | string) => ['users', id] as const,
  },
  // Add more resource keys here as you build out the app, e.g.:
  // products: {
  //   all: () => ['products'] as const,
  //   detail: (id: number | string) => ['products', id] as const,
  // },
} as const;
