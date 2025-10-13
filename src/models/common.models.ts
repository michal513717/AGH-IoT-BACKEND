import * as http from "http";

export type HttpServer = http.Server;
export type NextFunction = (args: CommonNextFunctionArgs) => void;
export type CommonNextFunctionArgs = unknown;