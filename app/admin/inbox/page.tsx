"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, MailOpen, Trash2 } from "lucide-react";

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  portfolioSource: string;
  isRead: boolean;
  createdAt: string;
}

const fetchMessages = async (): Promise<Message[]> => {
  const res = await fetch("/api/contact");
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
};

export default function AdminInbox() {
  const queryClient = useQueryClient();

  const { data: messages, isLoading, isError } = useQuery({
    queryKey: ["messages"],
    queryFn: fetchMessages,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/contact/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete message");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  return (
    <div className="min-h-screen bg-zinc-950 p-10 lg:p-16 text-white">
      <div className="max-w-5xl mx-auto">
        
        {/* Luxury Header */}
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-light tracking-tight mb-2">Secure Inbox</h1>
            <p className="text-zinc-500 font-light tracking-wide text-sm uppercase">Encrypted Transmission Log</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-light text-amber-500">
              {messages?.filter(m => !m.isRead).length || 0}
            </span>
            <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">Unread</p>
          </div>
        </div>

        {/* Content State */}
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-zinc-900/50 rounded-2xl w-full border border-white/5" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-red-400 bg-red-950/30 border border-red-900/50 p-6 rounded-2xl font-light">
            Failed to establish secure connection to the database.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {messages?.map((msg) => (
              <div 
                key={msg._id} 
                className={`relative overflow-hidden rounded-2xl border transition-all duration-500 p-8 ${
                  msg.isRead 
                    ? "bg-zinc-900/20 border-white/5" 
                    : "bg-zinc-900/60 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.05)]"
                }`}
              >
                {/* Status Indicator Bar */}
                {!msg.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                )}

                <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                  
                  {/* Meta Information */}
                  <div className="w-full md:w-1/3 space-y-4">
                    <div>
                      <h3 className={`text-xl tracking-tight mb-1 ${msg.isRead ? "text-zinc-300 font-light" : "text-white font-medium"}`}>
                        {msg.name}
                      </h3>
                      <a href={`mailto:${msg.email}`} className="text-sm font-mono text-zinc-500 hover:text-amber-500 transition-colors">
                        {msg.email}
                      </a>
                    </div>
                    
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Source</p>
                      <span className="px-2 py-1 rounded border border-white/10 bg-white/5 text-[10px] text-zinc-400 uppercase tracking-wider">
                        {msg.portfolioSource}
                      </span>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Received</p>
                      <p className="text-xs text-zinc-400 font-light">
                        {new Date(msg.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Message Payload */}
                  <div className="w-full md:w-2/3 flex flex-col justify-between">
                    <p className={`whitespace-pre-line leading-relaxed mb-8 ${msg.isRead ? "text-zinc-500 font-light" : "text-zinc-300 font-normal"}`}>
                      {msg.message}
                    </p>
                    
                    {/* Action Panel */}
                    <div className="flex gap-4 border-t border-white/5 pt-4 mt-auto">
                      {!msg.isRead && (
                        <button 
                          onClick={() => markAsReadMutation.mutate(msg._id)}
                          disabled={markAsReadMutation.isPending}
                          className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors"
                        >
                          <MailOpen className="w-4 h-4" /> Mark Read
                        </button>
                      )}
                      {msg.isRead && (
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-600 cursor-default">
                          <Mail className="w-4 h-4" /> Reviewed
                        </div>
                      )}
                      
                      <button 
                        onClick={() => {
                          if (window.confirm("Purge this transmission from the database?")) {
                            deleteMutation.mutate(msg._id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-red-500/70 hover:text-red-500 transition-colors ml-auto"
                      >
                        <Trash2 className="w-4 h-4" /> Purge
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
            
            {messages?.length === 0 && (
              <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl text-zinc-500 font-light tracking-wide">
                Inbox is clear. Awaiting incoming transmissions.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}