"use client";
import { useEffect, useState } from "react";
import { fetchData } from "../utils/fetchData";

export default function Feed() {
  const [posts, setPosts] = useState<{ id: string; content: string }[]>([]);

  useEffect(() => {
    const fetchFeed = async () => {
      const users = await fetchData("http://20.244.56.144/test/users");
      if (!users) return;

      let allPosts: any[] = [];

      for (const user of users) {
        const userPosts = await fetchData(`http://20.244.56.144/test/users/${user.id}/posts`);
        if (userPosts) allPosts = [...allPosts, ...userPosts];
      }

      // Sort by most recent (assuming posts have timestamps)
      setPosts(allPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    };

    fetchFeed();
    const interval = setInterval(fetchFeed, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Real-time Feed</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.content}</li>
        ))}
      </ul>
    </div>
  );
}
