"use server";
import { createSupbaseServerClientReadOnly } from "../supabase";
import { cookies } from "next/headers";
import { createSupbaseServerClient } from "../supabase";

export async function readUserSession() {
  const supabase = await createSupbaseServerClientReadOnly();

  return await supabase.auth.getSession();
}

export async function removeCookies() {
  const cookieStore = cookies();
  cookieStore.delete("session");
  const supabase = await createSupbaseServerClient();
  await supabase.auth.signOut();
}

export async function getCookies() {
  try {
    const cookieStore = cookies(); // Correct invocation of cookies
    const cookie: any = cookieStore.get("session");
    const response: any = JSON.parse(cookie.value);
    return response;
  } catch (error) {
    console.error("Error retrieving cookies:", error);
    return null;
  }
}
