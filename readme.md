# How To Run 
1. Install NodeJS >= 6.2.2
2. Install global dependencies `$ npm install -g webpack webpack-dev-server karma-cli protractor typescript`
3. Install project dependencies `$ npm install`
4. Start development server `$ npm run server`
5. Go to http://0.0.0.0:2509 or http://localhost:2509 in your browser
# Deployment
```
$ npm run build:deploy:<profile>
```
- `<profile>`: Could be `nois`, `staging`, `production`. Please adjust configuration for those profile in `app/config/deploy.config.js`

## How to create new profile?
- Clone following files: `config/deploy/development.js`, `config/vars/development.js` then adjust values for your environment. 
E.g: `config/deploy/<your new profile name>.js`, `config/vars/<your new profile name>.js`
- Open `package.json`, add following code to `scripts`
```
{
  ...
  scripts: {
    ...
    "build:<your new profile name>": "npm run build:aot:prod -- --env.profile=<your new profile name>",
    "deploy:<your new profile name>": "node deploy <your new profile name>",    
    "build:deploy:<your new profile name>": "npm run build:<your new profile name> && node deploy <your new profile name>",
  }
  ...
}
```

# To Do
1. ~~Apply module, component lazy load~~
2. Unit Test Set up
3. E2E Test Set up (Protractor)
4. Complete the Theme features
5. Server-side Loading using Angular Universal
6. ~~AoT https://angular.io/docs/ts/latest/cookbook/aot-compiler.html~~
7. Use Rollup: https://github.com/jkuri/angular-rollup-starter
8. ~~View caching. Sample https://plnkr.co/edit/GuQuWnW2GsfnBOVyWQRh?p=preview~~

# Theme
`http://pages.revox.io/dashboard/latest/html/`

# File Structure
```
angular2-starter/
 ├──config/                        * our configuration
 │   ├──helpers.js                 * helper functions for our configuration files
 │   ├──spec-bundle.js             * ignore this magic that sets up our angular 2 testing environment
 │   ├──karma.conf.js              * karma config for our unit tests
 │   ├──protractor.conf.js         * protractor config for our end-to-end tests
 │   ├──webpack.dev.js             * our development webpack config
 │   ├──webpack.prod.js            * our production webpack config
 │   └──webpack.test.js            * our testing webpack config
 │
 ├──src/                           * our source files that will be compiled to javascript
 │   ├──main.browser.ts            * our entry file for our browser environment
 │   │
 │   ├──index.html                 * Index.html: where we generate our index page
 │   │
 │   ├──polyfills.ts               * our polyfills file
 │   │
 │   ├──app/                       * WebApp: folder
 │   │   ├──shared/                * our shared components, services, pipes, directives, modules for entire app
 │   │   ├──app.module.ts          * App Module
 │   │   ├──app.routes.ts          * Route configuration
 │   │   ├──app.component.spec.ts  * a simple test of components in app.component.ts
 │   │   ├──app.e2e.ts             * a simple end-to-end test for /
 │   │   ├──app.firebase.ts        * Firebase configuration
 │   │   └──app.component.ts       * a simple version of our App component components
 │   │
 │   ├──assets/                    * static assets are served here
 │   │   ├──icon/                  * our list of favicon icons
 │   │   ├──service-worker.js      * ignore this. Web App service worker that's not complete yet
 │   │   ├──robots.txt             * for search engines to crawl your website
 │   │   └──humans.txt             * for humans to know who the developers are
 │   │
 │   └──styles/                    * Our Starter styles
 |       └──styles.scss            * Our Vendor styles
 │
 ├──tslint.json                    * typescript lint config
 ├──typedoc.json                   * typescript documentation generator
 ├──tsconfig.json                  * typescript config used outside webpack
 ├──tsconfig.webpack.json          * config that webpack uses for typescript (AoT)
 ├──package.json                   * what npm uses to manage it's dependencies
 └──webpack.config.js              * webpack main configuration file
```

# Generate favicons
1. Make sure you have file `favicon.png` in `src/app/icon` exist and have size at least `250x250`
2. Install ImageMagick (Version >= 7.0.4-7-Q16)
    - For Windows: https://www.imagemagick.org/script/download.php
    - For Mac OSX: `$ brew install imagemagick`
3. Generate favicons
    - For Windows: `$ .\config\favicons\convert.bat`
    - For Mac OSX: 


# How To Make CI For App
1. Create Web App in Azure
2. Go to `https://<your app name>.scm.azurewebsites.net/api/sshkey?ensurePublicKey=1` to get SSH Deploy key
3. Go to Gitlab Repository, add `Deploy Keys` to Project
4. Back to Azure Portal > Your app > Deployment > Deployment Options > Setup External Reposity using git url (not https)
5. Enable Auto-deploy when push, merge
    - Go to Project > Integrations
    - Go to Azure > Your app > Properties to get deploy trigger url and pass to integration url in gitlab
6. Send mail when deployment failed or success:
    - Use service from https://zapier.com
    - Use template *Send SMTP emails for new Azure App Service deployments* https://zapier.com/app/editor/template/4779
    

# AoT Don'ts
The following are some things that will make AoT compile fail.

- Don’t use require statements for your templates or styles, use styleUrls and templateUrls, the angular2-template-loader plugin will change it to require at build time.
- Don’t use default exports.
- Don’t use `form.controls.controlName`, use `form.get(‘controlName’)`
- Don’t use `control.errors?.someError`, use `control.hasError(‘someError’)`
- Don’t use functions in your providers, routes or declarations, export a function and then reference that function name
- @Inputs, @Outputs, View or Content Child(ren), Hostbindings, and any field you use from the template or annotate for Angular should be public
- If funtion's paremeters can be null (not passed), set default value for that parameters. Don't use `getColor(flag)`, use `getColor(flag: string = '')` OR it cause the issue `Supplied parameters do not match any signature of call target`
- When use `ngOnChanges`, make sure you defined parameter for it. Don't use `ngOnChanges()`, use `ngOnChanges(changes: SimpleChanges)` OR it cause the issue `Supplied parameters do not match any signature of call target`

