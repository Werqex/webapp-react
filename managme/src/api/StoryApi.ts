export interface Story {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  createdAt: string;
  status: 'todo' | 'doing' | 'done';
  ownerId: string;
}

export class StoryApi {
  private static readonly STORAGE_KEY = 'stories';

  static getAll(): Story[] {
    const stories = localStorage.getItem(this.STORAGE_KEY);
    return stories ? JSON.parse(stories) : [];
  }

  static getByProject(projectId: string): Story[] {
    return this.getAll().filter(story => story.projectId === projectId);
  }

  static create(story: Story): void {
    const stories = this.getAll();
    stories.push(story);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
  }

  static update(updatedStory: Story): void {
    let stories = this.getAll();
    stories = stories.map(story =>
      story.id === updatedStory.id ? updatedStory : story
    );
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
  }

  static delete(id: string): void {
    let stories = this.getAll();
    stories = stories.filter(story => story.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
  }
}