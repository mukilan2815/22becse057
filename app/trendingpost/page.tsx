"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchAllPosts,
  fetchPostComments,
  getPostImage,
  getUserAvatar,
} from "../utils/fetchData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface Post {
  id: number;
  userid: number;
  content: string;
  username: string;
  commentCount: number;
}

export default function TrendingPostsPage() {
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTrendingPosts() {
      try {
        setLoading(true);

        const allPosts = await fetchAllPosts();

        if (allPosts.length === 0) {
          setTrendingPosts([]);
          setLoading(false);
          return;
        }

        const postsWithCommentsPromises = allPosts.map(async (post) => {
          const comments = await fetchPostComments(post.id);
          const commentCount = Array.isArray(comments) ? comments.length : 0;

          return {
            ...post,
            commentCount,
          };
        });

        const postsWithComments = await Promise.all(postsWithCommentsPromises);
        const sortedPosts = postsWithComments.sort(
          (a, b) => b.commentCount - a.commentCount
        );

        if (sortedPosts.length > 0) {
          const maxCommentCount = sortedPosts[0].commentCount;

          const maxCommentPosts = sortedPosts.filter(
            (post) => post.commentCount === maxCommentCount
          );

          setTrendingPosts(maxCommentPosts);
        }

        setLoading(false);
      } catch (error) {
        setError("Failed to load trending posts");
        setLoading(false);
      }
    }

    loadTrendingPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading trending posts...</div>
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
      <h1 className="text-3xl font-bold mb-8 text-center">Trending Posts</h1>

      {trendingPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={getPostImage(post.id)}
                  alt={`Post ${post.id}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full font-bold flex items-center">
                  <span className="mr-1">🔥</span> Trending
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={getUserAvatar(post.userid)}
                    alt={post.username}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold">{post.username}</p>
                    <p className="text-gray-500 text-sm">
                      User ID: {post.userid}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-800 text-lg">{post.content}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center text-blue-500">
                    <FontAwesomeIcon icon={faComments} />
                    <span className="font-medium">
                      {post.commentCount} comments
                    </span>
                  </div>

                  <Link
                    href={`/feeds?postId=${post.id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          No trending posts found
        </div>
      )}
    </div>
  );
}
