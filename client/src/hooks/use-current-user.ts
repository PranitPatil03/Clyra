import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const {
    isLoading: isQueryLoading,
    isError,
    data: user,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const response = await api.get("/auth/current-user");
        return response.data;
      } catch (error) {
        console.error("Auth error:", error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const isLoading = user === undefined;

  return { isLoading, isError, user };
};
