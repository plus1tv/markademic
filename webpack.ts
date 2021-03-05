import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import path from 'path';
import { argv } from 'process';

let env = process.env['NODE_ENV'];
let isProduction = env && env.match(/production/) || argv[2] == 'production';

let config: webpack.Configuration = {
    context: path.join(__dirname, 'src'),
    entry: {
        app: './markademic.ts'
    },
    output: {
        filename: 'markademic.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'markademic',
        libraryTarget: 'commonjs2'
    },
    resolve: {
        extensions: [ '.ts', '.tsx', 'js' ]
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    compilerOptions: {
                        isolatedModules: true
                    }
                }
            }
        ]
    },
    node: false,
	externals: {
		'highlight.js': {
			root: 'highlight.js',
			commonjs2: 'highlight.js',
			commonjs: 'highlight.js',
			amd: 'highlight.js'
		},
		remarkable: {
			root: 'remarkable',
			commonjs2: 'remarkable',
			commonjs: 'remarkable',
			amd: 'remarkable'
		},
		katex: {
			root: 'katex',
			commonjs2: 'katex',
			commonjs: 'katex',
			amd: 'katex'
		}
	},
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development')
            }
        })
    ],
    optimization: {
        minimize: isProduction ? true : false
    }
};

/**
 * Start Build
 */
const compiler: webpack.Compiler = webpack(config);

if (!argv.reduce((prev, cur) => prev || cur === '--watch', false)) {
    compiler.run((err, stats) => {
        if (err) return console.error(err);

        if (stats.hasErrors()) {
            let statsJson = stats.toJson();
            console.log('❌' + ' · Error · ' + 'markademic failed to compile:');
            for (let error of statsJson.errors) {
                console.log(error);
            }
            return;
        }
        console.log(
            '✔️️' +
                '  · Success · ' +
                'markademic' +
                (isProduction ? ' (production) ' : ' (development) ') +
                'built in ' +
                (+stats.endTime - +stats.startTime + ' ms.')
        );
    });
} else {
    compiler.watch({}, (err, stats) => {
        if (err) return console.error(err);

        if (stats.hasErrors()) {
            let statsJson = stats.toJson();
            console.log('❌' + ' · Error · ' + 'markademic failed to compile:');
            for (let error of statsJson.errors) {
                console.log(error);
            }
            console.log('\n👀  · Watching for changes... · \n');
            return;
        }
        console.log(
            '✔️️' +
                '  · Success · ' +
                'markademic' +
                (isProduction ? ' (production) ' : ' (development) ') +
                'built in ' +
                (+stats.endTime - +stats.startTime + ' ms.') +
                '\n👀  · Watching for changes... · \n'
        );
    });
}