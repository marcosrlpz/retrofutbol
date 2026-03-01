import { useEffect, useRef, useState, useCallback } from "react";

const useFetch = (fetchFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      if (isMounted.current) setData(result);
    } catch (err) {
      if (isMounted.current) setError(err.response?.data?.message || "Error al cargar los datos");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    isMounted.current = true;
    fetchData();
    return () => { isMounted.current = false; };
  }, dependencies);

  return { data, setData, loading, error, refetch: fetchData };
};

export default useFetch;