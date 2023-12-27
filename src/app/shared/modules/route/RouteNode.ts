import { RouteAction } from "./RouteAction";

export class RouteNode {
    protected childNodes: RouteNode[];
    protected actions: RouteAction[];
}