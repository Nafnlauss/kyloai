# LintAgent - Code Quality Specialist
**Tools:** ESLint, Prettier, TypeScript
**Standards:** Airbnb style guide adapted for Next.js
**Automation:** Pre-commit hooks, CI checks

## ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // React
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    
    // TypeScript
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    
    // Import
    'import/prefer-default-export': 'off',
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      alphabetize: { order: 'asc' },
    }],
    
    // Security
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
  },
}
```

## Prettier Configuration
```json
// .prettierrc
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

## TypeScript Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
  }
}
```

## Scripts
```json
{
  "scripts": {
    "lint": "next lint && eslint . --ext .ts,.tsx",
    "lint:fix": "next lint --fix && eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\"",
    "typecheck": "tsc --noEmit",
    "lint-staged": "lint-staged"
  }
}
```