"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { toast } from "sonner";

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: any;
}

export default function EducationModal({ isOpen, onClose, editItem }: EducationModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    period: "",
    details: "", 
  });

  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setFormData({
          degree: editItem.degree || "",
          institution: editItem.institution || "",
          period: editItem.period || "",
          details: editItem.details ? editItem.details.join("\n") : "",
        });
      } else {
        setFormData({ degree: "", institution: "", period: "", details: "" });
      }
    }
  }, [editItem, isOpen]);

  const mutation = useMutation({
    mutationFn: async (newEdu: typeof formData) => {
      const payload = {
        ...newEdu,
        details: newEdu.details.split("\n").map((d) => d.trim()).filter(Boolean),
      };

      const url = editItem ? `/api/education/${editItem._id}` : "/api/education";
      const method = editItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save education");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      onClose();
      toast.success(editItem ? "Academic record updated successfully!" : "Academic record added!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save academic record");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-light tracking-widest uppercase text-white">{editItem ? "Edit Academic Record" : "Add Academic Record"}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="education-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Degree / Certification</label>
              <input required type="text" value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all" placeholder="e.g. B.Tech in Computer Science Engineering" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Institution</label>
                <input required type="text" value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all" placeholder="e.g. Raghu Institute of Technology" />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Period</label>
                <input required type="text" value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all" placeholder="e.g. 2022 - 2026" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Key Details <span className="text-zinc-700 normal-case tracking-normal">(One per line)</span></label>
              <textarea required rows={4} value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all resize-none" placeholder="Specialized in AI and Deep Learning...&#10;GPA: 9.0..." />
            </div>


          </form>
        </div>

        <div className="p-6 border-t border-white/5 flex justify-end gap-4 bg-zinc-950/50">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors">Cancel</button>
          <button type="submit" form="education-form" disabled={mutation.isPending}
            className="px-6 py-2.5 bg-white text-zinc-950 text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50">
            {mutation.isPending ? "Saving..." : editItem ? "Update Academic History" : "Add to Academic History"}
          </button>
        </div>
      </div>
    </div>
  );
}