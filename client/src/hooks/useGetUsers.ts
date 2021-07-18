import {User} from '../interfaces';
import {useFetch} from '../hooks/useFetch';

/**
 * Fetches an array of all users
 * @returns Array of users
 */
export function useGetUsers(): User[] | undefined {
  const users = useFetch<User[]>({
    url: '/api/users',
    config: {withCredentials: true},
    errorMessage: 'Det gick inte att hämta användardata. Försök igen senare.',
  });
  return users;
}
