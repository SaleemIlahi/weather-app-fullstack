import { useState, useCallback, useRef } from "react";
import { getApi } from "../utils/api";

type HttpMethod = "GET";

interface ApiError {
  status: number;
  message: string;
}

export const useApi = () => {
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);
  const activeRequests = useRef(0);

  const request = useCallback(
    async <Res>(
      method: HttpMethod,
      endpoint: string,
      type: string = ""
    ): Promise<Res> => {
      activeRequests.current += 1;
      setLoading(true);
      setError(null);

      try {
        if (method !== "GET") {
          throw new Error("Unsupported HTTP method");
        }

        return await getApi<Res>(endpoint, type);
      } catch (err: any) {
        const apiError: ApiError = {
          status: err?.response?.data?.status ?? 500,
          message: err?.response?.data?.message ?? "Something went wrong",
        };

        setError(apiError);
        throw apiError;
      } finally {
        activeRequests.current -= 1;

        if (activeRequests.current === 0) {
          setLoading(false);
        }
      }
    },
    []
  );

  return { error, loading, request };
};
