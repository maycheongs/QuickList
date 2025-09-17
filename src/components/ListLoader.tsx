'use client';

import { Center } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const letters = ["L", "I", "S", "T"];

export default function ListLoader() {
    return (
        <Center h="100%" bg="gray.50">
            <div style={{ display: "flex", fontSize: "2.5rem", fontWeight: "bold", fontFamily: "monospace" }}>
                {letters.map((letter, i) => (
                    <motion.span
                        key={i}
                        initial={{ y: 0, opacity: 0.4 }}
                        animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.2,
                            ease: "easeInOut",
                            delay: i * 0.2, // stagger each letter
                        }}
                        style={{ marginRight: "0.2em" }}
                    >
                        {letter}
                    </motion.span>
                ))}
            </div>
        </Center>
    );
}
