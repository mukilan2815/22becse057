"use client";
import { useEffect, useState } from "react";
import { fetchData } from "../utils/fetchData";

export default function TopUsers() {
  const [users, setUsers] = useState<{ id: string; name: string; postCount: number }[]>([]);

  useEffect(() => {
    const fetchUsersWithPosts = async () => {
      const usersData = await fetchData("http://20.244.56.144/test/users");
      if (!usersData) return;

      // Fetch post counts for each user dynamically
      const usersWithPosts = await Promise.all(
        usersData.map(async (user: any) => {
          const posts = await fetchData(`http://20.244.56.144/test/users/${user.id}/posts`);
          return { id: user.id, name: user.name, postCount: posts ? posts.length : 0 };
        })
      );

      // Sort by post count and select top 5
      setUsers(usersWithPosts.sort((a, b) => b.postCount - a.postCount).slice(0, 5));
    };

    fetchUsersWithPosts();
  }, []);

  return (
    <div>
      <h1>Top Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} - {user.postCount} posts</li>
        ))}
      </ul>
    </div>
  );
}
