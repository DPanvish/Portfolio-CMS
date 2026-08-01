"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import EducationModal from "@/components/EducationModal";

export default function AdminEducation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: education, isLoading, isError } = useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const res = await fetch("/api/education");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  return (
    <div className="min-h-screen bg-zinc-950 p-10 lg:p-16 text-white">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-light tracking-tight mb-2">Education</h1>
            <p className="text-zinc-500 font-light tracking-wide text-sm uppercase">Academic Foundation Management</p>
          </div>
          <button onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-transparent border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white hover:text-black transition-all duration-300">
            Add Academic Record
          </button>
        </div>

        {isLoading ? (
          <div className="animate-pulse h-24 bg-zinc-900/50 rounded-2xl w-full border border-white/5" />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {education?.map((edu: any) => (
              <div key={edu._id} className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 flex justify-between items-center group hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-500">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-medium tracking-tight text-white group-hover:text-amber-500 transition-colors">
                      {edu.degree}
                    </h3>
                    <span className="text-sm font-mono text-zinc-500">@ {edu.institution}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest px-3 py-1.5 bg-zinc-950 border border-white/5 rounded-full text-zinc-400">
                    {edu.period}
                  </span>
                </div>
              </div>
            ))}
            {education?.length === 0 && (
              <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl text-zinc-500 font-light tracking-wide">
                No academic records found. Add your first degree.
              </div>
            )}
          </div>
        )}
      </div>
      <EducationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}