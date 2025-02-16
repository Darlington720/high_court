import { supabase, checkSupabaseConnection } from "./supabase";

export async function signUp(email: string, password: string) {
  const client = checkSupabaseConnection();

  try {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;

    // Create a profile in the users table
    if (data.user) {
      const { error: profileError } = await client.from("users").insert([
        {
          id: data.user.id,
          role: email === "admin@test.com" ? "admin" : "guest",
          subscription_tier: email === "admin@test.com" ? "platinum" : null,
        },
      ]);

      if (profileError) {
        console.error("Error creating user profile:", profileError);
        throw profileError;
      }
    }

    return { data, error: null };
  } catch (err) {
    console.error("Sign up error:", err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Sign up failed"),
    };
  }
}

export async function signIn(email: string, password: string) {
  const client = checkSupabaseConnection();

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error("Sign in error:", err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Sign in failed"),
    };
  }
}

export async function signOut() {
  const client = checkSupabaseConnection();
  return await client.auth.signOut();
}

export async function getCurrentUser() {
  const client = checkSupabaseConnection();
  const {
    data: { user },
  } = await client.auth.getUser();
  return user;
}

// Helper function to create test accounts
export async function createTestAccounts() {
  const accounts = [
    {
      email: "admin@test.com",
      password: "Test123#",
      role: "admin",
      tier: "platinum",
    },
    {
      email: "gold@test.com",
      password: "Test123#",
      role: "subscriber",
      tier: "gold",
    },
    {
      email: "silver@test.com",
      password: "Test123#",
      role: "subscriber",
      tier: "silver",
    },
    {
      email: "bronze@test.com",
      password: "Test123#",
      role: "subscriber",
      tier: "bronze",
    },
    {
      email: "guest1@test.com",
      password: "Test123#",
      role: "guest",
      tier: null,
    },
    {
      email: "guest2@test.com",
      password: "Test123#",
      role: "guest",
      tier: null,
    },
  ];

  for (const account of accounts) {
    try {
      // Sign up the user
      const { data, error } = await signUp(account.email, account.password);
      if (error) throw error;

      // Update their role and subscription tier
      if (data?.user) {
        const { error: updateError } = await supabase
          .from("users")
          .update({
            role: account.role,
            subscription_tier: account.tier,
          })
          .eq("id", data.user.id);

        if (updateError) throw updateError;
      }

      console.log(`Created account: ${account.email}`);
    } catch (err) {
      console.error(`Error creating account ${account.email}:`, err);
    }
  }
}
