import { supabase } from "@/integrations/supabase/client";

export async function uploadImage(file: File, folder: string = "general"): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from("portfolio-images")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const { data } = supabase.storage
    .from("portfolio-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
