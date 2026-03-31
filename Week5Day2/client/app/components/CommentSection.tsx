"use client";
import { useEffect, useState, useRef } from "react";
import { socket } from "@/lib/socket";
import Link from "next/link";
import { 
  FiHeart, 
  FiThumbsDown, 
  FiCornerDownRight, 
  FiMessageSquare, 
  FiUserPlus, 
  FiUserCheck 
} from "react-icons/fi";

interface Props {
  postId: string;
  isDarkMode: boolean;
}

export default function CommentSection({ postId, isDarkMode }: Props) {
  // --- UPDATED BACKEND URL ---
  const BACKEND_URL = "https://deploy-nexus.onrender.com";
  
  const [text, setText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [user, setUser] = useState<any>(null);
  const [typingStatus, setTypingStatus] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const theme = {
    bg: isDarkMode ? "#1E293B" : "#FFFFFF",
    replyBg: isDarkMode ? "#334155" : "#F8FAFC",
    border: isDarkMode ? "#475569" : "#E2E8F0",
    textMain: isDarkMode ? "#F1F5F9" : "#0F172A",
    textMuted: isDarkMode ? "#94A3B8" : "#64748B",
    inputBg: isDarkMode ? "#0F172A" : "#FFFFFF",
    accent: "#10B981"
  };

  const getId = (item: any) => {
    if (!item) return null;
    return item._id?.$oid || item._id || String(item);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      socket.emit("join_notifications", parsedUser.id);
    }

    // UPDATED FETCH LINK
    fetch(`${BACKEND_URL}/comments/${postId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
      })
      .catch(err => console.error("Fetch error:", err));

    if (!socket.connected) socket.connect();

    // Socket Listeners
    socket.on("new_comment", (newComment) => {
      if (newComment.postId === postId) {
        setComments((prev) => {
          const exists = prev.find((c) => getId(c) === getId(newComment));
          return exists ? prev : [newComment, ...prev];
        });
      }
    });

    socket.on("comment_updated", (updated) => {
      setComments((prev) => prev.map((c) => (getId(c) === getId(updated) ? updated : c)));
    });

    socket.on("user_typing", (data) => {
      if (data.postId === postId) {
        setTypingStatus(data.isTyping ? `${data.username} is typing...` : null);
      }
    });

    return () => {
      socket.off("new_comment");
      socket.off("comment_updated");
      socket.off("user_typing");
    };
  }, [postId]);

  // FOLLOW FUNCTIONALITY
  const handleFollow = async (targetId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login to follow!");
    if (user?.id === targetId) return alert("You cannot follow yourself!");

    try {
      // UPDATED FETCH LINK
      const res = await fetch(`${BACKEND_URL}/users/follow/${targetId}`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
      });

      if (res.ok) {
        const data = await res.json(); 

        setComments((prev) =>
          prev.map((c) => {
            const authorId = getId(c.author);
            if (authorId === targetId) {
              return {
                ...c,
                author: { 
                  ...c.author, 
                  isFollowing: data.following,
                  followerCount: data.followerCount 
                }
              };
            }
            return c;
          })
        );
      }
    } catch (err) {
      console.error("Follow request failed:", err);
    }
  };

  const handleInputChange = (val: string) => {
    setText(val);
    if (!user) return;
    socket.emit("typing_start", { postId, username: user.username });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing_stop", { postId });
    }, 1500);
  };

  const sendComment = (parentId: string | null, content: string) => {
    if (!content.trim() || !user) return;
    socket.emit("add_comment", { userId: user.id, content, postId, parentId });
    if (!parentId) setText("");
    else { setReplyText(""); setReplyingTo(null); }
    socket.emit("typing_stop", { postId });
  };

  const handleAction = (commentId: string, action: "like" | "dislike") => {
    if (!user) return alert(`Please login to ${action}!`);
    socket.emit(`${action}_comment`, { commentId, userId: user.id, username: user.username });
  };

  const renderComment = (c: any, isReply = false) => {
    const commentId = getId(c);
    const author = c.author || {};
    const authorId = getId(author);
    const time = c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now";

    return (
      <div key={commentId} style={{
        backgroundColor: isReply ? theme.replyBg : theme.bg,
        padding: "20px", borderRadius: "12px", border: `1px solid ${theme.border}`,
        marginBottom: "12px", marginLeft: isReply ? "48px" : "0", transition: "all 0.3s ease"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            
            {/* AVATAR */}
            <Link href={`/profile/${author.username}`}>
              <div style={{ 
                width: "40px", height: "40px", borderRadius: "10px", overflow: "hidden", 
                border: `2px solid ${theme.accent}`, display: "flex", alignItems: "center", 
                justifyContent: "center", background: isDarkMode ? "#334155" : "#F1F5F9" 
              }}>
                {author.profilePicture ? (
                  <img src={author.profilePicture} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: theme.accent, fontWeight: "bold" }}>{author.username?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </Link>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link href={`/profile/${author.username}`} style={{ textDecoration: 'none' }}>
                  <b style={{ color: theme.textMain, fontSize: "14px" }}>@{author.username}</b>
                </Link>

                {/* FOLLOW BUTTON */}
                {user && user.id !== authorId && (
                  <button 
                    onClick={() => handleFollow(authorId)}
                    style={{ 
                      background: author.isFollowing ? 'transparent' : theme.accent, 
                      border: `1px solid ${theme.accent}`, color: author.isFollowing ? theme.accent : 'white',
                      fontSize: '10px', padding: '2px 8px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    {author.isFollowing ? <FiUserCheck /> : <FiUserPlus />}
                    {author.isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>
              <div style={{ fontSize: "11px", color: theme.textMuted }}>
                {author.followerCount || 0} followers • {time}
              </div>
            </div>
          </div>
        </div>

        <p style={{ margin: "0 0 15px 0", color: isDarkMode ? "#CBD5E1" : "#334155", lineHeight: "1.6", fontSize: "15px" }}>
          {c.content}
        </p>

        <div style={{ display: "flex", gap: "20px" }}>
          <button onClick={() => handleAction(commentId, "like")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: theme.textMuted, fontSize: "13px" }}>
            <FiHeart size={16} color={c.likes?.length > 0 ? theme.accent : theme.textMuted} fill={c.likes?.length > 0 ? theme.accent : "none"} /> {c.likes?.length || 0}
          </button>
          <button onClick={() => handleAction(commentId, "dislike")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: theme.textMuted, fontSize: "13px" }}>
            <FiThumbsDown size={16} /> {c.dislikes?.length || 0}
          </button>
          {!isReply && (
            <button onClick={() => setReplyingTo(commentId)} style={{ background: "none", border: "none", color: theme.accent, cursor: "pointer", fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
              <FiCornerDownRight /> Reply
            </button>
          )}
        </div>

        {replyingTo === commentId && (
          <div style={{ marginTop: "15px", display: "flex", gap: "8px" }}>
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              style={{ flex: 1, padding: "10px", borderRadius: "6px", border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textMain, outline: "none", fontSize: "14px" }}
            />
            <button onClick={() => sendComment(commentId, replyText)} style={{ padding: "8px 16px", background: theme.accent, color: "white", border: "none", borderRadius: "6px", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>Reply</button>
            <button onClick={() => setReplyingTo(null)} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "13px", cursor: "pointer" }}>Cancel</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ width: "100%", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ height: "24px", marginBottom: "8px" }}>
        {typingStatus && <small style={{ color: theme.accent, fontWeight: "500" }}>{typingStatus}</small>}
      </div>

      {user ? (
        <div style={{ position: 'relative', marginBottom: '40px' }}>
          <div style={{ position: 'absolute', left: '15px', top: '14px', color: theme.textMuted }}><FiMessageSquare size={18} /></div>
          <input
            value={text}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={`Add to the discussion as ${user.username}...`}
            style={{ width: '100%', padding: '14px 100px 14px 45px', borderRadius: '10px', border: `1px solid ${theme.border}`, fontSize: '15px', outline: 'none', backgroundColor: theme.inputBg, color: theme.textMain }}
          />
          <button onClick={() => sendComment(null, text)} style={{ position: 'absolute', right: '8px', top: '7px', background: theme.accent, color: 'white', border: 'none', padding: '7px 18px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Post</button>
        </div>
      ) : (
        <div style={{ textAlign: "center", background: theme.replyBg, padding: "20px", borderRadius: "8px", border: `1px dashed ${theme.border}`, marginBottom: "40px" }}>
          <p style={{ margin: 0, color: theme.textMuted, fontSize: "14px" }}>Join the conversation. <Link href="/login" style={{ color: theme.accent, fontWeight: "bold", textDecoration: "none" }}>Sign in</Link></p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {comments
          .filter((c) => !c.parentId)
          .map((parent) => (
            <div key={getId(parent)}>
              {renderComment(parent)}
              {comments
                .filter((child) => getId(child.parentId) === getId(parent))
                .map((reply) => renderComment(reply, true))}
            </div>
          ))}
      </div>
    </div>
  );
}