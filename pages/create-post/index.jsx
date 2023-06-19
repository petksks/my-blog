import BlogEditor from "@/components/blog-editor";
import { createSlug } from "@/utils/createSlug";
import { addPost, postCacheKey } from "../../api-routes/posts";
import { useUser } from '@supabase/auth-helpers-react'
import { useRouter } from "next/router";
import useSWRMutation from "swr/mutation";


export default function CreatePost() {
  const router = useRouter();
  const user = useUser();

const { trigger: addTrigger } = useSWRMutation(
  postCacheKey,
  addPost
);

const handleOnSubmit = async ({ editorContent, titleInput, image }) => {
  const slug = createSlug(titleInput);

  const newPost = {
    title: titleInput,
    slug,
    body: editorContent,
    image,
  };

  const { error } = await addTrigger(newPost);

  console.log(image);

  if (!error) {
    router.push(`/blog/${slug}`);
  }
};




  return (
    <BlogEditor
      heading="Create post"
      onSubmit={handleOnSubmit}
      buttonText="Upload post"
    />
  );
}
