"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  fetchAllPosts,
  fetchPostComments,
  getPostImage,
  getUserAvatar,
} from "../utils/fetchData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faRefresh } from "@fortawesome/free-solid-svg-icons";

interface Post {
  id: number;
  userid: number;
  content: string;
  username: string;
  commentCount: number;
  timestamp?: number; 
}

interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  username: string;
  timestamp?: number;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<number[]>([]); 
  const [commentsData, setCommentsData] = useState<Record<number, Comment[]>>(
    {}
  );
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const postId = searchParams.get("postId");

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const allPosts = await fetchAllPosts();
      if (allPosts.length === 0) {
        setPosts([]);
        setLoading(false);
        return;
      }
      const postsWithCommentsPromises = allPosts.map(async (post) => {
        const comments = await fetchPostComments(post.id);
        const commentCount = Array.isArray(comments) ? comments.length : 0;
        return {
          ...post,
          commentCount,
          timestamp: Date.now() - (1000 - post.id) * 1000000,
        };
      });

      const postsWithComments = await Promise.all(postsWithCommentsPromises);

      let filteredPosts = postsWithComments;

      if (userId) {
        filteredPosts = filteredPosts.filter(
          (post) => post.userid.toString() === userId
        );
      }

      if (postId) {
        filteredPosts = filteredPosts.filter(
          (post) => post.id.toString() === postId
        );
      }

      const sortedPosts = filteredPosts.sort(
        (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
      );

      setPosts(sortedPosts);
      setLoading(false);
    } catch (error) {
      setError("Failed to load posts");
      setLoading(false);
    }
  }, [userId, postId]);

  useEffect(() => {
    loadPosts();
    const intervalId = setInterval(() => {
      loadPosts();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [loadPosts]);

  const toggleComments = async (postId: number) => {
    if (expandedComments.includes(postId)) {
      setExpandedComments(expandedComments.filter((id) => id !== postId));
    } else {
      if (!commentsData[postId]) {
        const comments = await fetchPostComments(postId);
        setCommentsData((prev) => ({ ...prev, [postId]: comments }));
      }
      setExpandedComments([...expandedComments, postId]);
    }
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return "Unknown time";

    const date = new Date(timestamp);
    return (
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      " " +
      date.toLocaleDateString()
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading feed...</div>
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {userId
            ? `Posts from User ${userId}`
            : postId
            ? `Post Details`
            : "Latest Posts Feed"}
        </h1>

        <button
          onClick={() => loadPosts()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <FontAwesomeIcon icon={faRefresh} className="mr-2" />
          Refresh Feed
        </button>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={getUserAvatar(post.userid)}
                    alt={post.username}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-bold text-lg">{post.username}</p>
                    <p className="text-gray-500 text-sm">
                      {formatTimestamp(post.timestamp)}
                    </p>
                  </div>
                </div>

                <p className="text-gray-800 text-lg mb-4">{post.content}</p>

                <img
                  src={getPostImage(post.id)}
                  alt={`Post ${post.id} image`}
                  className="w-full h-64 object-cover rounded-md mb-4"
                />

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      <FontAwesomeIcon icon={faComments} />
                      <span>{post.commentCount} comments</span>
                    </button>
                  </div>

                  <div className="text-gray-500 text-sm">
                    Post ID: {post.id}
                  </div>
                </div>
                {expandedComments.includes(post.id) && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200">
                    {commentsData[post.id]?.length > 0 ? (
                      commentsData[post.id].map((comment) => (
                        <div key={comment.id} className="flex items-start mb-4">
                          <img
                            src={getUserAvatar(comment.userId)}
                            alt={comment.username}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div>
                            <p className="font-bold">{comment.username}</p>
                            <p className="text-gray-800">{comment.content}</p>
                            <p className="text-gray-500 text-xs">
                              {formatTimestamp(comment.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No comments yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8 p-8 bg-gray-100 rounded-lg">
          <p className="text-xl">No posts found</p>
          <p className="mt-2">
            {userId
              ? `This user hasn't posted anything yet.`
              : postId
              ? `Post not found.`
              : `There are no posts in the feed yet.`}
          </p>
        </div>
      )}
    </div>
  );
}
