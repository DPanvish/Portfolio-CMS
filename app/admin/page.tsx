"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProjectModal from "@/components/ProjectModal";

interface Project {
  _id: string;
  title: string;
  portfolios: string[];
  techStack: string[];
}

const fetchProjects = async (): Promise<Project[]> => {
  const res = await fetch("/api/projects");
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

export default function AdminProjects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  return (
    <div className="min-h-screen bg-zinc-950 p-10 lg:p-16 text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Luxury Header */}
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-light tracking-tight mb-2">Projects</h1>
            <p className="text-zinc-500 font-light tracking-wide text-sm uppercase">Database Architecture Management</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-transparent border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white hover:text-black transition-all duration-300"
          >
            Deploy New Project
          </button>
        </div>

        {/* Content State */}
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-zinc-900/50 rounded-2xl w-full border border-white/5" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-red-400 bg-red-950/30 border border-red-900/50 p-6 rounded-2xl font-light">
            Database connection failed. Verify your MongoDB credentials.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects?.map((project) => (
              <div key={project._id} className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 flex justify-between items-center group hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-500">
                
                <div>
                  <h3 className="text-xl font-medium tracking-tight text-white mb-3 group-hover:text-amber-500 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex gap-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="text-[10px] uppercase tracking-widest px-3 py-1.5 bg-zinc-950 border border-white/5 rounded-full text-zinc-400">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span className="text-[10px] tracking-widest uppercase text-zinc-600">Distribution Targets</span>
                  <div className="flex gap-2">
                    {project.portfolios.map(p => (
                      <div key={p} className="px-2 py-1 rounded border border-amber-500/20 bg-amber-500/5 text-[10px] text-amber-500/80 uppercase tracking-wider">
                        {p}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
            
            {projects?.length === 0 && (
              <div className="text-center py-32 border border-dashed border-white/10 rounded-3xl text-zinc-500 font-light tracking-wide">
                The database is empty. Awaiting first deployment.
              </div>
            )}
          </div>
        )}
      </div>

      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}