// src/theme/index.ts
//For custom theme configurations e.g. brand colors and semantic tokens (e.g. danger, success)


import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
    globalCss: {
        "body": {
            background: "gray.50",
        },

    },
})

export const system = createSystem(defaultConfig, customConfig)