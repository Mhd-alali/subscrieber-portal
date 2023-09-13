'use client';
import { getUserById } from '@/actions/user';
import { Container, } from '@mantine/core';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const RichTextEdit = dynamic(()=>import('@/components/RichTextEdit'))

export default function UserPage({ params }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            setUser(await getUserById(+params.id));
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <Container size={'lg'}>
        {user &&
            <>
                <RichTextEdit user={user} />
            </>
        }
    </Container>;
}




