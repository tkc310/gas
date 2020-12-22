import doPost from './doPost';

declare const global: {
  [x: string]: unknown;
};

global.doPost = doPost;
