import { Response } from 'express';

/**
 * HTTP Status Codes
 */
export enum HttpStatus {
  // Success
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  // Client Errors
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,

  // Server Errors
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * Standard API Response Interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: any[];
  timestamp: string;
  path?: string;
}

/**
 * HTTP Response Utility Class
 * Provides reusable methods for sending standardized HTTP responses
 */
export class HttpResponse {
  /**
   * Send a success response
   */
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: HttpStatus = HttpStatus.OK
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message: message || 'Success',
      data,
      timestamp: new Date().toISOString()
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send a created response (201)
   */
  static created<T>(res: Response, data: T, message?: string): Response {
    return HttpResponse.success(res, data, message || 'Resource created successfully', HttpStatus.CREATED);
  }

  /**
   * Send a no content response (204)
   */
  static noContent(res: Response): Response {
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  /**
   * Send an error response
   */
  static error(
    res: Response,
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    errors?: any[]
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error: message,
      ...(errors && { errors }),
      timestamp: new Date().toISOString()
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send a bad request response (400)
   */
  static badRequest(res: Response, message: string = 'Bad Request', errors?: any[]): Response {
    return HttpResponse.error(res, message, HttpStatus.BAD_REQUEST, errors);
  }

  /**
   * Send an unauthorized response (401)
   */
  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return HttpResponse.error(res, message, HttpStatus.UNAUTHORIZED);
  }

  /**
   * Send a forbidden response (403)
   */
  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return HttpResponse.error(res, message, HttpStatus.FORBIDDEN);
  }

  /**
   * Send a not found response (404)
   */
  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return HttpResponse.error(res, message, HttpStatus.NOT_FOUND);
  }

  /**
   * Send a conflict response (409)
   */
  static conflict(res: Response, message: string = 'Resource already exists'): Response {
    return HttpResponse.error(res, message, HttpStatus.CONFLICT);
  }

  /**
   * Send an unprocessable entity response (422)
   */
  static unprocessableEntity(res: Response, message: string = 'Validation failed', errors?: any[]): Response {
    return HttpResponse.error(res, message, HttpStatus.UNPROCESSABLE_ENTITY, errors);
  }

  /**
   * Send an internal server error response (500)
   */
  static internalError(res: Response, message: string = 'Internal Server Error'): Response {
    return HttpResponse.error(res, message, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  /**
   * Send a service unavailable response (503)
   */
  static serviceUnavailable(res: Response, message: string = 'Service Unavailable'): Response {
    return HttpResponse.error(res, message, HttpStatus.SERVICE_UNAVAILABLE);
  }
}

/**
 * Get HTTP status code name
 */
export function getStatusName(statusCode: HttpStatus): string {
  return HttpStatus[statusCode] || 'UNKNOWN';
}

/**
 * Check if status code is successful (2xx)
 */
export function isSuccessStatus(statusCode: number): boolean {
  return statusCode >= 200 && statusCode < 300;
}

/**
 * Check if status code is client error (4xx)
 */
export function isClientError(statusCode: number): boolean {
  return statusCode >= 400 && statusCode < 500;
}

/**
 * Check if status code is server error (5xx)
 */
export function isServerError(statusCode: number): boolean {
  return statusCode >= 500 && statusCode < 600;
}
