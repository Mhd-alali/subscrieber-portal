'use client';
import { AppShell, ColorSchemeProvider, Container, MantineProvider } from '@mantine/core';
import AppHeader from './Header';
import { useState } from 'react';
import { useLocalStorage } from '@mantine/hooks';

export default function Appshell({ children }) {
    const [colorScheme, setColorScheme] = useLocalStorage({
        key: 'mantine-color-scheme',
        defaultValue: 'dark',
        getInitialValueInEffect: true,
    });

    const toggleColorScheme = () => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme }}>
                <AppShell
                    padding="md"
                    header={<AppHeader />}
                    styles={(theme) => ({
                        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
                    })} >
                    {children}
                </AppShell>
            </MantineProvider>
        </ColorSchemeProvider>
    );
}