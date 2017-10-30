import helpers from './helper'
import webpack from 'webpack'
import webpackMerge from 'webpack-merge' // use to merge multiple webpack config
const webpackMergeDll = webpackMerge.strategy({plugins: 'replace'});
import commonConfig from './webpack.common.js'// the settings that are common to prod and dev
/**
 * Webpack Plugins
 */
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin'
import DefinePlugin from 'webpack/lib/DefinePlugin'
import NamedModulesPlugin from 'webpack/lib/NamedModulesPlugin'
import LoaderOptionsPlugin from 'webpack/lib/LoaderOptionsPlugin'
import DllBundlesPlugin from 'webpack-dll-bundles-plugin/DllBundlesPlugin';
/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development'
const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 2509
const HMR = helpers.hasProcessFlag('hot')
const METADATA = webpackMerge(commonConfig({env: ENV}).metadata, {
    host: HOST,
    port: PORT,
    ENV: ENV,
    HMR: HMR
  });
/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
export default (options) =>  (webpackMerge(commonConfig({env: ENV}),{
    /**
     * Developer tool to enhance debugging
     *
     * See: http://webpack.github.io/docs/configuration.html#devtool
     * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
     */
    devtool: 'cheap-module-source-map',

    /**
     * Options affecting the output of the compilation.
     *
     * See: http://webpack.github.io/docs/configuration.html#output
     */
    output: {

        /**
         * The output directory as absolute path (required).
         *
         * See: http://webpack.github.io/docs/configuration.html#output-path
         */
        path: helpers.root('dist'),

        /**
         * Specifies the name of each output file on disk.
         * IMPORTANT: You must not specify an absolute path here!
         *
         * See: http://webpack.github.io/docs/configuration.html#output-filename
         */
        filename: '[name].bundle.js',

        /**
         * The filename of the SourceMaps for the JavaScript files.
         * They are inside the output.path directory.
         *
         * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
         */
        sourceMapFilename: '[file].map',

        /** The filename of non-entry chunks as relative path
         * inside the output.path directory.
         *
         * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
         */
        chunkFilename: '[id].chunk.js',

        library: 'ac_[name]',
        libraryTarget: 'var',
    },

    module: {

        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'tslint-loader',
                        options: {
                            configFile: 'tslint.json'
                        }
                    }
                ],
                exclude: [/\.(spec|e2e)\.ts$/, /node_modules/]
            },

            /*
             * css loader support for *.css files (styles directory only)
             * Loads external css styles into the DOM, supports HMR
             *
             */
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                include: [helpers.root('src', 'styles'), helpers.root('node_modules')]
            },

            /*
             * sass loader support for *.scss files (styles directory only)
             * Loads external sass styles into the DOM, supports HMR
             *
             */
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader'],
                include: [helpers.root('src', 'styles'), helpers.root('node_modules')]
            },

        ]

    },

    plugins: [

        /**
         * Plugin: DefinePlugin
         * Description: Define free variables.
         * Useful for having development builds with debug logging or adding global constants.
         *
         * Environment helpers
         *
         * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
         */
        // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
        new DefinePlugin(Object.assign({
            'ENV': JSON.stringify(METADATA.ENV),
            'HMR': METADATA.HMR,
            'process.env': {
              'ENV': JSON.stringify(METADATA.ENV),
              'NODE_ENV': JSON.stringify(METADATA.ENV),
              'HMR': METADATA.HMR,
            }
          })),

        new DllBundlesPlugin({
            bundles: {
                polyfills: [
                    'core-js',
                    {
                        name: 'zone.js',
                        path: 'zone.js/dist/zone.js'
                    },
                    {
                        name: 'zone.js',
                        path: 'zone.js/dist/long-stack-trace-zone.js'
                    },
                ],
                vendor: [
                    '@angular/platform-browser',
                    '@angular/platform-browser-dynamic',
                    '@angular/core',
                    '@angular/common',
                    '@angular/forms',
                    '@angular/http',
                    '@angular/router',
                    '@angularclass/hmr',
                    'rxjs',
                ]
            },
            dllDir: helpers.root('dll'),
            webpackConfig: webpackMergeDll(commonConfig({ env: ENV }), {
                devtool: 'cheap-module-source-map',
                plugins: []
            })
        }),

        /**
         * Plugin: AddAssetHtmlPlugin
         * Description: Adds the given JS or CSS file to the files
         * Webpack knows about, and put it into the list of assets
         * html-webpack-plugin injects into the generated html.
         *
         * See: https://github.com/SimenB/add-asset-html-webpack-plugin
         */
        new AddAssetHtmlPlugin([
            { filepath: helpers.root('dll/' + DllBundlesPlugin.resolveFile('polyfills')) },
            { filepath: helpers.root('dll/' + DllBundlesPlugin.resolveFile('vendor')) }
        ]),

        /**
         * Plugin: NamedModulesPlugin (experimental)
         * Description: Uses file names as module name.
         *
         * See: https://github.com/webpack/webpack/commit/a04ffb928365b19feb75087c63f13cadfc08e1eb
         */
        // new NamedModulesPlugin(),

        /**
         * Plugin LoaderOptionsPlugin (experimental)
         *
         * See: https://gist.github.com/sokra/27b24881210b56bbaff7
         */
        new LoaderOptionsPlugin({
            debug: true,
            options: {
                // Fix: Path must be a string. Received undefined (sass-loader)
                // Fix: Cannot read property 'path' of undefined (resolve-url-loader)
                // https://github.com/bholloway/resolve-url-loader/issues/33
                sassLoader: {
                    includePaths: [
                        helpers.root('node_modules'),
                        helpers.root('src')
                    ]
                },

                context: helpers.root('src'),

                output: {
                    path: helpers.root('dist')
                }
            }
        }),

        // Enable ES6 debugger in browser
        // https://github.com/webpack/webpack/issues/2145
        new webpack.SourceMapDevToolPlugin()

    ],

    /**
     * Webpack Development Server configuration
     * Description: The webpack-dev-server is a little node.js Express server.
     * The server emits information about the compilation state to the client,
     * which reacts to those events.
     *
     * See: https://webpack.github.io/docs/webpack-dev-server.html
     */
    devServer: {
        port: METADATA.port,
        host: METADATA.host,
        historyApiFallback: true,
        watchOptions: {
          aggregateTimeout: 300,
          poll: 1000
        }
      },
    /*
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * See: https://webpack.github.io/docs/configuration.html#node
     */
    node: {
        global: true,
        crypto: 'empty',
        process: true,
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
})