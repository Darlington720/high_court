import { supabase } from "./supabase";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "subscriber" | "guest";
  status: "active" | "inactive";
  subscriptionTier: "bronze" | "silver" | "gold" | "platinum" | null;
  lastLogin: string;
  createdAt: string;
  metadata?: {
    loginCount?: number;
    lastIp?: string;
    lastLocation?: string;
    lastDevice?: string;
    lastBrowser?: string;
  };
}

export async function fetchUsers() {
  try {
    // Get users from the public.users table with a join to auth.users
    const { data: users, error } = await supabase
      .from("users")
      .select(
        `
        *,
        auth_user:id (
          email,
          last_sign_in_at,
          created_at
        )
      `
      )
      .order("created_at", { ascending: false });

    console.log("error", error);

    if (error) throw error;

    // Transform the data to match our interface
    return users.map((user) => ({
      id: user.id,
      name: user.auth_user?.email?.split("@")[0] || "Unknown User",
      email: user.auth_user?.email || "unknown@example.com",
      role: user.role,
      status: user.status || "active",
      subscriptionTier: user.subscription_tier,
      lastLogin: user.auth_user?.last_sign_in_at || user.created_at,
      createdAt: user.created_at,
      metadata: {
        loginCount: user.metadata?.login_count || 0,
        lastIp: user.metadata?.last_ip,
        lastLocation: user.metadata?.last_location,
        lastDevice: user.metadata?.last_device,
        lastBrowser: user.metadata?.last_browser,
      },
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function updateUser(id: string, updates: Partial<User>) {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        role: updates.role,
        status: updates.status,
        subscription_tier: updates.subscriptionTier,
        metadata: {
          login_count: updates.metadata?.loginCount,
          last_ip: updates.metadata?.lastIp,
          last_location: updates.metadata?.lastLocation,
          last_device: updates.metadata?.lastDevice,
          last_browser: updates.metadata?.lastBrowser,
        },
      })
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(id: string) {
  try {
    // Delete from users table
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function getUserStats() {
  try {
    const { data: users, error } = await supabase.from("users").select("*");

    if (error) throw error;

    const activeUsers = users.filter((u) => u.status === "active");
    const subscribedUsers = users.filter((u) => u.subscription_tier);

    return {
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      subscribedUsers: subscribedUsers.length,
      conversionRate: (subscribedUsers.length / users.length) * 100,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}
