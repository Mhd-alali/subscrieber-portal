'use client';
import { generateUsers, getUsers, getUsersCount } from '@/actions/user';
import { DataTable } from '@/components/DataTable';
import { ActionIcon, Button, Divider, Flex, Grid, Group, Input, Pagination, Select, Space } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { useInputState } from '@mantine/hooks';
import { IconLoader, IconSearch, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState([]);
  const [activePage, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useInputState("");
  const form = useForm({
    initialValues: { first_name: "", middle_name: "", last_name: "", email: "", gender: "", from: "", to: "" },
    validate: {
      email: isEmail('invalid Email'),
    }
  });
  const [isLoading, setIsLoading] = useInputState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    const query = {};
    for (const field in form.values) {
      if (!!form.isTouched(field) && !!form.isDirty(field) && !!form.values[field]) {
        if (field === 'gender')
          query[field] = form.values[field];
        else if (field === 'from')
          query['dateOfBirth'] = {
            ...query['dateOfBirth'],
            gte: form.values[field]
          };
        else if (field === 'to')
          query['dateOfBirth'] = {
            ...query['dateOfBirth'],
            lte: form.values[field]
          };
        else
          query[field] = { contains: form.values[field] };
      }
    }
    console.log(query);
    setData(await getUsers(query, pageSize, activePage));
    setTotalItems(await getUsersCount(query));
    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };


  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

    fetchUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage, pageSize]);

  return <>
    <form onSubmit={handleSubmit}>
      <Grid columns={12}>
        <Grid.Col span={10}>
          <Flex direction={'column'} gap={'xl'}>
            <Group grow>
              <Input placeholder='First Name' {...form.getInputProps('first_name')} rightSection={
                form.values.first_name && <ActionIcon onClick={() => { form.setFieldValue('first_name', ''); }}>
                  <IconX size="1rem" />
                </ActionIcon>
              } />
              <Input placeholder='Middle Name' {...form.getInputProps('middle_name')} rightSection={
                form.values.middle_name && <ActionIcon onClick={() => { form.setFieldValue('middle_name', ''); }}>
                  <IconX size="1rem" />
                </ActionIcon>
              } />
            </Group>
            <Group grow>
              <Input placeholder='Last Name' {...form.getInputProps('last_name')} rightSection={
                form.values.last_name && <ActionIcon onClick={() => { form.setFieldValue('last_name', ''); }}>
                  <IconX size="1rem" />
                </ActionIcon>
              } />
              <Input placeholder='Email' {...form.getInputProps('email')} rightSection={
                form.values.email && <ActionIcon onClick={() => { form.setFieldValue('email', ''); }}>
                  <IconX size="1rem" />
                </ActionIcon>
              } />
            </Group>
            <Group grow>
              <Select placeholder="Gender"
                clearable
                data={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'other' },
                ]}
                {...form.getInputProps('gender')} />
              <DateInput placeholder="From" {...form.getInputProps('from')} defaultLevel='decade' clearable />
              <DateInput placeholder="To" {...form.getInputProps('to')} defaultLevel='decade' clearable />
            </Group>
          </Flex>
        </Grid.Col>
        <Grid.Col span={2}>
          <Button w={'100%'} h={'100%'} color='gray' type='submit'>
            <IconSearch size={'10rem'} />
          </Button>
        </Grid.Col>
      </Grid>
    </form>
    {
      isLoading ?
        <IconLoader size={'4rem'} className='mx-auto mt-32 animate-spin' /> :
        (data.length !== 0) &&
        <>
          <Divider mt={'xl'} />
          <DataTable data={data} />
          <Divider mb={'xl'} />
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
  </>;

}