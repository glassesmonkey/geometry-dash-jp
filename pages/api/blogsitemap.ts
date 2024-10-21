
import { getWispClient } from '../../lib/wisp'  // 请替换为实际的import路径
import { NextApiRequest, NextApiResponse } from 'next'
interface Post {
    slug: string;
    // 可以根据需要添加其他属性
    title?: string;
    createdAt?: string;
    // ...其他属性
  }
  
  // 定义 BlogPostResult 类型
  interface BlogPostResult {
    posts: Post[];
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
      totalPosts: number;
      nextPage: number | null;
      prevPage: number | null;
    };
  }
  function generateSiteMap(posts: Post[]): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       <url>
         <loc>https://geometrydashjp.com</loc>
       </url>

       ${posts
         .map(({ slug }) => {
           return `
         <url>
             <loc>${`https://geometrydashjp.com/blog/${slug}`}</loc>
         </url>
       `
         })
         .join('')}
     </urlset>
   `
  }
  
  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      // 使用 SDK 获取所有文章
      const wisp = await getWispClient();
      const blogPostResult: BlogPostResult = await wisp.getPosts({ limit: 'all' });
  
      // 生成 XML sitemap
      const sitemap = generateSiteMap(blogPostResult.posts);
  
      // 设置正确的 content type
      res.setHeader('Content-Type', 'text/xml');
      
      // 发送 XML 到浏览器并结束响应
      res.status(200).send(sitemap);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).json({ error: 'Error generating sitemap' });
    }
  }