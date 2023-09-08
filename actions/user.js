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
                gender,
                last_name,
                middle_name
            }
        });
    });
}

export async function getUsers(field, query, take, activePage) {
    'use server';
    if (!query) return [];
    const skip = (activePage - 1) * take;
    const where = {};
    where[field] = { contains: query };
    const users = await prisma.user.findMany({
        where,
        take,
        skip: skip
    });
    return users;
}

export async function getUsersCount(field, query) {
    'use server';
    const where = {};
    where[field] = { contains: query };
    const count = await prisma.user.count({ where, });
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
    const user = await prisma.user.update({
        where: { id },
        data: { html }
    });
    
}