import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/app/lib/api";

type MeResponse = {
  firstName: string | null;
};

export function useMe(enabled: boolean) {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => fetchJson<MeResponse>("/api/me", { cache: "no-store" }),
    enabled,
    refetchOnMount: "always",
    staleTime: 0,
  });
}
