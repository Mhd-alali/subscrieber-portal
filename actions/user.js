'use server';
import data from '@/MOCK_DATA.json';
import { prisma } from '@/utils/db';

export async function generateUsers() {
    'use server';
    data.users.forEach(async element => {
        const { id, first_name, middle_name, last_name, email, gender, dateOfBirth } = element;
        await prisma.user.create({
            data: {
                id,
                email,
                dateOfBirth: new Date(dateOfBirth),
                first_name,
                gender: gender.toLowerCase(),
                last_name,
                middle_name
            }
        });
    });
}

export async function getUsers(query, take, activePage) {
    'use server';
    if (Object.keys(query).length === 0) return [];
    const skip = (activePage - 1) * take;
    const users = await prisma.user.findMany({
        where: query,
        take,
        skip: skip
    });
    return users;
}

export async function getUsersCount(query) {
    'use server';
    const count = await prisma.user.count({ where: query, });
    return count;
}

export async function getUserById(id) {
    'use server';
    const user = await prisma.user.findUnique({
        where: { id }
    });
    return user;
}


export async function saveReport(id, html) {
    'use server';
    await prisma.user.update({
        where: { id },
        data: { html }
    });

}