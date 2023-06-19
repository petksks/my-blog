// import Link from "next/link";
// import styles from "./blog.module.css";
// import Heading from "@components/heading";
// import { 
//   getPost,
//   postCacheKey } 
//   from "../../api-routes/posts";
// import useSWR from "swr";
// import { useState } from 'react';

// export default function Blog() {

//   const { data: { data = [] } = {}, 
//      error,  
//      isLoading 
//    } = useSWR(postCacheKey,getPost);

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   if (isLoading || !data) {
//     return <div>Loading...</div>;
//   }

//   console.log(data);

//   return (
//     <section>
//       <Heading>Blog</Heading>
//       {data.map((post) => (
//         <Link
//           key={post.slug}
//           className={styles.link}
//           href={`/blog/${post.slug}`}
//         >
//           <div className="w-full flex flex-col">
//             <p>{post.title}</p>
//             <time className={styles.date}>{post.createdAt}</time>
//           </div>
//         </Link>
//       ))}
//     </section>
//   );
// }

import Link from "next/link";
import styles from "./blog.module.css";
import Heading from "@components/heading";
import { 
  getPost,
  postCacheKey
} from "../../api-routes/posts";
import useSWR from "swr";

export default function Blog() {
  const { data, error } = useSWR(postCacheKey,getPost);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  console.log(data);

  // if the data structure is as you expected, then data.data should be an array.
  const posts = data.data || [];

  return (
    <section>
      <Heading>Blog</Heading>
      {posts.map((post) => (
        <Link
          key={post.slug}
          className={styles.link}
          href={`/blog/${post.slug}`}
        >
          <div className="w-full flex flex-col">
            <p>{post.title}</p>
            <time className={styles.date}>{post.createdAt}</time>
          </div>
        </Link>
      ))}
    </section>
  );
}

