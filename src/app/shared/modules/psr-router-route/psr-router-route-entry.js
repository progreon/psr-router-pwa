class RouteEntry {
  constructor(route, entryInfo, children, location) {
    this.route = route;
    this.entryInfo = entryInfo;
    this.children = children;
    this.location = location;
  }

  getRouteType() {
    return "ENTRY";
  }
}
