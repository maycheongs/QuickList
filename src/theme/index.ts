// src/theme/index.ts
//For custom theme configurations e.g. brand colors and semantic tokens (e.g. danger, success)


import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const BG_DEFAULT = "gray.50"
const BG_DARK = "gray.800"

const customConfig = defineConfig({
    theme: {
        semanticTokens: {
            colors: {
                background: {
                    DEFAULT: { value: `colors.${BG_DEFAULT}` },
                    dark: { value: `colors.${BG_DARK}` }
                }
            }
        }
    },
    globalCss: {
        "body": {
            background: BG_DEFAULT,
        },

    },
})

export const system = createSystem(defaultConfig, customConfig)