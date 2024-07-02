import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({   
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, './src/components'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@lib': path.resolve(__dirname, './src/lib'),
        },
    },
    plugins: [
        react(),
        dts({
            insertTypesEntry: true,
        }),
    ],
    build: {
        sourcemap: true,
        lib: {
            entry: path.resolve(__dirname, 'src/components/index.ts'),
            name: 'wreckfreeComponents',
            formats: ['es', 'umd'],
            fileName: (format) => `wreckfreeComponents.${format}.js`,
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      }
});
