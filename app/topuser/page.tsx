'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchUsers, fetchUserPosts, getUserAvatar } from '../utils/fetchData';

interface User {
  id: string;
  name: string;
  postCount: number;
}

export default function TopUsersPage() {
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTopUsers() {
      try {
        setLoading(true);
        const users = await fetchUsers();
                const userPromises = Object.entries(users).map(async ([id, name]) => {
          const posts = await fetchUserPosts(id);
          return {
            id,
            name: name as string,
            postCount: posts.length
          };
        });
        
        const usersWithPostCounts = await Promise.all(userPromises);
                const sortedUsers = usersWithPostCounts.sort((a, b) => b.postCount - a.postCount);
                const top5Users = sortedUsers.slice(0, 5);
        
        setTopUsers(top5Users);
        setLoading(false);
      } catch (error) {
        setError('Failed to load top users');
        setLoading(false);
      }
    }
    
    loadTopUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading top users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Top Users</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topUsers.map((user, index) => (
          <div 
            key={user.id} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="relative">
                <img 
                  src={getUserAvatar(user.id)} 
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {index + 1}
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">User ID: {user.id}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Posts:</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  {user.postCount}
                </span>
              </div>
              
              <div className="mt-4">
                <Link 
                  href={`/feeds?userId=${user.id}`}
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-2 rounded-lg transition-colors"
                >
                  View Posts
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {topUsers.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No users found
        </div>
      )}
    </div>
  );
}