// types/postdetail.ts

export interface Author {
    name: string;
    image: string;
  }
  
  export interface Tag {
    id: string;
    name: string;
  }
  
  export interface PostDetail {
    id: string;
    title: string;
    image: string;
    content: string;
    description: string;
    slug: string;
    authorId: string;
    teamId: string;
    createdAt: string;
    updatedAt: string;
    published: boolean;
    author: Author;
    tags: Tag[];
  }
  
  export interface CTA {
    id: string;
    title: string;
    description: string;
    slug: string;
    teamId: string;
    createdAt: string;
    updatedAt: string;
    distance: number;
  }
  
  export interface PostDetailPageData {
    post: PostDetail;
    relatedPosts: PostDetail[];
    cta: CTA | null;
  }