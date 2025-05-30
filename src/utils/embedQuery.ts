import { pipeline } from "@xenova/transformers";

async function embedQuery(queryText: string) {
    console.log("Embedding query: ", queryText);
    const extractor = await pipeline("feature-extraction", "Supabase/gte-small");
    const output = await extractor(queryText, {
      pooling: "mean",
      normalize: true,
    });
  
    return Object.values(output.data); // Convert tensor to array
  }

  export default embedQuery;