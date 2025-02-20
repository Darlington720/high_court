import { checkSupabaseConnection, supabase } from "./supabase";

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
    // const { data: users, error } = await supabase.rpc("fetch_users_with_auth");

    // const { data: _users, error: _usersError } = await supabase
    //   .from("_users")
    //   .select()
    //   .limit(100);

    const { data: _users, error: _usersError } = await supabase.rpc(
      "fetch_users_with_auth"
    );

    if (_usersError) {
      console.error("Error fetching _users:", _usersError);
    }

    // if (_usersError) {
    //   console.error("Error fetching _users:", _usersError);
    // } else {
    //   // Fetch emails from auth.users based on the ids from _users
    //   const enrichedUsers = await Promise.all(
    //     _users.map(async (user) => {
    //       const { data: authData, error: authError } =
    //         await supabase.auth.getUser();

    //       if (authError) {
    //         console.error("Error fetching email:", authError);
    //       }

    //       return { ...user, email: authData.user?.email };
    //     })
    //   );

    //   // console.log("Enriched Users with Emails:", enrichedUsers);

    //   users = enrichedUsers;
    // }

    // console.log("users", _users);
    // console.log("error", error);

    // if (error) throw error;

    // Transform the data to match our interface
    return _users?.map((user: any) => ({
      id: user.id,
      // name: user.email?.split("@")[0] || "Unknown User",
      name: user?.display_name || "Unknown User",
      email: user?.email || "unknown@example.com",
      role: user.user_role,
      status: user.status || "active",
      subscriptionTier: user.subscription_tier,
      lastLogin: user?.last_sign_in_at || user.created_at,
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
      .from("_users")
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
    const { error } = await supabase.from("_users").delete().eq("id", id);
    // const { error: auth_error } = await supabase.rpc("delete_user_by_id", {
    //   user_id: id,
    // });

    if (error) throw error;
    // if (auth_error) throw auth_error;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function getUserStats() {
  try {
    const { data: users, error } = await supabase.from("_users").select("*");

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

export async function signUpUser(email: string, password: string) {
  try {
    let { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error signing up user", error);
    throw error;
  }
}

export async function createUser(user_id: string, _data: User) {
  try {
    const { data, error } = await supabase
      .from("_users")
      .insert([
        {
          user_role: _data.role,
          subscription_tier: _data.subscriptionTier,
          id: user_id,
          display_name: _data.name,
        },
      ])
      .select();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error signing up user", error);
    throw error;
  }
}
