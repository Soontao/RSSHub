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

  export type RSSHubContext = ParameterizedContext<
    { data: { title: string; link: string; item: Array<RSSHubArticle> } },
    { cache: Cache }
  >;
}
