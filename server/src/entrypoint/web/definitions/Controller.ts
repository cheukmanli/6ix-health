import { Response, RequestHandler, NextFunction, Request } from 'express';
import { DecodedExpressRequest } from 'entrypoint/web/util/DecodedExpressRequest';

// export enum Method {
//   GET = "GET",
//   Todo = "Todo",
//   PUT = "PUT",
//   DELETE = "DELETE",
//   PATCH = "PATCH",
//   OPTIONS = "OPTIONS",
//   HEAD = "HEAD",
// }

// const getRouterMatcher = (router: Router, method: Method): IRouterMatcher<Router> => {

//   const methodMatcher = {
//     "GET": (): IRouterMatcher<Router> => router.get,
//     "Todo": (): IRouterMatcher<Router> => router.Todo,
//     "PUT": (): IRouterMatcher<Router> => router.put,
//     "DELETE": (): IRouterMatcher<Router> => router.delete,
//     "PATCH": (): IRouterMatcher<Router> => router.patch,
//     "OPTIONS": (): IRouterMatcher<Router> => router.options,
//     "HEAD": (): IRouterMatcher<Router> => router.head,
//     "default": (): IRouterMatcher<Router> => router.get,
//   };

//   return (methodMatcher[method] || methodMatcher.default)();

// };

/*
  to create higher order route
  which handles error problem using async middleware with express
*/
export const awaitHandlerFactory = (middleware: RequestHandler) => {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await middleware(req, res, next);
    } catch (e) {
      next(e);
    }
  };
};

abstract class BaseController {
  protected abstract async processRequest(
    req: DecodedExpressRequest,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  public getRequestHandler(): RequestHandler {
    const handler = this.processRequest.bind(this);
    return awaitHandlerFactory(handler);
  }

  protected ok<T>(res: Response, dto?: T): {} {
    if (dto) {
      res.type('application/json');
      return res.status(200).json(dto);
    } else {
      return res.sendStatus(200);
    }
  }

  protected fail(res: Response, error: Error | string): {} {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.status(500).json({
      message: error.toString(),
    });
  }

  protected badRequest(res: Response, message?: string): {} {
    return BaseController.jsonResponse(res, 400, {
      message: message && message !== '' ? message : 'bad request',
    });
  }

  protected unauthorized(res: Response, message?: string): {} {
    return BaseController.jsonResponse(res, 401, {
      message: message && message !== '' ? message : 'Unauthorized',
    });
  }

  protected forbidden(res: Response, message?: string): {} {
    return BaseController.jsonResponse(res, 403, {
      message: message && message !== '' ? message : 'Forbidden',
    });
  }

  protected notFound(res: Response, message?: string): {} {
    return BaseController.jsonResponse(res, 404, {
      message: message && message !== '' ? message : 'Not found',
    });
  }

  protected alreadyExists(res: Response, message?: string): {} {
    return BaseController.jsonResponse(res, 409, {
      message: message && message !== '' ? message : 'Already exists',
    });
  }

  protected created(res: Response, payload: {} = {}): {} {
    return BaseController.jsonResponse(res, 201, payload);
  }

  protected static jsonResponse(res: Response, code: number, payload: {}): {} {
    return res.status(code).json(payload);
  }
}

export default BaseController;
