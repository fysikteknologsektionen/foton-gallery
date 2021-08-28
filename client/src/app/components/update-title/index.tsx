import {useLayoutEffect} from 'react';
import {useLocation} from 'react-router-dom';

/**
 * Component that registers a history listener for updating the page title
 * @returns null
 */
export const UpdateTitle: React.VFC = () => {
  const {pathname} = useLocation();

  useLayoutEffect(() => {
    setTimeout(() => {
      document.title = `${
        document.getElementsByTagName('h1').item(0)?.innerHTML ?? 'Galleri'
      } | Foton`;
    }, 100);
  }, [pathname]);

  return null;
};
