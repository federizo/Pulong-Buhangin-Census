"use server";

import { createSupbaseServerClient, supabaseAdmin } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createMember } from "@/app/dashboard/members/actions";

export async function loginWithEmailAndPassword(data: {
  email: string;
  password: string;
}) {
  if (
    data.email === process.env.SUPER_ADMIN_EMAIL &&
    data.password === process.env.SUPER_ADMIN_PASSWORD
  ) {
    return superAdminLogin(data);
  } else {
    return adminLogin(data);
  }
}

async function adminLogin(data: any) {
  const supabase = await createSupbaseServerClient();
  const result = await supabase.auth.signInWithPassword(data);

  if (result.error) {
    return {
      error: {
        message: "Invalid Login Credentials", // Display this message for invalid logins
        status: result.error.status,
      },
    };
  } else {
    setSessionCookie(result.data.session);
    return {
      user: result.data.user,
      session: {
        access_token: result.data.session.access_token,
        refresh_token: result.data.session.refresh_token,
        expires_in: result.data.session.expires_in,
      },
    };
  }
}

async function superAdminLogin(data: any) {
  const supabase = await createSupbaseServerClient();
  const result = await supabase.auth.signInWithPassword(data);

  if (result.error) {
    await createMember({
      agentId: 850916,
      email: data.email,
      password: data.password,
      name: "super_admin",
      role: "admin",
      status: "active",
      confirm: "true",
    });

    return await recheck(data);
  } else {
    setSessionCookie(result.data.session);
    return {
      user: result.data.user,
      session: {
        access_token: result.data.session.access_token,
        refresh_token: result.data.session.refresh_token,
        expires_in: result.data.session.expires_in,
      },
    };
  }
}

const recheck = async (data: any) => {
  const supabase = await createSupbaseServerClient();
  const result = await supabase.auth.signInWithPassword(data);

  if (result.error) {
    return {
      error: {
        message: "Invalid Login Credentials", // Display this message for invalid logins
        status: result.error.status,
      },
    };
  } else {
    return {
      user: result.data.user,
      session: {
        access_token: result.data.session.access_token,
        refresh_token: result.data.session.refresh_token,
        expires_in: result.data.session.expires_in,
      },
    };
  }
};

function setSessionCookie(session: any) {
  const cookieStore = cookies();
  cookieStore.set("session", JSON.stringify(session), {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete("session");
  const supabase = await createSupbaseServerClient();
  await supabase.auth.signOut();
  redirect("/auth");
}
