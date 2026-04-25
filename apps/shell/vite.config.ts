import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'shell',
      dts: false,
      remotes: {
        contentMfe: {
          type: 'module',
          name: 'contentMfe',
          entry: `${process.env.VITE_CONTENT_MFE_URL || 'http://localhost:3001'}/remoteEntry.js`,
          shareScope: 'default',
        },
        ragMfe: {
          type: 'module',
          name: 'ragMfe',
          entry: `${process.env.VITE_RAG_MFE_URL || 'http://localhost:3002'}/remoteEntry.js`,
          shareScope: 'default',
        },
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.3.1',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.3.1',
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: '^6.30.0',
        },
      },
    }),
  ],
  build: {
    target: 'esnext',
  },
})
