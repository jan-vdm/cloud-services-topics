import { useEffect, useState } from 'react';

const isBrowser = typeof window !== 'undefined';

export function useWS() {
  const [lines, setLines] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let s: any;
    if (isBrowser) {
      s = setInterval(async () => {
        const response = await fetch('http://localhost:3001/', {
          method: 'GET',
        });
        const json = await response.json();

        setLines(json.lines ?? []);
        setItems(json.items ?? []);
      }, 1000);
    }

    return () => {
      s && clearInterval(s);
    };
  }, []);

  return [lines, items];
}
