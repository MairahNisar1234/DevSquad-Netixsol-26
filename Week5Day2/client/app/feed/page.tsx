"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FeedPage() {
  // 1. Initialize with an empty array to prevent immediate crash
  const [posts, setPosts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(savedUser);

    if (savedUser.id) {
      fetch(`http://localhost:3001/posts/feed/${savedUser.id}`)
        .then(res => res.ok ? res.json() : []) // 2. Fallback to empty array if response is bad
        .then(data => {
          // 3. Final safety check: only set if data is an actual Array
          if (Array.isArray(data)) {
            setPosts(data);
          } else {
            console.error("Expected array but got:", data);
            setPosts([]); 
          }
        })
        .catch(err => {
          console.error("Fetch error:", err);
          setPosts([]);
        });
    }
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', fontFamily: 'system-ui' }}>
      <h1>Welcome back, {user?.username || 'User'}! ☕</h1>
      
      {/* 4. Use optional chaining just in case */}
      {posts?.length > 0 ? (
        posts.map((post: any) => (
          <div key={post._id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
            <Link href={`/profile/${post.author?.username}`}>
              <b>@{post.author?.username || 'anonymous'}</b>
            </Link>
            <p>{post.content}</p>
            <Link href={`/post/${post._id}`} style={{ color: '#0070f3', fontSize: '14px' }}>
              View Conversation
            </Link>
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>No posts yet! Follow some friends to see their updates.</p>
        </div>
      )}
    </div>
  );
}