module.exports = {
    extends: 'eslint:recommended',
    globals: {
        describe: true,
        it:true,
        expect : true
    },
    env: {
        commonjs: true,
        es6: true,
        node: true
    },
    rules: {
        indent: ['error', 4],
        quotes: ['error', 'single'],
        'quote-props': ['error', 'as-needed'],
        'no-multiple-empty-lines': ['error', {max: 1}],
        'no-trailing-spaces': 'error',
    },
    parserOptions:{
        ecmaVersion:8
    }

};