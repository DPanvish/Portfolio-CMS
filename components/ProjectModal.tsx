"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react"; 

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ isOpen, onClose }: ProjectModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    thumbnailUrl: "",
    githubUrl: "",
    liveUrl: "",
    portfolios: ["all"],
  });

  const mutation = useMutation({
    mutationFn: async (newProject: typeof formData) => {
      const payload = {
        ...newProject,
        techStack: newProject.techStack.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create project");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] }); // Instantly refresh the dashboard
      onClose();
      setFormData({ title: "", description: "", techStack: "", thumbnailUrl: "", githubUrl: "", liveUrl: "", portfolios: ["all"] });
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handlePortfolioToggle = (target: string) => {
    setFormData((prev) => {
      const current = prev.portfolios;
      if (current.includes(target)) {
        return { ...prev, portfolios: current.filter((p) => p !== target) };
      }
      return { ...prev, portfolios: [...current, target] };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Luxury Glass Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-light tracking-widest uppercase text-white">Initialize Project</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Project Title</label>
              <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all" placeholder="e.g. MedShare Chain" />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Architecture Summary</label>
              <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all resize-none" placeholder="Describe the system..." />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Tech Stack <span className="text-zinc-700 normal-case tracking-normal">(Comma separated)</span></label>
              <input required type="text" value={formData.techStack} onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all" placeholder="React, Node.js, GSAP" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">GitHub Repository</label>
                <input type="text" value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-all" placeholder="https://github.com/..." />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Live Deployment</label>
                <input type="text" value={formData.liveUrl} onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-all" placeholder="https://..." />
              </div>
            </div>

            {/* Just a placeholder for Image URL. We'll add Cloudinary later */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Cover Image URL</label>
              <input required type="text" value={formData.thumbnailUrl} onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-all" placeholder="https://..." />
            </div>

            {/* Target Portfolios */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Deployment Targets</label>
              <div className="flex flex-wrap gap-3">
                {["all", "scroll-story", "minimalist", "3d-webgl", "terminal"].map((target) => {
                  const isActive = formData.portfolios.includes(target);
                  return (
                    <button
                      key={target}
                      type="button"
                      onClick={() => handlePortfolioToggle(target)}
                      className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide border transition-all ${
                        isActive ? "bg-amber-500/10 border-amber-500/50 text-amber-500" : "bg-transparent border-white/10 text-zinc-400 hover:border-white/30"
                      }`}
                    >
                      {target}
                    </button>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/5 flex justify-end gap-4 bg-zinc-950/50">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button 
            type="submit" 
            form="project-form"
            disabled={mutation.isPending}
            className="px-6 py-2.5 bg-white text-zinc-950 text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? "Deploying..." : "Deploy to Database"}
          </button>
        </div>

      </div>
    </div>
  );
}