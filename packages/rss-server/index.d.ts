import type { ParameterizedContext } from "koa";
import type { Cache } from "../middleware/cache/base";
export {};

declare global {
  export type RSSHubArticle = {
    title: string;
    pubDate: Date | string;
    link: string;
    guid: string;
    description: string;
    author: string;
  };

  export type RSSHubContext = ParameterizedContext<{ data: { title: string; link: string; item: Array<RSSHubArticle> } }, { cache: Cache }>;
  /**
   * Item 类型定义
   */
  export interface Item {
    title: string;
    pubDate: string;
    author: string;
    link: string;
    guid: string;
    description: string;
  }

  /**
   * ContextData 类型定义
   */
  export interface ContextData {
    title: string;
    link: string;
    item: Array<Item>;
  }

  /**
   * ContextCache 类型定义
   */
  export type ContextCache = import("@/middleware/cache/base").Cache;

  /**
   * RSSHubKoaContext 类型定义
   */
  export type RSSHubKoaContext = import("koa").ParameterizedContext<
    {
      data: ContextData;
    },
    {
      cache: ContextCache;
    }
  >;
}
