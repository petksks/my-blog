import { supabase } from "@/lib/supabaseClient";

export const postCacheKey = "/blog/post";

export async function getPost() {
  const { data, error } = await supabase
    .from('posts')
    .select()

  if (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }

  return { data: data || [] };
}

export async function getPostBySlug({ slug }) {
  const { data, error } = await supabase
    .from("posts")
    .select()
    .eq("slug", slug)
    .single();

  return { data, error };
}

export async function deletePost(_, { arg: id }) {
  const { data, error } = await supabase
    .from('posts')
    .delete()
    .select()
    .eq('id', id);

  return { data, error };
}

export const addPost = async (_, { arg: newPost }) => {
  let image = "";

  if (newPost?.image) {
    const { publicUrl, error } = await uploadImage(newPost?.image);

    if (!error) {
      image = publicUrl;
    }
  }

  const { data, error, status } = await supabase
    .from('posts')
    .insert({ ...newPost, image })
    .select()
    .single();

  return { error, status, data };
}

export const editPost = async (_, { arg: updatedPost }) => {
  let image = updatedPost?.image ?? "";
  const isNewImage = typeof image === "object" && image !== null;

  if (isNewImage) {
    const { publicUrl, error } = await uploadImage(updatedPost?.image);

    if (!error) {
      image = publicUrl;
    }
  }

  const { data, error, status } = await supabase
    .from("posts")
    .update({ ...updatedPost, image })
    .eq("id", updatedPost.id)
    .select()
    .single();

  return { data, error, status };
}
