'use client';
import { getUserById } from '@/actions/user';
import RichTextEdit from '@/components/RichTextEdit';
import { Container, } from '@mantine/core';
import { useEffect, useState } from 'react';

export default function UserPage({ params }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            setUser(await getUserById(+params.id));
            console.log(user);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <Container size={'lg'}>
        {user &&
            <RichTextEdit user={user} />
        }
    </Container>;
}




