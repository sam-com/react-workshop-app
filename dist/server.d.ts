import type { RequestHandler, SetupWorkerApi } from 'msw';
import type { SetupServerApi } from 'msw/node';
declare const server: SetupServerApi | SetupWorkerApi;
declare function setup({ handlers, }: {
    handlers: Array<RequestHandler>;
}): SetupServerApi | SetupWorkerApi;
export * from 'msw';
export { setup, server };
