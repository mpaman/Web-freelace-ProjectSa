export interface PostworkInterface {
  ID: number;
  User?: {
      first_name: string;
      last_name: string;
  };
  Work?: {
      category: string;
      info: string;
  };
}
