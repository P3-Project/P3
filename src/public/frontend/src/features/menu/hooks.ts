import { useQuery } from "@tanstack/react-query";
import { getMenu } from "./api";
import type { MenuItem } from "./types";

export const menuKeys = {
    all: ["menu"] as const,
};

export function useMenu() {
    return useQuery({ queryKey: menuKeys.all, queryFn: getMenu });
}

export function groupByCategory(items: MenuItem[]) {
  const groups = new Map<string, MenuItem[]>();
  for (const item of items) {
    const list = groups.get(item.category) ?? [];
    list.push(item);
    groups.set(item.category, list);
  }
  return groups;
}