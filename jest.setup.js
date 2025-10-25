// Mock Vite's import.meta.env so Jest doesn't crash
global.importMeta = { env: { DEV: false, PROD: true } };
global.import = { meta: global.importMeta };
