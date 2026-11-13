import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: false,
        environment: 'node',
        include: ['**/*.test.{ts,js}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'cobertura', 'lcov'],
            reportsDirectory: 'coverage',
            include: ['src/**/*.ts', 'rateio.js'],
            exclude: ['**/*.test.ts', 'src/proxy.ts'],
        }

    },
});
