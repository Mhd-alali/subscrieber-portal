'use client';
import { generateUsers, getUsers, getUsersCount } from '@/actions/user';
import { DataTable } from '@/components/DataTable';
import { Button, Flex, Group, Input, Pagination, Select } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { IconLoader } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useAutosave } from 'react-autosave';

export default function Page() {
  const [data, setData] = useState([]);
  const [activePage, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useInputState("");
  const [field, setField] = useState('first_name');
  const [isLoading, setIsLoading] = useInputState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    setData(await getUsers(field, query.trim(), pageSize, activePage));
    setTotalItems(await getUsersCount(field, query));
    setIsLoading(false);
  };

  useAutosave({
    data: query, interval: 500,
    onSave: async (_text) => {
      fetchUsers();
    },
  });


  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

    fetchUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage, isInitialRender, field, pageSize]);

  return <Flex direction={'column'} gap={'xl'}>
    <Group grow>
      <Select
        value={field}
        onChange={setField}
        placeholder="search field"
        defaultValue='first_name'
        data={[
          { value: 'first_name', label: "First Name" },
          { value: 'middle_name', label: "Middle Name" },
          { value: 'last_name', label: "Last Name" },
          { value: 'full_name', label: "Full Name" },
          { value: 'email', label: "Email" },
          { value: 'gender', label: "Gender" },
          { value: 'dateOfBirth', label: "DOB" },
        ]} />
      <Input value={query} onChange={setQuery} />
    </Group>
    {
      isLoading ?
        <IconLoader size={'4rem'} className='mx-auto mt-32 animate-spin' /> :
        (query && data.length !== 0) &&
        <>
          <DataTable data={data} />
          <Flex justify={'center'} gap={'md'}>
            <Select
              value={pageSize}
              onChange={(e) => { setPage(1); setPageSize(e); }}
              placeholder="set page size"
              label="page size"
              data={[
                { value: 10, label: "10" },
                { value: 25, label: "25" },
                { value: 100, label: "100" },
              ]} />
            <Pagination withControls={false} className='self-end' value={activePage} onChange={setPage} color="dark" total={Math.ceil(totalItems / pageSize)} />
          </Flex>
        </>
    }

  </Flex >;
}