import { Database } from '@/env/secrets';
let DATABASE_URL = Database;

export const database = {
  async postFeed(data: {
    id: string;
    uid: string;
    username: string;
    icon: string;
    section: string;
    grade: string;
    time: string;
    date: string;
    text: string;
    attachment?: string | null;
    type: string;
  }) {
    const response = await fetch(`${DATABASE_URL}/FeedPost`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    console.log(response);
    const result = await response.json();
    return result;
  },

  async likeFeed(id: string, client: string) {
    const response = await fetch(`${DATABASE_URL}/FeedAddLike/${id}/${client}`, {
      method: 'POST',
    });
    const result = await response.json();
    return result;
  },

  async addFeedComment(id: string, data: {
    uid: string;
    date: string;
    time: string;
    username: string;
    section: string;
    grade: string;
    icon: string;
    text: string;
  }) {
    const response = await  fetch(`${DATABASE_URL}/FeedAddComment/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  },

  async replyFeedComment(id: string, commentId: string, data: {
    uid: string;
    date: string;
    time: string;
    username: string;
    grade: string;
    icon: string;
    text: string;
  }) {
    const response = await fetch(`${DATABASE_URL}/FeedReplyComment/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JN.stringify({ ...data, commentId }),
    });
    const result = await response.json();
    return result;
  },

  async getFeedData() {
    const response = await fetch(`${DATABASE_URL}/FeedData`);
    const data = await response.json();
  for (let i = data.length - 1; i > 0; i--) {
 const j = Math.floor(Math.random() * (i + 1));
   [data[i], data[j]] = [data[j], data[i]];
 };
    return data;
  },
  async postMessage(data: {
    date: string;
    time: string;
    section: string;
    username: string;
    strand: string;
    grade: string;
    icon: string;
    text: string;
    image?: string | null;
  }) {
    const response = await fetch(`${DATABASE_URL}/Message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  },

  async getMessageData() {
    const response = await fetch(`${DATABASE_URL}/MessageData`);
    const result = await response.json();
    return result;
  },

  async addThreadComment(id: string, data: {
    date: string;
    time: string;
    username: string;
    section: string;
    strand: string;
    grade: string;
    icon: string;
    text: string;
  }) {
    const response = await fetch(`${DATABASE_URL}/ThreadAddComment/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  },

  async replyThreadComment(id: string, commentId: string, data: {
    date: string;
    time: string;
    username: string;
    section: string;
    strand: string;
    grade: string;
    icon: string;
    text: string;
  }) {
    const response = await fetch(`${DATABASE_URL}/ThreadReplyComment/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, commentId }),
    });
    const result = await response.json();
    return result;
  },

  async getThreadData() {
    const response = await fetch(`${DATABASE_URL}/ThreadData`);
    const result = await response.json();
    return result;
  },

  async postConfession(data: {
    date: string;
    time: string;
    text: string;
  }) {
    const response = await fetch(`${DATABASE_URL}/ConfessPost`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  },

  async addConfessionComment(id: string, data: {
    date: string;
    time: string;
    text: string;
  }) {
    const response = await fetch(`${DATABASE_URL}/ConfessComment/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  },

  async replyConfessionComment(id: string, commentId: string, data: {
    date: string;
    time: string;
    text: string;
  }) {
    const response = await fetch(`${DATABASE_URL}/ConfessReplyComment/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, commentId }),
    });
    const result = await response.json();
    return result;
  },

  async getConfessionData() {
    const response = await fetch(`${DATABASE_URL}/ConfessData`);
    const result = await response.json();
    return result;
  },

  async postDiscussion(data: {
    id: string;
    icon: string;
    section: string;
    username: string;
    strand: string;
    grade: string;
    time: string;
    date: string;
    text: string;
    image?: string | null;
  }) {
    const response = await fetch(`${DATABASE_URL}/DiscussPost`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  },

  async likeDiscussion(id: string) {
    const response = await fetch(`${DATABASE_URL}/DiscussAddLike/${id}`, {
      method: 'POST',
    });
    const result = await response.json();
    return result;
  },

  async addDiscussionComment(id: string, data: {
    date: string;
    time: string;
    section: string;
    username: string;
    strand: string;
    grade: string;
    icon: string;
    text: string;
  }) {
    const response = await fetch(`${DATABASE_URL}/DiscussAddComment/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  },

  async replyDiscussionComment(id: string, commentId: string, data: {
    date: string;
    time: string;
    section: string;
    username: string;
    strand: string;
    grade: string;
    icon: string;
    text: string;
  }) {
    const response = await fetch(`${DATABASE_URL}/DiscussReplyComment/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, commentId }),
    });
    const result = await response.json();
    return result;
  },

  async getDiscussionData() {
    const response = await fetch(`${DATABASE_URL}/DiscussData`);
    const result = await response.json();
    return result;
  },

  async loginUser(data: {
    id: string;
    email: string;
    password: string;
    name: string;
    firstName: string;
    section: string;
    grade: string;
    schoolID: string;
    birthday: string;
    createdAt: string;
    adviserName: string | null;
    adviserIcon: string | null;
    adviserUrl: string | null;
    adviserSubject: string | null;
 }) {
    const response = await fetch(`${DATABASE_URL}/LoginUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  },

  async logoutUser(id: string) {
    const response = await fetch(`${DATABASE_URL}/LogoutUser/${id}`);
    const result = await response.json();
    return result;
  },

  async getUserData(id: string) {
    const response = await fetch(`${DATABASE_URL}/LoginData/${id}`);
    const result = await response.json();
    return result;
  },
  async updateUser(id: string, data: {
    bio: string | null;
    banner: string | null;
    icon: string | null;
    address: string | null;
    ban: boolean | false;
  }) {
      const response = await fetch(`${DATABASE_URL}/UpdateUser/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    const result = await response.json();
    return result;
  },
    async chatUser(uid: string, receiverId: string, data: {
      id: string;
      date: string;
      time: string;
      message: string;
      type: string;
      attachment?: string | null;
    }) {
    const response = await fetch(`${DATABASE_URL}/ChatUser/${uid}/${receiverId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        return result;
   },
  async getChatUser(uid: string, receiverId: string) {
  const response = await fetch(`${DATABASE_URL}/ChatUserData/${uid}/${receiverId}`);
  const result = await response.json();
    if (result.error) return [];
  return result;
 },
};
