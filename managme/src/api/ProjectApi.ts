export interface Project {
    id: string;
    name: string;
    description: string;
  }
  
  export class ProjectApi {
    private static readonly STORAGE_KEY = 'projects';
  
    static getAll(): Project[] {
      const projects = localStorage.getItem(this.STORAGE_KEY);
      return projects ? JSON.parse(projects) : [];
    }
  
    static get(id: string): Project | undefined {
      const projects = this.getAll();
      return projects.find(project => project.id === id);
    }
  
    static create(project: Project): void {
      const projects = this.getAll();
      projects.push(project);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    }
  
    static update(updatedProject: Project): void {
      let projects = this.getAll();
      projects = projects.map(project =>
        project.id === updatedProject.id ? updatedProject : project
      );
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    }
  
    static delete(id: string): void {
      let projects = this.getAll();
      projects = projects.filter(project => project.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    }
  }