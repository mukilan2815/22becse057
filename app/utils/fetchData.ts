const BASE_URL = "http://20.244.56.144/test";
let AUTH_TOKEN = null;
async function fetchAuthToken() {
  try {
    const authResponse = await fetch(`${BASE_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companyName: "Karpagam Academy of Higher Education",
        clientID: "5de1f93d-d75a-4a99-a743-1291ae2b0595",
        clientSecret: "tSyqaRXDlBuCmczo",
        ownerName: "Mukilan T",
        ownerEmail: "22becse057@kahedu.edu.in",
        rollNo: "22becse057",
      }),
    });

    if (!authResponse.ok) {
      throw new Error("Failed to fetch auth token");
    }

    const authData = await authResponse.json();
    AUTH_TOKEN = authData.access_token; 
    console.log("New token fetched:", AUTH_TOKEN);
  } catch (error) {
    console.error("Error fetching auth token:", error);
  }
}
fetchAuthToken();
setInterval(fetchAuthToken, 60 * 100);

const getHeaders = () => {
  return {
    Authorization: `Bearer ${AUTH_TOKEN}`,
    "Content-Type": "application/json",
  };
};
export async function fetchUsers() {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    return data.users || {};
  } catch (error) {
    console.error("Error fetching users:", error);
    return {};
  }
}
export async function fetchUserPosts(userId) {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/posts`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts for user ${userId}`);
    }

    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    return [];
  }
}

export const fetchPostComments = async (postId) => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    return data.comments || [];
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    return [];
  }
};
export const fetchAllPosts = async () => {
  try {
    const users = await fetchUsers();
    if (Object.keys(users).length === 0) {
      return [];
    }
    const postsPromises = Object.keys(users).map((userId) =>
      fetchUserPosts(userId).then((posts) =>
        posts.map((post) => ({
          ...post,
          username: users[post.userid],
        }))
      )
    );
    const postsArrays = await Promise.all(postsPromises);
    return postsArrays.flat();
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
};
export const getUserAvatar = (userId) => {
  return `https://placehold.co/600x400/EEE/31343C?text=User${userId}`;
};
export const getPostImage = (postId) => {
  return `https://placehold.co/600x400/EEE/31343C?text=Post${postId}`;
};
