"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AdminAbout() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    _id: "",
    tagline: "",
    bio: "",
    skills: "",
    resumeUrl: "",
    portfolios: ["all"],
  });

  const { data: aboutData, isLoading } = useQuery({
    queryKey: ["about"],
    queryFn: async () => {
      const res = await fetch("/api/about");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  // Populate form when data loads
  useEffect(() => {
    if (aboutData && Object.keys(aboutData).length > 0) {
      setFormData({
        _id: aboutData._id,
        tagline: aboutData.tagline || "",
        bio: aboutData.bio || "",
        skills: aboutData.skills ? aboutData.skills.join(", ") : "",
        resumeUrl: aboutData.resumeUrl || "",
        portfolios: aboutData.portfolios || ["all"],
      });
    }
  }, [aboutData]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        skills: data.skills.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const url = data._id ? `/api/about/${data._id}` : "/api/about";
      const method = data._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save about data");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save profile");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="min-h-screen bg-zinc-950 p-16 flex justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 p-10 lg:p-16 text-white">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-light tracking-tight mb-2">Profile Configuration</h1>
            <p className="text-zinc-500 font-light tracking-wide text-sm uppercase">Global Engineering Identity</p>
          </div>
          <button 
            type="submit" 
            form="about-form"
            disabled={mutation.isPending}
            className="px-8 py-3 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-all duration-300 disabled:opacity-50"
          >
            {mutation.isPending ? "Syncing..." : "Save Configuration"}
          </button>
        </div>

        <form id="about-form" onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/30 p-8 rounded-2xl border border-white/5">
          
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Primary Tagline</label>
            <input required type="text" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all" 
              placeholder="e.g. System architect bridging the gap between heavy backend logic and premium UI/UX." />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Extended Biography</label>
            <textarea required rows={5} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all resize-none" 
              placeholder="Write your professional story here..." />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Core Skills <span className="text-zinc-700 normal-case tracking-normal">(Comma separated)</span></label>
            <input required type="text" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all" 
              placeholder="React, Next.js, Node.js, C++, GSAP, MongoDB" />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Resume PDF URL (Optional)</label>
            <input type="text" value={formData.resumeUrl} onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
              className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all" 
              placeholder="https://link-to-your-resume.pdf" />
          </div>

        </form>
      </div>
    </div>
  );
}