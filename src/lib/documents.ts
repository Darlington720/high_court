import { supabase } from "./supabase";
import type { Document, DocumentFilter, DocumentSort } from "../types";
import { getDocumentTypeFromExtension, isValidDocumentType } from "./constants";

export async function uploadDocument(
  file: File,
  category: string,
  subcategory: string,
  metadata: Partial<Document["metadata"]> = {}
) {
  try {
    console.log("running this block....");
    // Validate file type
    const documentType = getDocumentTypeFromExtension(file.name);
    if (!isValidDocumentType(documentType)) {
      throw new Error(
        "Invalid document type. Supported formats: PDF, DOC, DOCX, TXT, RTF, XLS, XLSX"
      );
    }

    console.log("documentType", documentType);

    // Determine the correct bucket based on category
    const bucketMap: Record<string, string> = {
      Hansards: "hansards",
      "Courts of Record": "judgements",
      "Acts of Parliament": "acts",
      "Statutory Instruments": "statutory",
      Gazettes: "gazettes",
      "7th Revised Edition": "revised",
      "Archival Materials": "archival_materials",
    };

    const bucketId = bucketMap[category];
    console.log("bucket id", bucketId);
    if (!bucketId) {
      throw new Error(`Invalid document category: ${category}`);
    }

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("user", user);
    if (userError) throw userError;
    if (!user) throw new Error("User not authenticated");

    // Check user permissions
    // const { data: userData, error: roleError } = await supabase
    //   .from("users")
    //   .select("role")
    //   .eq("id", user.id)
    //   .single();

    // console.log("userData", userData);
    // console.log("roleError", roleError);
    // if (roleError) throw roleError;
    // if (userData.role !== "admin") {
    //   throw new Error("Only administrators can upload documents");
    // }

    console.log("we are here now...");

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const uniqueId = Math.random().toString(36).substring(2);
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
    const fileName = `${timestamp}-${uniqueId}.${fileExt}`;
    const filePath = `${subcategory}/${fileName}`;

    console.log("Uploading file:", filePath, file);

    // Upload file to storage
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from(bucketId)
      .upload(filePath, file, {
        contentType: documentType,
        cacheControl: "3600",
        upsert: false,
      });

    console.log("uploadData", uploadData);
    console.log("uploadError", uploadError);

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    if (!uploadData?.path) {
      throw new Error("Upload failed - no path returned");
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketId).getPublicUrl(uploadData.path);

    // Create document record
    const { error: dbError } = await supabase.from("documents").insert({
      title: file.name,
      category,
      subcategory,
      file_url: publicUrl,
      user_id: user.id,
      metadata: {
        size: file.size,
        type: documentType,
        lastModified: file.lastModified,
        status: "active",
        version: "1.0",
        uploadedBy: user.id,
        uploadDate: new Date().toISOString(),
        ...metadata,
      },
    });

    if (dbError) {
      console.error("Database insert error:", dbError);
      // If database insert fails, clean up the uploaded file
      await supabase.storage.from(bucketId).remove([filePath]);
      throw new Error(`Failed to save document: ${dbError.message}`);
    }

    return { publicUrl, path: filePath };
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
}

// export async function fetchDocuments(
//   filters: DocumentFilter = {},
//   sort: DocumentSort = { field: "created_at", direction: "desc" }
//   start: number,
//   limit: number,
//   offset: number
// ) {
//   try {
//     let query = supabase.from("documents").select("*").limit(limit);

//     // Apply filters
//     if (filters.category) {
//       query = query.eq("category", filters.category);
//     }
//     if (filters.subcategory) {
//       query = query.eq("subcategory", filters.subcategory);
//     }
//     if (filters.status) {
//       query = query.eq("metadata->status", filters.status);
//     }
//     if (filters.dateRange?.start) {
//       query = query.gte("created_at", filters.dateRange.start);
//     }
//     if (filters.dateRange?.end) {
//       query = query.lte("created_at", filters.dateRange.end);
//     }
//     if (filters.type && filters.type.length > 0) {
//       query = query.in("metadata->type", filters.type);
//     }
//     if (filters.keywords && filters.keywords.length > 0) {
//       query = query.or(
//         `title.ilike.%${filters.keywords.join(
//           "%"
//         )}%,metadata->keywords.cs.{${filters.keywords.join(",")}}`
//       );
//     }

//     // Apply sorting
//     if (sort.field.startsWith("metadata.")) {
//       const metadataField = sort.field.split(".")[1];
//       query = query.order(`metadata->${metadataField}`, {
//         ascending: sort.direction === "asc",
//       });
//     } else {
//       query = query.order(sort.field, { ascending: sort.direction === "asc" });
//     }

//     const { data, error } = await query;
//     if (error) throw error;
//     return data as Document[];
//   } catch (error) {
//     console.error("Error fetching documents:", error);
//     throw error;
//   }
// }

export async function fetchDocuments(
  filters: DocumentFilter = {},
  sort: DocumentSort = { field: "created_at", direction: "desc" },
  limit?: number,
  offset?: number
): Promise<Document[]> {
  try {
    let query = supabase.from("documents").select("*");

    // Apply filters
    if (filters.category) {
      query = query.eq("category", filters.category);
    }
    if (filters.subcategory) {
      query = query.eq("subcategory", filters.subcategory);
    }
    if (filters.status) {
      query = query.eq("metadata->status", filters.status);
    }
    if (filters.dateRange?.start) {
      query = query.gte("created_at", filters.dateRange.start);
    }
    if (filters.dateRange?.end) {
      query = query.lte("created_at", filters.dateRange.end);
    }
    if (filters.type && filters.type.length > 0) {
      query = query.in("metadata->type", filters.type);
    }
    if (filters.keywords && filters.keywords.length > 0) {
      query = query.or(
        `title.ilike.%${filters.keywords.join(
          "%"
        )}%,metadata->keywords.cs.{${filters.keywords.join(",")}}`
      );
    }

    // Apply sorting
    if (sort.field.startsWith("metadata.")) {
      const metadataField = sort.field.split(".")[1];
      query = query.order(`metadata->${metadataField}`, {
        ascending: sort.direction === "asc",
      });
    } else {
      query = query.order(sort.field, { ascending: sort.direction === "asc" });
    }

    // Apply pagination
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data as Document[];
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
}

export async function deleteDocument(document: Document) {
  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("User not authenticated");

    // Check user permissions
    const { data: userData, error: roleError } = await supabase
      .from("_users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError) throw roleError;
    if (userData.role !== "admin") {
      throw new Error("Only administrators can delete documents");
    }

    // Extract bucket and path from URL
    const url = new URL(document.file_url);
    const pathParts = url.pathname.split("/");
    const bucketId = pathParts[1]; // After the first slash
    const filePath = pathParts.slice(2).join("/"); // Everything after the bucket

    if (!bucketId || !filePath) {
      throw new Error("Invalid file URL");
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(bucketId)
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", document.id);

    if (dbError) throw dbError;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}

export async function updateDocument(id: string, updates: Partial<Document>) {
  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("User not authenticated");

    // Check user permissions
    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError) throw roleError;
    if (userData.role !== "admin") {
      throw new Error("Only administrators can update documents");
    }

    const { error } = await supabase
      .from("documents")
      .update({
        ...updates,
        metadata: {
          ...updates.metadata,
          lastModifiedBy: user.id,
          lastModifiedAt: new Date().toISOString(),
        },
      })
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}

export async function archiveDocument(id: string) {
  return updateDocument(id, {
    metadata: {
      status: "archived",
      archivedAt: new Date().toISOString(),
    },
  });
}

export async function restoreDocument(id: string) {
  return updateDocument(id, {
    metadata: {
      status: "active",
      restoredAt: new Date().toISOString(),
    },
  });
}

export async function getDocumentVersions(id: string) {
  try {
    const { data, error } = await supabase
      .from("document_versions")
      .select("*")
      .eq("document_id", id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching document versions:", error);
    throw error;
  }
}

export async function checkDocumentAccess(documentId: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    // Get user's subscription status
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    if (userError) throw userError;

    // If user has no subscription, they can't access documents
    if (!userData?.subscription_tier) return false;

    // Get document details
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (docError) throw docError;

    // Check if user's subscription tier allows access to this document
    const tierAccess = {
      bronze: ["public"],
      silver: ["public", "basic"],
      gold: ["public", "basic", "premium"],
      platinum: ["public", "basic", "premium", "exclusive"],
    };

    return tierAccess[userData.subscription_tier].includes(
      document.metadata.accessLevel || "public"
    );
  } catch (error) {
    console.error("Error checking document access:", error);
    return false;
  }
}
