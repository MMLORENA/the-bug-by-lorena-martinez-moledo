export type ApiPaths = "base";

export const apiPartialPaths: Record<ApiPaths, string> = {
  base: "/bugs",
};

export const apiUrl = import.meta.env.VITE_API_URL;
