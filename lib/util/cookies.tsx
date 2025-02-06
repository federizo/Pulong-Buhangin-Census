"use server"

import { cookies } from 'next/headers';

export async function getServerSideCookies() {
    const cookieStore = cookies(); // Access the cookies
    const myCookie = cookieStore.get('session'); // Get a specific cookie
    return myCookie?.value;
}
