import { apiClient } from "@/lib/api-client";
import type { MenuItem } from "./types";

// GET /api/menu -> MenuItemController.all()
export const getMenu = () => apiClient<MenuItem[]>("/menu");