## How to add AoT support for unsupport module from github
1. Duplicate current `tsconfig.json` to `tsconfig-aot.json`. Modify following line code:
```
{
  "compilerOptions": {
    "noImplicitAny": false,           // required exactly
    "module": "es2015",               // required exactly
    "target": "ES5",                  // required exactly
	"moduleResolution": "node",       // required exactly
    "emitDecoratorMetadata": true,    // required exactly
    "experimentalDecorators": true,   // required exactly
    "sourceMap": false,               // required exactly
    "declaration": true,              // required exactly
    "lib": ["es5", "es6", "dom"],
    "outDir": "./dist"                // required exactly
  },
  "files": [
    "///.ts"                          // Main module file path
  ],
  ...
  "angularCompilerOptions": {         // required exactly
    "genDir": "aot",
    "strictMetadataEmit": true
  }
  ...
}
```
2. Edit `package.json` add following code to scripts section:
```
{
...
scripts: {
  ...
  "build:aot": "rimraf dist && ngc -p tsconfig-aot.json"
}
...
}
```
3. Make sure you have `typescript@~2.2.2`, all angular modules `@^2.3.1` in `devDependencies`
4. Make sure no angular modules declaration in `dependencies`
5. Edit `main` in `package.json` to `"main": "./dist/index.js"` or your main load file
6. Run `$ npm install` then `$ npm run build:aot`

# Universal "Gotchas"

> When building Universal components in Angular 2 there are a few things to keep in mind.

 - To use `templateUrl` or `styleUrls` you must use **`angular2-template-loader`** in your TS loaders.
    - This is already setup within this starter repo. Look at the webpack.config file [here](https://github.com/angular/universal-starter/blob/master/webpack.config.ts) for details & implementation.
 - **`window`**, **`document`**, **`navigator`**, and other browser types - _do not exist on the server_ - so using them, or any library that uses them (jQuery for example) will not work. You do have some options, if you truly need some of this functionality:
    - If you need to use them, consider limiting them to only your main.client and wrapping them situationally with the imported *isBrowser / isNode* features from Universal.  `import { isBrowser, isNode } from 'angular2-universal'`;
    - Another option is using `DOM` from ["@angular/platform-browser"](https://github.com/angular/angular/blob/e3687706c71beb7c9dbdae1bbb5fbbcea588c476/modules/%40angular/platform-browser/src/dom/dom_adapter.ts#L34)
 - **Don't manipulate the nativeElement directly**. Use the _Renderer_. We do this to ensure that in any environment we're able to change our view.
```
constructor(element: ElementRef, renderer: Renderer) {
  renderer.setElementStyle(element.nativeElement, 'font-size', 'x-large');
}
```
 - The application runs XHR requests on the server & once again on the Client-side (when the application bootstraps)
    - Use a [UniversalCache](https://github.com/angular/universal-starter/blob/master/src/%2Bapp/shared/model/model.service.ts#L34-L50) instead of regular Http, to save certain requests so they aren't re-ran again on the Client. ([Example useage here](https://github.com/angular/universal-starter/blob/cc71e2d5b2d783f2bb52eebd1b5c6fa0ba23f08a/src/%2Bapp/%2Bhome/home.component.ts#L22-L24))
 - Know the difference between attributes and properties in relation to the DOM.
 - Keep your directives stateless as much as possible. For stateful directives, you may need to provide an attribute that reflects the corresponding property with an initial string value such as url in img tag. For our native `<img src="">` element the src attribute is reflected as the src property of the element type HTMLImageElement.


# Useful Links
- Tree Shaking: http://blog.rangle.io/optimize-your-angular2-application-with-tree-shaking/
- JiT and AoT: http://blog.mgechev.com/2016/08/14/ahead-of-time-compilation-angular-offline-precompilation/
- Page speed test: https://www.webpagetest.org/
- Server side rendering: https://github.com/AngularClass/angular2-webpack-starter/pull/1165/files


# Troubleshooting
1. `Could not resolve <module> relative to ..app.module.ts`
    - Reason: <module> was not installed
    - Solution: Install <module>
2. `Unexpected value <module> imported by the module <Appmodule>`
    - Reason: metadata for module not found
    - Solution: Generate metadata file by running aot build on module
3. `Error encountered resolving symbol values statically. Calling function 'makeDecorator', function calls are not supported. Consider replacing the function or lambda with a reference to an exported function, resolving symbol NgModule ....`
	- Reason: UNKNOWN
	- Solution: remove `node_modules` from feature module	
4. `Template parse errors: Can't bind to 'some-component-directive' since it isn't a known property of 'some-element'...`
    - Reason: Module `some-component-directive` not import yet
    - Solution: Import `some-component-directive` module into App
5. `TypeError: Data must be a string or a buffer`
    - Reason: Wrong import/export
    - Resolution: Editing the following file: `node_modules/webpack/lib/dependencies/HarmonyExportImportedSpecifierDependency.js` and insert some log at line 144:
```
updateHash(hash) {
  super.updateHash(hash);
  const hashValue = this.getHashValue(this.importDependency.module);

  if (this.importDependency.module != null){
     // console.log('Module resource: ', this.importDependency.module.resource);
  }else{
     console.log('\nFile not found: ', this.importDependency);
  }

  hash.update(hashValue);
}
```    
6. `Error: Can't resolve 'promise-polyfill'`
    - Reason: ...
    - Resolution: `$ npm install --save-extract promise-polyfill`


# Note
