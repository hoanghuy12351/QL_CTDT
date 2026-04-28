import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

type ValidateSchema = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

export const validate = (schema: ValidateSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const validated = {
      body: schema.body ? schema.body.parse(req.body) : undefined,
      query: schema.query ? schema.query.parse(req.query) : undefined,
      params: schema.params ? schema.params.parse(req.params) : undefined,
    };

    // Khong gan lai req.query vi Express 5 co getter only. Luu ket qua vao req.validated.
    req.validated = validated;
    next();
  };
};
