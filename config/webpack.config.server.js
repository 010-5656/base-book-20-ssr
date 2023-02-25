const nodeExternals = require('webpack-node-externals')
const paths = require('./paths');
const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent'); // CSS Module의 고유 className을 만들 때 필요한 옵션
const webpack = require('webpack');
const getClientEnvironment = require('./env');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

const isEnvDevelopment =  'development';
const isEnvProduction =  'production';


const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

// Check if Tailwind config exists
const useTailwind = fs.existsSync(
    path.join(paths.appPath, 'tailwind.config.js')
  );

// Check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.appTsConfig);

const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve('style-loader'),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        // css is located in `static/css`, use '../../' to locate index.html folder
        // in production `paths.publicUrlOrPath` can be a relative path
        options: paths.publicUrlOrPath.startsWith('.')
          ? { publicPath: '../../' }
          : {},
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: 'postcss',
            config: false,
            plugins: !useTailwind
              ? [
                  'postcss-flexbugs-fixes',
                  [
                    'postcss-preset-env',
                    {
                      autoprefixer: {
                        flexbox: 'no-2009',
                      },
                      stage: 3,
                    },
                  ],
                  // Adds PostCSS Normalize as the reset css with default options,
                  // so that it honors browserslist config in package.json
                  // which in turn let's users customize the target behavior as per their needs.
                  'postcss-normalize',
                ]
              : [
                  'tailwindcss',
                  'postcss-flexbugs-fixes',
                  [
                    'postcss-preset-env',
                    {
                      autoprefixer: {
                        flexbox: 'no-2009',
                      },
                      stage: 3,
                    },
                  ],
                ],
          },
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            root: paths.appSrc,
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: {
            sourceMap: true,
          },
        }
      );
    }
    return loaders;
  };

module.exports = {
    mode: 'production', // 프로덕션 모드로 설정하여 최적화 옵션들을 활성화
    entry: paths.ssrIndexJs, // 엔트리 경로
    target: 'node', // node 환경에서 실행될 것이라는 점을 명시
    output: {
        path: paths.ssrBuild, // 빌드 경로
        filename: 'server.js', // 파일 이름
        chunkFilename: 'js/[name]/chunk.js', // 청크 파일 이름
        publicPath: paths.publicUrlOrPath, // 정적 파일이 제공될 경로
    },
    module: {
        rules: [
            {
                oneOf: [
                    // 자바스크립트를 위한 처리
                    // 기존 webpack.config.js를 참고하여 작성
                    {
                        test: /\.(js|mjs|jsx|ts|tsx)$/,
                        include: paths.appSrc,
                        loader: require.resolve('babel-loader'),
                        options: {
                            customize: require.resolve(
                                'babel-preset-react-app/webpack-overrides'
                            ),
                            plugins: [
                                [
                                    require.resolve('babel-plugin-named-asset-import'),
                                    {
                                        loaderMap: {
                                            svg: {
                                                ReactComponent: '@svgr/webpack?-svgo![path]'
                                            }
                                        }
                                    }
                                ]
                            ],
                            cacheDirectory: true,
                            cacheCompression: false,
                            compact: false
                        }
                    },
                    // "postcss" loader applies autoprefixer to our CSS.
                    // "css" loader resolves paths in CSS and adds assets as dependencies.
                    // "style" loader turns CSS into JS modules that inject <style> tags.
                    // In production, we use MiniCSSExtractPlugin to extract that CSS
                    // to a file, but in development "style" loader enables hot editing
                    // of CSS.
                    // By default we support CSS Modules with the extension .module.css
                    {
                        test: cssRegex,
                        exclude: cssModuleRegex,
                        use: getStyleLoaders({
                        importLoaders: 1,
                        //   sourceMap: isEnvProduction
                        //     ? shouldUseSourceMap
                        //     : isEnvDevelopment,
                        modules: {
                            mode: 'icss',
                        },
                        }),
                        // Don't consider CSS imports dead code even if the
                        // containing package claims to have no side effects.
                        // Remove this when webpack adds a warning or an error for this.
                        // See https://github.com/webpack/webpack/issues/6571
                        sideEffects: true,
                    },
                    // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
                    // using the extension .module.css
                    {
                        test: cssModuleRegex,
                        use: getStyleLoaders({
                        importLoaders: 1,
                        //   sourceMap: isEnvProduction
                        //     ? shouldUseSourceMap
                        //     : isEnvDevelopment,
                        modules: {
                            mode: 'local',
                            getLocalIdent: getCSSModuleLocalIdent,
                        },
                        }),
                    },
                    // Opt-in support for SASS (using .scss or .sass extensions).
                    // By default we support SASS Modules with the
                    // extensions .module.scss or .module.sass
                    {
                        test: sassRegex,
                        exclude: sassModuleRegex,
                        use: getStyleLoaders(
                        {
                            importLoaders: 3,
                            // sourceMap: isEnvProduction
                            //   ? shouldUseSourceMap
                            //   : isEnvDevelopment,
                            modules: {
                            mode: 'icss',
                            },
                        },
                        'sass-loader'
                        ),
                        // Don't consider CSS imports dead code even if the
                        // containing package claims to have no side effects.
                        // Remove this when webpack adds a warning or an error for this.
                        // See https://github.com/webpack/webpack/issues/6571
                        sideEffects: true,
                    },
                    // Adds support for CSS Modules, but using SASS
                    // using the extension .module.scss or .module.sass
                    {
                        test: sassModuleRegex,
                        use: getStyleLoaders(
                        {
                            importLoaders: 3,
                            // sourceMap: isEnvProduction
                            //   ? shouldUseSourceMap
                            //   : isEnvDevelopment,
                            modules: {
                            mode: 'local',
                            getLocalIdent: getCSSModuleLocalIdent,
                            },
                        },
                        'sass-loader'
                        ),
                    },

                    // url-loader를 위한 설정
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            emitFile: false, // 파일을 따로 저장하지 않는 옵션
                            limit: 10000, // 원래는 9.76KB가 넘어가면 파일로 저장하는데 emitFile 값이 false일 때는 경로만 준비하고 파일은 저장하지 않는다.
                            name: 'static/media/[name].[hash:8].[ext]'
                        }
                    },
                    // 위에서 설정된 확장자를 제외한 파일들은 file-loader를 사용한다.
                    {
                        loader: require.resolve('file-loader'),
                        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                        options: {
                            emitFile: false, // 파일을 따로 저장하지 않는 옵션
                            name: 'static/media/[name].[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        modules: ['node-modules']
    },
    externals: [nodeExternals()],
    plugins: [
        new webpack.DefinePlugin(env.stringified),// 환경변수를 주입해 준다.
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
          }),
    ]
};