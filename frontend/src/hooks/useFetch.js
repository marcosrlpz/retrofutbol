import { useEffect, useRef, useState } from "react";

const useFetch = (fetchFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const fetchData = async () => {
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
    };
    fetchData();
    return () => {
      isMounted.current = false;
    };
  }, dependencies);

  const refetch = async () => {
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
  };

  return { data, loading, error, refetch };
};

export default useFetch;