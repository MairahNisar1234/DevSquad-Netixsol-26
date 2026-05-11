"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  MessageCircle,
  X,
  Mic,
  Square,
  Paperclip,
  Volume2,
  Bot,
  User,
  ShoppingCart,
  Wifi,
} from "lucide-react";

interface Product {
  _id: string;
  title: string;
  price: number;
  image_url: string;
  category: string;
}

interface Message {
  role: "bot" | "user";
  text: string;
  products?: Product[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi! I'm your Health AI Assistant. Describe your symptoms or ask about a product!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages, loading]);

  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) =>
        audioChunksRef.current.push(event.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mpeg",
        });
        await handleAudioUpload(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert("Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleAudioUpload = async (audioSource: Blob | File) => {
  setLoading(true);
  const formData = new FormData();
  formData.append("file", audioSource, "recording.mp3");

  try {
    const res = await fetch(
      "https://healthcareai-kappa.vercel.app/chat/speech-to-text",
      { method: "POST", body: formData }
    );
    const data = await res.json();

    if (data?.text) {
      // 1. Update the UI input field just in case
      setInput(data.text);
      
      // 2. AUTO-FEED: Directly trigger the message processing
      // We pass the text directly to bypass the state delay
      await sendMessage(undefined, data.text); 
    }
  } catch (error) {
    console.error("Transcription error:", error);
  } finally {
    setLoading(false);
  }
};
  // 1. Update the signature to accept 'overrideText' as an optional 2nd argument
const sendMessage = async (e?: React.FormEvent, overrideText?: string) => {
  e?.preventDefault();

  const messageToSend = overrideText || input;

  if (!messageToSend.trim() || loading) return;

  setMessages((prev) => [...prev, { role: "user", text: messageToSend }]);
  setInput("");
  setLoading(true);

  try {
    const res = await fetch("https://healthcareai-kappa.vercel.app/chat/symptom-checker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // 4. Send the correct text variable to the backend
      body: JSON.stringify({ text: messageToSend }),
    });

    const data = await res.json();
    
    const botMessage: Message = { 
      role: "bot", 
      text: data.explanation || data.response || "Here is what I found:", 
      products: data.products || [] 
    };

    setMessages((prev) => [...prev, botMessage]);
    if (botMessage.text) speak(botMessage.text);

  } catch (error) {
    setMessages((prev) => [...prev, { role: "bot", text: "Connection error." }]);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="absolute bottom-[72px] right-0 flex flex-col overflow-hidden rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
          style={{ width: "380px", height: "580px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
                <Bot size={18} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-sm font-semibold leading-tight">
                  Healthcare Assistant
                </span>
                <span className="flex items-center gap-1.5 text-blue-100 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Online
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  speak(messages[messages.length - 1]?.text || "")
                }
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
                aria-label="Read last message aloud"
              >
                <Volume2 size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-zinc-50 dark:bg-zinc-950 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700"
          >
            {/* Date divider */}
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-600">
              <span className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
              Today
              <span className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2 items-end ${
                  m.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full ${
                    m.role === "user"
                      ? "bg-blue-100 dark:bg-blue-900"
                      : "bg-zinc-200 dark:bg-zinc-700"
                  }`}
                >
                  {m.role === "user" ? (
                    <User size={13} className="text-blue-600 dark:text-blue-300" />
                  ) : (
                    <Bot size={13} className="text-zinc-500 dark:text-zinc-300" />
                  )}
                </div>

                <div
                  className={`flex flex-col gap-2 ${
                    m.role === "user" ? "items-end" : "items-start"
                  } max-w-[78%]`}
                >
                  {/* Bubble */}
                  <div
                    className={`px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      m.role === "user"
                        ? "bg-blue-600 text-white rounded-2xl rounded-br-sm"
                        : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-2xl rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Product Cards */}
                  {m.role === "bot" &&
                    m.products &&
                    m.products.length > 0 && (
                      <div className="flex gap-2.5 overflow-x-auto pb-1 w-full max-w-[calc(100vw-100px)]"
                        style={{ scrollbarWidth: "thin" }}
                      >
                        {m.products.map((product) => (
                          <div
                            key={product._id}
                            className="flex-shrink-0 flex flex-col bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2.5 shadow-sm"
                            style={{ width: "150px" }}
                          >
                            {/* Product image */}
                            <div className="flex items-center justify-center w-full h-20 mb-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden">
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt={product.title}
                                  
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <ShoppingCart
                                  size={22}
                                  className="text-zinc-300 dark:text-zinc-600"
                                />
                              )}
                            </div>

                            {/* Title */}
                            <p className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-100 leading-snug line-clamp-2 mb-1.5">
                              {product.title}
                            </p>

                            {/* Price + category */}
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400">
                                PKR {product.price}
                              </span>
                              <span className="text-[9px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400">
                                {product.category}
                              </span>
                            </div>

                            {/* Add to cart */}
                            <button className="flex items-center justify-center gap-1.5 w-full py-1.5 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                              <ShoppingCart size={12} />
                              Add to cart
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2 items-end">
                <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <Bot size={13} className="text-zinc-500 dark:text-zinc-300" />
                </div>
                <div className="px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl rounded-bl-sm">
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 px-3 py-3 border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex-shrink-0"
          >
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) =>
                e.target.files?.[0] && handleAudioUpload(e.target.files[0])
              }
            />

            {/* Input wrapper */}
            <div className="flex flex-1 items-center gap-1 px-3 h-11 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 flex items-center justify-center p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg transition-colors"
                aria-label="Attach file"
              >
                <Paperclip size={17} />
              </button>

              <input
                className="flex-1 bg-transparent text-[13px] text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none min-w-0"
                placeholder="Ask about symptoms or medicine..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex-shrink-0 flex items-center justify-center p-1 rounded-lg transition-colors ${
                  isRecording
                    ? "text-red-500 animate-pulse"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                }`}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? <Square size={17} /> : <Mic size={17} />}
              </button>
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-200 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white disabled:text-zinc-400 transition-all active:scale-95"
              aria-label="Send message"
            >
              <Send size={17} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}