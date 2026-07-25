"use client";

import { useQuery } from "@tanstack/react-query";

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
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Project Architecture</h1>
        <button className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-neutral-200 transition-colors">
          + Deploy New Project
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-neutral-900 rounded-xl w-full border border-neutral-800" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">Failed to load projects. Ensure MongoDB is connected.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects?.map((project) => (
            <div key={project._id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex justify-between items-center group hover:border-neutral-700 transition-colors">
              <div>
                <h3 className="text-xl font-medium text-white mb-2">{project.title}</h3>
                <div className="flex gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="text-xs px-2 py-1 bg-neutral-950 border border-neutral-800 rounded text-neutral-400">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs tracking-wider uppercase text-neutral-500">Target Portfolios</span>
                <div className="flex gap-1">
                  {project.portfolios.map(p => (
                    <span key={p} className="w-2 h-2 rounded-full bg-accent-primary" title={p} />
                  ))}
                </div>
              </div>
            </div>
          ))}
          {projects?.length === 0 && (
            <div className="text-center py-20 border border-dashed border-neutral-800 rounded-xl text-neutral-500">
              No projects found. Deploy your first one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}