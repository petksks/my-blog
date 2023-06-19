import Button from "@components/button";
import styles from "./comment.module.css";
import { commentsCacheKey, deleteComment } from "../../../../../api-routes/comments";
import useSWRMutation from "swr/mutation";
// import { useUser } from '@supabase/auth-helpers-react'
// import { useState } from "react";



export default function Comment({ comment, createdAt, author, id }) {
  // const user = useUser();
  
  const { trigger: deleteTrigger } = useSWRMutation(
    commentsCacheKey, 
    deleteComment, {
    });

    const handleDelete = async () => {
      const { status, error } = await deleteTrigger(id);
      if (!error) {
        console.log("deleted comment")
      }
      if (error) {
        console.log(error)
      }
    };
  
    const handleAddReply = () => {
      setShowReply(!showReply);
    };
    
  return (
    <div className={styles.container}>
      <p>{comment}</p>
      <p className={styles.author}>{author}</p>
      <time className={styles.date}>{createdAt}</time>

      {/* The Delete part should only be showed if you are authenticated and you are the author */}
      <div className={styles.buttonContainer}>
        <Button onClick={handleDelete}>Delete</Button>
      </div>
    </div>
  );
}
