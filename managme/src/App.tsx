import React, { useState, useEffect } from 'react';
import { ProjectApi, Project } from './api/ProjectApi';
import { StoryApi, Story } from './api/StoryApi';
import { UserApi, User } from './api/UserApi';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setProjects(ProjectApi.getAll());
    setUser(UserApi.getLoggedInUser());
  }, []);

  useEffect(() => {
    if (currentProjectId) {
      setStories(StoryApi.getByProject(currentProjectId));
    }
  }, [currentProjectId]);

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
    if (currentProjectId === id) {
      setCurrentProjectId(null);
      setStories([]);
    }
  };

  const handleSelectProject = (id: string) => {
    setCurrentProjectId(id);
  };

  const handleAddStory = () => {
    if (!currentProjectId) return;
    const newStory: Story = {
      id: uuidv4(),
      name,
      description,
      priority: priority,
      projectId: currentProjectId,
      createdAt: new Date().toISOString(),
      status: 'todo',
      ownerId: user!.id,
    };
    StoryApi.create(newStory);
    setStories(StoryApi.getByProject(currentProjectId));
    setName('');
    setDescription('');
    setPriority('medium');
  };

  const handleDeleteStory = (id: string) => {
    StoryApi.delete(id);
    if (currentProjectId) {
      setStories(StoryApi.getByProject(currentProjectId));
    }
  };

  const handleChangeStoryStatus = (story: Story, newStatus: 'todo' | 'doing' | 'done') => {
    const updatedStory = { ...story, status: newStatus };
    StoryApi.update(updatedStory);
    if (currentProjectId) {
      setStories(StoryApi.getByProject(currentProjectId));
    }
  };

  const filterStories = (status: 'todo' | 'doing' | 'done') => {
    return stories.filter(story => story.status === status);
  };

  return (
    <div className="container">
      <h1>ManagMe - Project Management</h1>
      {user && (
        <div>
          <p>Logged in as: {user.firstName} {user.lastName}</p>
        </div>
      )}
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {currentProjectId && (
          <select value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        )}
        <button onClick={handleAddProject}>Add Project</button>
        <button onClick={handleAddStory} disabled={!currentProjectId}>Add Story</button>
      </div>
      <div>
        <h2>Projects</h2>
        {projects.map((project) => (
          <div key={project.id} className="project">
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <button onClick={() => handleSelectProject(project.id)}>Select</button>
            <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
          </div>
        ))}
      </div>
      {currentProjectId && (
        <div>
          <h2>Stories</h2>
          <div>
            <h3>Todo</h3>
            {filterStories('todo').map((story) => (
              <div key={story.id} className="story">
                <h3>{story.name}</h3>
                <p>{story.description}</p>
                <p>Priority: {story.priority}</p>
                <p>Status: {story.status}</p>
                <button onClick={() => handleDeleteStory(story.id)}>Delete</button>
                <button onClick={() => handleChangeStoryStatus(story, 'doing')}>Move to Doing</button>
                <button onClick={() => handleChangeStoryStatus(story, 'done')}>Move to Done</button>
              </div>
            ))}
          </div>
          <div>
            <h3>Doing</h3>
            {filterStories('doing').map((story) => (
              <div key={story.id} className="story">
                <h3>{story.name}</h3>
                <p>{story.description}</p>
                <p>Priority: {story.priority}</p>
                <p>Status: {story.status}</p>
                <button onClick={() => handleDeleteStory(story.id)}>Delete</button>
                <button onClick={() => handleChangeStoryStatus(story, 'todo')}>Move to Todo</button>
                <button onClick={() => handleChangeStoryStatus(story, 'done')}>Move to Done</button>
              </div>
            ))}
          </div>
          <div>
            <h3>Done</h3>
            {filterStories('done').map((story) => (
              <div key={story.id} className="story">
                <h3>{story.name}</h3>
                <p>{story.description}</p>
                <p>Priority: {story.priority}</p>
                <p>Status: {story.status}</p>
                <button onClick={() => handleDeleteStory(story.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;