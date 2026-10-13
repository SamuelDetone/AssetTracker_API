import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ZodType } from 'zod';

type RequestSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

export function validateRequest(schemas: RequestSchemas) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    if (schemas.body) {
      request.body = schemas.body.parse(request.body);
    }

    if (schemas.params) {
      const parsedParams = schemas.params.parse(
        request.params,
      ) as ParamsDictionary;

      Object.assign(request.params, parsedParams);
    }

    if (schemas.query) {
      const parsedQuery = schemas.query.parse(request.query) as ParsedQs;

      Object.assign(request.query, parsedQuery);
    }

    next();
  };
}
