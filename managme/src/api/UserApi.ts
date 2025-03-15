export interface User {
    id: string;
    firstName: string;
    lastName: string;
  }
  
  export class UserApi {
    private static readonly MOCK_USER: User = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
    };
  
    static getLoggedInUser(): User {
      return this.MOCK_USER;
    }
  }