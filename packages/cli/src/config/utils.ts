import { join, sep } from 'path';
import {
    readdirSync,
    statSync,
    readFileSync,
    writeFileSync,
    utimesSync,
    existsSync,
    mkdirSync,
    Stats,
} from 'fs';

export const copyFileTo = (source: string, targe: string) => {
    const txt = readFileSync(source).toString();
    writeFileSync(targe, txt);
    utimesSync(
        targe,
        (Date.now() - 10 * 1000) / 1000, (Date.now() - 10 * 1000) / 1000,
    );
};

export function timefixWebpack(compiler) {
    const timefix = 600;
    let watching: any = {};
    const onWatchRun = (c, callback) => {
        watching.startTime += timefix;
        callback?.();
    };
    const onDone = (stats, callback) => {
    // eslint-disable-next-line no-param-reassign
        stats.startTime -= timefix;
        callback?.();
    };
    const aspectWatch = compiler.watch;
    // eslint-disable-next-line no-param-reassign
    compiler.watch = (...args) => {
        watching = aspectWatch.apply(compiler, args);
        return watching;
    };
    compiler.hooks.watchRun.tapAsync('@rwp/cli', onWatchRun);
    compiler.hooks.done.tapAsync('@rwp/cli', onDone);
}

/**
 * 递归获取文件目录
 * @param dir 当前的文件名称
 * @param callback
 */
export const recursionDir = (
    dir: string,
    callback: (dir: string, file: string, stat: Stats) => void,
) => {
    readdirSync(dir).forEach((file) => {
        const pathname = join(dir, file);
        const stat = statSync(pathname);
        callback(dir, file, stat);
        if (stat.isDirectory()) {
            recursionDir(pathname, callback);
        }
    });
};

export const writeRouteFile = () => {
    let code = 'import React from "react"\n';
    code += 'export default [';
    recursionDir(join(process.cwd(), 'src', 'pages'), (
        dir,
        file,
    ) => {
        const pathname = join(dir, file);
        if (pathname.substr(pathname.length - 10) === '.route.tsx') {
            const currenPath = pathname.replace(join(process.cwd(), 'src', 'pages'), '');
            const component = currenPath.split('.').slice(0, -1).join('.');

            let path = currenPath;
            path = path.split('.').slice(0, -1).join('.');
            if (file === 'index.route.tsx') {
                path = `${dir.replace(join(process.cwd(), 'src', 'pages'), '').split(sep).join('/')}/`;
            }
            code += `\n\t{\n\t\tcomponent: React.lazy(() => import('../pages${component.split(sep).join('/')}')),\n\t\tpath: '${path}'\n\t},\n`;
        }
    });
    code += ']';
    const path = join(process.cwd(), 'src', '.rwp', 'routes.tsx');
    const rwpDir = join(process.cwd(), 'src', '.rwp');
    if (!existsSync(rwpDir)) {
        mkdirSync(rwpDir, {
            recursive: true,
        });
    }
    writeFileSync(path, code);
    utimesSync(
        path,
        (Date.now() - 10 * 1000) / 1000, (Date.now() - 10 * 1000) / 1000,
    );
};
