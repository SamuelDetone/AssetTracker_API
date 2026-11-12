import { NextFunction, Request, Response } from 'express';

type SanitizableRecord = Record<string, unknown>;

function sanitizeString(value: string): string {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

function sanitizeKey(key: string): string {
  const normalizedKey = key.replace(/[$.]/g, '_');

  if (
    normalizedKey === '__proto__' ||
    normalizedKey === 'constructor' ||
    normalizedKey === 'prototype'
  ) {
    return `_${normalizedKey}`;
  }

  return normalizedKey;
}

function isRecord(value: unknown): value is SanitizableRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepSanitize(value: unknown): unknown {
  if (typeof value === 'string') {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return value.map(deepSanitize);
  }

  if (isRecord(value)) {
    const sanitized: SanitizableRecord = {};

    for (const [key, nestedValue] of Object.entries(value)) {
      sanitized[sanitizeKey(key)] = deepSanitize(nestedValue);
    }

    return sanitized;
  }

  return value;
}

function sanitizeRecordInPlace(record: SanitizableRecord): void {
  const sanitized = deepSanitize(record) as SanitizableRecord;

  for (const key of Object.keys(record)) {
    delete record[key];
  }

  Object.assign(record, sanitized);
}

export function sanitizeRequest(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  if (isRecord(request.body)) {
    request.body = deepSanitize(request.body);
  }

  sanitizeRecordInPlace(request.params as SanitizableRecord);
  sanitizeRecordInPlace(request.query as SanitizableRecord);

  next();
}
