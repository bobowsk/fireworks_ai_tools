import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
const srcPath = path.resolve(__dirname, 'src');
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Inspect from 'vite-plugin-inspect';
export default defineConfig({
    base: '/',
    resolve: {
        alias: {
            '@': srcPath,
        },
    },
    plugins: [
        vue(),
        AutoImport({
            imports: ['vue'],
            resolvers: [ElementPlusResolver()],

            dts: path.resolve(srcPath, 'auto-imports.d.ts'),
        }),
        Components({
            resolvers: [ElementPlusResolver()],

            dts: path.resolve(srcPath, 'components.d.ts'),
        }),
        Inspect(),
    ],
});
