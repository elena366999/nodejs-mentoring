import { Request } from 'express';

export type ReqPredicate = (req: Request) => boolean;
