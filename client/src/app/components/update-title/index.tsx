import {useEffect} from 'react';
import {useHistory} from 'react-router-dom';

/**
 * Component that registers a history listener for updating the page title
 * @returns null
 */
export const UpdateTitle: React.VFC = () => {
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen(() => {
      setTimeout(() => {
        document.title = `${
          document.getElementsByTagName('h1').item(0)?.innerHTML ?? 'Galleri'
        } | Foton`;
      }, 100);
    });
    return unlisten;
  }, [history]);

  return null;
};
