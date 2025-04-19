import { supabase } from "./supabase";

export async function logSearch(
  searchTerm: string,
  userId: string | undefined,
  resultsCount: number,
  searchTime: number
) {
  try {
    const { error } = await supabase.from("search_logs").insert({
      search_term: searchTerm,
      user_id: userId,
      results_count: resultsCount,
      search_time: searchTime,
    });

    if (error) throw error;
  } catch (error) {
    console.error("Error logging search:", error);
  }
}
