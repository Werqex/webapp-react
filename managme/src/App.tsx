import React, { useState, useEffect } from 'react';
import { ProjectApi, Project } from './api/ProjectApi';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setProjects(ProjectApi.getAll());
  }, []);

  const handleAddProject = () => {
    const newProject: Project = {
      id: uuidv4(),
      name,
      description,
    };
    ProjectApi.create(newProject);
    setProjects(ProjectApi.getAll());
    setName('');
    setDescription('');
  };

  const handleDeleteProject = (id: string) => {
    ProjectApi.delete(id);
    setProjects(ProjectApi.getAll());
  };

  return (
    <div className="container">
      <h1>ManagMe - Project Management</h1>
      <div>
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleAddProject}>Add Project</button>
      </div>
      <div>
        {projects.map((project) => (
          <div key={project.id} className="project">
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;