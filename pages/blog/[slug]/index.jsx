import { useRouter } from "next/router";
import styles from "./blog-post.module.css";
import Comments from "./partials/comments";
import AddComment from "./partials/add-comment";
import Button from "@components/button";
import Heading from "@components/heading";
import BlogImageBanner from "@components/blog-image-banner";
import { getPostBySlug, postCacheKey, deletePost, getPost } from "../../../api-routes/posts";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useUser } from '@supabase/auth-helpers-react';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const user = useUser();

  console.log(user);

  const { data: postsData = [] } = useSWR(postCacheKey, getPost);
  const posts = postsData.data || [];

  const { data, error } = useSWR(
    slug ? `${postCacheKey}${slug}` : null,
    () => getPostBySlug({ slug })
  );

  const post = data?.data;
  
  const { trigger: deleteTrigger } = useSWRMutation(postCacheKey, deletePost);

  const handleDeletePost = async () => {
    const { error } = await deleteTrigger(post.id);
    if (!error) {
      router.push("/blog");
    }
  };

  const handleEditPost = () => {
    router.push(`/blog/${slug}/edit`);
  };

  if (!post && !error) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }


  console.log("user.id:", user?.id);
  console.log("post.author:", post?.author);

  return (
    <>
      <section className={styles.container}>
        <Heading>{post.title}</Heading>
        {post?.image && <BlogImageBanner src={post.image} alt={post.title} />}
        <div className={styles.dateContainer}>
          <time className={styles.date}>{post.createdAt}</time>
          <div className={styles.border} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.body }} />


        <span className={styles.author}>Author:</span>

        
        {user &&
            user.id === post.author && ( 
              <div className={styles.buttonContainer}>
                <Button onClick={handleDeletePost}>Delete</Button>
                <Button onClick={handleEditPost}>Edit</Button>
              </div>
            )}
      </section>

      <Comments postId={post.id} post={post}/>

      {/* This component should only be displayed if a user is authenticated */}
      <AddComment postId={post.id} />
    </>
  );
}
