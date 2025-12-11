import apiClient from "./axiosConfig";
import { User } from "../types/types";
import { AxiosError } from "axios";

export const authService = {
  fetchUser: async (): Promise<User | null> => {
    try {
      const { data } = await apiClient.get("/user");
      return { ...data, roles: data.roles ?? [] }; // ✅ Ensure roles exist
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Error fetching user.");
      }
      throw new Error("Unexpected error. Please try again.");
    }
  },

  login: async (email: string, password: string): Promise<User> => {
    try {
      const { data } = await apiClient.post("/login", { email, password });

      console.log("✅ Login response:", data);

      // Access user from the nested token.original structure
      const user = data.token?.original?.user || data.user;

      if (!user) {
        throw new Error("User data not found in response");
      }

      return { ...user, roles: user.roles ?? [] };
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
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  },
};