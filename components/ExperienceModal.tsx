"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { toast } from "sonner";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: any;
}

export default function ExperienceModal({ isOpen, onClose, editItem }: ExperienceModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    period: "",
    description: "",
    portfolios: ["all"],
  });

  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setFormData({
          role: editItem.role || "",
          company: editItem.company || "",
          period: editItem.period || "",
          description: editItem.description || "",
          portfolios: editItem.portfolios || ["all"],
        });
      } else {
        setFormData({ role: "", company: "", period: "", description: "", portfolios: ["all"] });
      }
    }
  }, [editItem, isOpen]);

  const mutation = useMutation({
    mutationFn: async (newExp: typeof formData) => {
      const url = editItem ? `/api/experience/${editItem._id}` : "/api/experience";
      const method = editItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExp),
      });
      if (!res.ok) throw new Error("Failed to save experience");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      onClose();
      toast.success(editItem ? "Milestone updated successfully!" : "Career milestone added!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save milestone");
    }
  });

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-light tracking-widest uppercase text-white">{editItem ? "Edit Milestone" : "Add Career Milestone"}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="experience-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Role / Title</label>
                <input required type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all" placeholder="e.g. Virtual Intern" />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Company</label>
                <input required type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all" placeholder="e.g. Deloitte" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Period</label>
              <input required type="text" value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all" placeholder="e.g. May 2025 - Aug 2025" />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Impact & Responsibilities</label>
              <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all resize-none" placeholder="Solved real-life coding problems and architected client solutions..." />
            </div>

            <div className="space-y-3 pt-4 border-t border-white/5">
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Deployment Targets</label>
              <div className="flex flex-wrap gap-3">
                {["all", "scroll-story", "minimalist", "3d-webgl", "terminal"].map((target) => {
                  const isActive = formData.portfolios.includes(target);
                  return (
                    <button type="button" key={target} onClick={() => handlePortfolioToggle(target)}
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

        <div className="p-6 border-t border-white/5 flex justify-end gap-4 bg-zinc-950/50">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button type="submit" form="experience-form" disabled={mutation.isPending}
            className="px-6 py-2.5 bg-white text-zinc-950 text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? "Saving..." : editItem ? "Update Trajectory" : "Add to Trajectory"}
          </button>
        </div>

      </div>
    </div>
  );
}