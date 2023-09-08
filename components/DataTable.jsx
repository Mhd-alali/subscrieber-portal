'use client';
import { useState } from 'react';
import {
    createStyles,
    Table,
    ScrollArea,
    UnstyledButton,
    Group,
    Text,
    Center,
    rem,
    Badge,
    Modal,
    Flex,
    Button,
} from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
    th: {
        padding: '0 !important',
    },

    control: {
        width: '100%',
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },

    icon: {
        width: rem(21),
        height: rem(21),
        borderRadius: rem(21),
    }
}));


function Th({ children, reversed, sorted, onSort }) {
    const { classes } = useStyles();
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <th className={classes.th}>
            <UnstyledButton onClick={onSort} className={classes.control}>
                <Group position="apart">
                    <Text fw={500} fz="sm">
                        {children}
                    </Text>
                    <Center className={classes.icon}>
                        <Icon size="0.9rem" stroke={1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </th>
    );
}

function sortData(data, payload) {
    const { sortBy } = payload;

    return [...data].sort((a, b) => {
        if (typeof a[sortBy] === 'object')
            return payload.reversed ? new Date(b[sortBy]) - new Date(a[sortBy]) : new Date(a[sortBy]) - new Date(b[sortBy]);

        if (typeof a[sortBy] === 'number')
            return payload.reversed ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy];

        else
            return payload.reversed ? b[sortBy].localeCompare(a[sortBy]) : a[sortBy].localeCompare(b[sortBy]);

    });

}


export function DataTable({ data }) {
    const [sortedData, setSortedData] = useState(data);
    const [sortBy, setSortBy] = useState(null);
    const [user, setUser] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);


    const setSorting = (field) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(data, { sortBy: field, reversed }));
    };

    const tableHead = [
        { value: 'id', title: "Id" },
        { value: 'first_name', title: "First Name" },
        { value: 'middle_name', title: "Middle Name" },
        { value: 'last_name', title: "Last Name" },
        { value: 'email', title: "Email" },
        { value: 'gender', title: "Gender" },
        { value: 'dateOfBirth', title: "DOB" },
    ];

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    };

    const rows = sortedData.map((row) => {
        return <tr key={row.id} className='cursor-pointer' onClick={() => { open(); setUser(data.find(user => user.id === row.id)); }}>
            <td >{row.id}</td>
            <td>{row.first_name}</td>
            <td>{row.middle_name}</td>
            <td>{row.last_name}</td>
            <td>{row.email}</td>
            <td>
                <Badge color={row.gender === 'Male' ? 'blue' : row.gender === 'Female' ? 'pink' : "lime"} variant={'outline'} >
                    {row.gender}
                </Badge>
            </td>
            <td>{row.dateOfBirth.toDateString()}</td>
        </tr>;

    });

    return (
        <ScrollArea >
            <Table horizontalSpacing="lg" verticalSpacing="md" miw={700} sx={{ tableLayout: 'fixed' }} striped highlightOnHover >
                <thead >
                    <tr>
                        {tableHead.map(head => (
                            <Th
                                key={head.value}
                                sorted={sortBy === head.value}
                                reversed={reverseSortDirection}
                                onSort={() => setSorting(head.value)}
                            >
                                {head.title}
                            </Th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length > 0 ? (
                        rows
                    ) : (
                        <tr>
                            <td colSpan={7}>
                                <Text weight={500} align="center">
                                    Nothing found
                                </Text>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Modal opened={opened} onClose={close} title="User" size={'lg'} centered>
                {user &&
                    <Flex direction={'column'} gap={'lg'}>
                        {
                            tableHead.map(head => (
                                <Flex justify={'space-between'} key={user.id}>
                                    <Text >{head.title}</Text>
                                    {
                                        typeof user[head.value] === 'object' ?
                                            <Text >{user[head.value].toDateString()}</Text> :
                                            <Text >{user[head.value]}</Text>
                                    }
                                </Flex>
                            ))
                        }
                        <Flex justify="center" align="center" gap={'md'}>
                            <Button variant='outline' color='blue'>Add to Favorite</Button>
                            <Link href={`/${user.id}`} target='_blank'>
                                <Button variant='outline' color='blue' onClick={open}>generate Report</Button>
                            </Link>
                        </Flex>
                    </Flex>}
            </Modal>
        </ScrollArea>
    );
}