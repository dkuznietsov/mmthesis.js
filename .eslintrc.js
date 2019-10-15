module.exports = {
    "extends" : "airbnb-base",
    "rules": {
        "semi": [2, "never"],
        "arrow-parens": [2, "as-needed"],
        "indent": [2, 4],
        "implicit-arrow-linebreak": [2, "below"],
        "no-underscore-dangle": [2, {
            "allowAfterThis": true,
            "allowAfterSuper": true
        }],
        "comma-dangle": [2, {
            "functions": "never"
        }],
        "class-methods-use-this": 0 
    }
}