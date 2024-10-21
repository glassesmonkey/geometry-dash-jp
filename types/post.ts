export interface Author {
  name: string;
  image: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  authorId: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  author: Author;
  tags: Tag[];
}