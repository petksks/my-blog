import { useRouter } from "next/router";
import BlogEditor from "@/components/blog-editor";
import { postCacheKey, editPost, getPostBySlug } from "../../../../api-routes/posts";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { createSlug } from "@/utils/createSlug";
import Button from "@components/button";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";

export default function EditBlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const user = useUser

  const { 
    data: { data: post = {} } = {},
    error,
    isLoading,
    } = useSWR( slug ? `${postCacheKey}${slug}` : null,() => getPostBySlug({ slug }));

    const { trigger: editTrigger } = useSWRMutation(
      `${postCacheKey}${slug}`,
      editPost
    );
    
    const handleOnSubmit = async ({ editorContent, titleInput, image }) => {
      const newSlug = createSlug(titleInput);
    
      const updatedPost = {
        title: titleInput,
        slug: newSlug,
        body: editorContent,
        image: image,
        author: user.id,
        id: post && post.id,
      };
    
      const { data, error } = await editTrigger(updatedPost);
    
      if (!error) {
        router.push(`/blog/${newSlug}`);
      }

      if (error) {
        console.log(error)
      }
    };
    

  if (isLoading) {
    return "...loading";
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  
  return (
    <>
      <BlogEditor
        heading="Edit blog post"
        title={post && post.title} 
        src={post && post.image}
        alt={post && post.title}
        content={post && post.body}
        buttonText="Save changes"
        onSubmit={handleOnSubmit}
      />
    </>
  );
}

// export const getServerSideProps = async (ctx) => {
//   const supabase = createPagesServerClient(ctx);
//   const { slug } = ctx.params;

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   const { data } = await supabase
//     .from("posts")
//     .select()
//     .single()
//     .eq("slug", slug);

//   const isAuthor = data.user_id === session.user.id;

//   if (!isAuthor) {
//     return {
//       redirect: {
//         destination: `/blog/${slug}`,
//         permanent: true,
//       },
//     };
//   }
//   return {
//     props: {},
//   };
// };

