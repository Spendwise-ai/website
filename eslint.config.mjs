import antfu from "@antfu/eslint-config"
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt(
  antfu(
    {
      unocss: true,
      formatters: true,
    },
    {
      rules: {
        // Allow trailing space in comments, for possible JSDoc formattings
        "style/no-trailing-spaces": ["error", { ignoreComments: true }],
        // Relaxes inline statements a bit
        "style/max-statements-per-line": ["error", { max: 2 }],
        "style/quotes": "off",
      },
    },
  ),
)
