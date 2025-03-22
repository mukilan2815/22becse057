"use client";
import { useEffect, useState } from "react";
import { fetchData } from "../utils/fetchData";

export default function TrendingPosts() {
  const [posts, setPosts] = useState<{ id: string; content: string; comments: number }[]>([]);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      const users = await fetchData("http://20.244.56.144/test/users");
      if (!users) return;

      let allPosts: any[] = [];

      // Fetch posts for each user
      for (const user of users) {
        const userPosts = await fetchData(`http://20.244.56.144/test/users/${user.id}/posts`);
        if (userPosts) allPosts = [...allPosts, ...userPosts];
      }

      // Fetch comment counts for each post
      const postsWithComments = await Promise.all(
        allPosts.map(async (post) => {
          const comments = await fetchData(`http://20.244.56.144/test/posts/${post.id}/comments`);
          return { id: post.id, content: post.content, comments: comments ? comments.length : 0 };
        })
      );

      // Sort by comment count and take the top 5
      setPosts(postsWithComments.sort((a, b) => b.comments - a.comments).slice(0, 5));
    };

    fetchTrendingPosts();
  }, []);

  return (
    <div>
      <h1>Trending Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.content} ({post.comments} comments)</li>
        ))}
      </ul>
    </div>
  );
}
