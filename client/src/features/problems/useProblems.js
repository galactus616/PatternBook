import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProblems, fetchTopics, updateProblemProgress } from "./problems.api";

export const useProblems = (filters = {}) => {
  return useQuery({
    queryKey: ["problems", filters.topic], // Only depend on topic for fetching
    queryFn: () => fetchProblems(filters),
    select: (res) => res.data,
  });
};

export const useTopics = () => {
  return useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
    select: (res) => res.data,
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProblemProgress,
    onMutate: async (newProgress) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["problems"] });

      // Snapshot the previous value
      const previousProblems = queryClient.getQueryData(["problems"]);

      // Optimistically update to the new value
      queryClient.setQueriesData({ queryKey: ["problems"] }, (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((prob) =>
            prob.id === newProgress.problemId
              ? {
                  ...prob,
                  progress: [{ 
                    ...(prob.progress?.[0] || {}), 
                    status: newProgress.status || prob.progress?.[0]?.status || 'NOT_STARTED',
                    notes: newProgress.notes !== undefined ? newProgress.notes : prob.progress?.[0]?.notes
                  }],
                }
              : prob
          ),
        };
      });

      return { previousProblems };
    },
    onError: (err, newProgress, context) => {
      queryClient.setQueriesData({ queryKey: ["problems"] }, context.previousProblems);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
  });
};
