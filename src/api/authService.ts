import apiClient from "./axiosConfig";
import { User } from "../types/types";
import { AxiosError } from "axios";

const TOKEN_KEY = "auth_token";

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const authService = {
  fetchUser: async (): Promise<User | null> => {
    const token = getToken();
    if (!token) return null;

    try {
      const { data } = await apiClient.get("/user");
      return { ...data, roles: data.roles ?? [] };
    } catch (error) {
      if (error instanceof AxiosError) {
        // Clear stale token on 401/419
        if (error.response?.status === 401 || error.response?.status === 419) {
          clearToken();
          return null;
        }
        throw new Error(error.response?.data?.message || "Error fetching user.");
      }
      throw new Error("Unexpected error. Please try again.");
    }
  },

  login: async (email: string, password: string): Promise<User> => {
    try {
      const { data } = await apiClient.post("/login", { email, password });

      const token: string | undefined =
        typeof data === "string"
          ? data
          : data?.token || data?.access_token || data?.data?.token;

      if (!token) {
        throw new Error("Token not received from server");
      }

      setToken(token);

      // If backend also returns user, use it; otherwise fetch user
      const inlineUser = data?.user as User | undefined;
      if (inlineUser) {
        return { ...inlineUser, roles: inlineUser.roles ?? [] };
      }

      const user = await authService.fetchUser();
      if (!user) {
        throw new Error("User data not found after login");
      }

      return user;
    } catch (error) {
      console.error("❌ Login error:", error);

      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Invalid credentials.");
      }

      throw new Error("Unexpected error. Please try again.");
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      clearToken();
      window.location.href = "/login";
    }
  },

  clearToken,
};