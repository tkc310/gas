import doPost, { run, env } from './doPost';

declare const global: {
  [x: string]: unknown;
};

global.doPost = doPost;
global.test = run;
global.env = env;
