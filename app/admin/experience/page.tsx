"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ExperienceModal from "@/components/ExperienceModal";
import { Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface Experience {
  _id: string;
  role: string;
  company: string;
  period: string;
  portfolios: string[];
}

const fetchExperience = async (): Promise<Experience[]> => {
  const res = await fetch("/api/experience");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function AdminExperience() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Experience | null>(null);
  
  const { data: experience, isLoading, isError } = useQuery({
    queryKey: ["experience"],
    queryFn: fetchExperience,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete experience");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      toast.success("Milestone deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete milestone");
    }
  });

  return (
    <div className="min-h-screen bg-zinc-950 p-10 lg:p-16 text-white">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-light tracking-tight mb-2">Experience</h1>
            <p className="text-zinc-500 font-light tracking-wide text-sm uppercase">Professional Trajectory Management</p>
          </div>
          <button 
            onClick={() => {
              setEditItem(null);
              setIsModalOpen(true);
            }}
            className="px-6 py-3 bg-transparent border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white hover:text-black transition-all duration-300"
          >
            Add Career Milestone
          </button>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-zinc-900/50 rounded-2xl w-full border border-white/5" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-red-400 bg-red-950/30 border border-red-900/50 p-6 rounded-2xl font-light">
            Failed to load experience data.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {experience?.map((job) => (
              <div key={job._id} className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 flex justify-between items-center group hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-500">
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-medium tracking-tight text-white group-hover:text-amber-500 transition-colors">
                      {job.role}
                    </h3>
                    <span className="text-sm font-mono text-zinc-500">@ {job.company}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest px-3 py-1.5 bg-zinc-950 border border-white/5 rounded-full text-zinc-400">
                    {job.period}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] tracking-widest uppercase text-zinc-600">Distribution Targets</span>
                    
                    <button 
                      onClick={() => {
                        setEditItem(job);
                        setIsModalOpen(true);
                      }}
                      className="text-zinc-400 hover:text-white transition-colors"
                      title="Edit Experience"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={() => {
                        if (window.confirm("Delete this experience?")) {
                          deleteMutation.mutate(job._id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className="text-red-500/70 hover:text-red-500 transition-colors disabled:opacity-50"
                      title="Delete Experience"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {job.portfolios.map(p => (
                      <div key={p} className="px-2 py-1 rounded border border-amber-500/20 bg-amber-500/5 text-[10px] text-amber-500/80 uppercase tracking-wider">
                        {p}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
            
            {experience?.length === 0 && (
              <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl text-zinc-500 font-light tracking-wide">
                No career data found. Add your first milestone.
              </div>
            )}
          </div>
        )}
      </div>

      <ExperienceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} editItem={editItem} />
    </div>
  );
}