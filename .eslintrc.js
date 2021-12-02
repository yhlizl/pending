module.exports = {
    "extends": [
      "airbnb-typescript",
      "airbnb/hooks",
      "plugin:@typescript-eslint/recommended",
      "plugin:jest/recommended",
      "plugin:react/recommended",
      "plugin:prettier/recommended",
      "prettier/@typescript-eslint",
      "prettier/react",
    ],
    "env": {
      "browser": true,
      "jest/globals": true,
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaFeatures": {
        "jsx": true
      },
      "project": "tsconfig.json"
    },
    "plugins": ["@typescript-eslint", "jest", "react-hooks", "react"],
    "settings": {
      "react" : {
        "version": "detect",
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": "webpack",
    },
    "rules": {
        // On
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        "import/extensions": ["error", "ignorePackages", {
          "js": "never",
          "jsx": "never",
          "ts": "never",
          "tsx": "never",
        }],
        "import/no-unused-modules": ["error", { "missingExports": true, "unusedExports": true }],
        "no-param-reassign": ["error", {"props":false}],
        "react/jsx-filename-extension": [1, { "extensions": [".tsx", ".jsx"] }],
        "react/static-property-placement": ["error", "static public field"],
        // Want to turn on
        "@typescript-eslint/no-explicit-any": ["off"], // Want to turn on eventually
        "@typescript-eslint/no-non-null-assertion": ["off"], // Want to turn on eventually
        "@typescript-eslint/explicit-function-return-type": ["off"], // Want to turn on eventually
        "jsx-a11y/label-has-associated-control": ["off"], // Want to turn on eventually
        "react/destructuring-assignment": ["off"], // Want to turn on eventually
        "react/no-access-state-in-setstate": ["off"], // Want to turn on eventually
        // Off
        "@typescript-eslint/explicit-module-boundary-types": ["off"], // Want to turn on eventually
        "@typescript-eslint/interface-name-prefix": ["off"],
        "@typescript-eslint/naming-convention": ["off"],
        "@typescript-eslint/no-use-before-define": ["off"], // Want to turn on eventually
        "import/prefer-default-export": ["off"],
        "jsx-a11y/no-autofocus": ["off"], // Let's turn this back on if we ever make accessibility a focus
        "no-alert": ["off"],
        "react/jsx-props-no-spreading": ["off"], // This rule is less useful when we have TypeScript, since we have stronger guarantees about the props being spread.
        "react/require-default-props": ["off"], // TypeScript and ES6 default values makes this rule unnecessary.
      },
  "overrides": [
    {
      // Testing-related files
      "files": ["**/__tests__/**/*", "**/__mocks__/**/*"],
      "rules": {
        // Test code does not need to export any names, since they are top-level
        // files.
        "import/no-unused-modules": ["error", { "missingExports": false, "unusedExports": true }],
      }
    },
    {
      // TestCafe-specific overrides
      "files": ["integration_tests/**/*"],
      "rules": {
        // TestCafe uses tagged template literals for the fixture DSL construct,
        // which has a side-effect and therefore should not be considered
        // unused.
        "import/no-unused-expressions": ["error", { "allowTaggedTemplates": true }],
      }
    },
  ],
};
