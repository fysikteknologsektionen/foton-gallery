import {Album} from '../../interfaces';
import {useFetch} from '../hooks/useFetch';
import {useParams} from 'react-router-dom';

/**
 * Fetches an album using date & string from router params
 * @returns Album object
 */
export function useGetAlbum(): Album | undefined {
  const {date, slug} = useParams<{date: string; slug: string}>();
  const album = useFetch<Album>({
    url: `/api/albums/${date}/${slug}`,
  });
  return album;
}
