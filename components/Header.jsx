'use client';
import { ActionIcon, Container, Flex, Header, Text, useMantineColorScheme } from '@mantine/core';
import { IconSunFilled, IconMoonFilled } from '@tabler/icons-react';
import Link from 'next/link';

export default function AppHeader({ }) {
    const { toggleColorScheme, colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    return <Header p="md" height={'4rem'}>
        <Container size={'xl'} h={"100%"}>
            <Flex justify={'space-between'} align={'center'} h={"100%"}>
                <Link href={'/'}>
                    <Text fw={500}>Subscriber Portal</Text>
                </Link>
                <ActionIcon variant="outline" color={dark ? 'yellow' : 'blue'} onClick={() => { toggleColorScheme(); }} title="Toggle color scheme">
                    {dark ? <IconSunFilled size="1.1rem" /> : <IconMoonFilled size="1.1rem" />}
                </ActionIcon>
            </Flex>
        </Container>
    </Header >;
}