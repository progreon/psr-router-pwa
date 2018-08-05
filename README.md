# My App
My App description
## Description
My App description
## Getting Started
### Dependencies
* npm
* yarn
### Installing
Clone the repo and run yarn
```shell
$ git clone git@github.com:progreon/pwa-p3-webpack-starter-kit.git pwa-p3-webpack-starter-kit && cd pwa-p3-webpack-starter-kit
$ yarn
```
## Scripts
For each of these scripts you can add `:dev` or `:prod` to run these for development or production:
```shell
$ yarn <script>[:dev|:prod] [options]
```
### Serving
*default: dev*
```shell
$ yarn serve --open
```
Mainly used during development, rebuilds automatically on each save and the browser will refresh automatically.
*NOTE: if a service worker is active, you'll have to refresh again manually for the new cached modules to be loaded*
### Building
*default: prod*
```shell
$ yarn build
```
### Executing
*default: prod*
```shell
$ yarn start -o
```
### Profiling
*default: prod*
```shell
$ yarn build:profile
```
This command will generate `stats.json`, which you can upload [here](https://alexkuz.github.io/webpack-chart/) or [here](https://chrisbateman.github.io/webpack-visualizer/) to visualize the sizes of each package.
### Other
To see a list of all the available scripts you can run this command and select a script to run:
```shell
$ yarn run
```
If you want to run a specific script, run:
```shell
$ yarn [run] <script>
```
## Development
### Add dependencies
```shell
$ yarn add <package...> [-D]
```
See [here](https://yarnpkg.com/en/docs/cli/add) for more documentation.
## Help
If any issues with installing and/or running, look at the documentations of npm, webpack or polymer and/or contact me.
## Authors
Marco Willems
## Version History
No releases yet!
## License
This project is licensed under the ISC License - see the LICENSE.md file for details
## Acknowledgments
* [Webpack guides](https://webpack.js.org/guides/)
* [polymer3-webpack-starter-kit](https://github.com/Dabolus/polymer3-webpack-starter-kit)
