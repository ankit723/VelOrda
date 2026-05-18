'use server';

import { cookies } from "next/headers";
import prisma from "./prisma";
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation";

export const loginAction = async (prevState: any, formData:FormData)=>{
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const password = formData.get("password") as string

    if((!email && !phone) || !password) return {
        error: "Enter all the fields",
        success: false
    }

    const u = await prisma.user.findFirst({where:{OR:[{email}, {phone}]}})
    if(!u) return {
        error: "User Not found",
        success: false
    }

    const isValid = await bcrypt.compare(password, u.password)
    if(!isValid) return {
        error: "Wrong password",
        success: false
    }

    const cookieStore = await cookies()
    cookieStore.set("token", `${u.id}`, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
        maxAge: 60*60*24*7
    })

    return redirect("/admin/categories")
}

export const registerAction = async (prevState: any, formData:FormData)=>{
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const password = formData.get("password") as string

    if((!email || !phone) || !password) return {
        error: "Enter all the fields",
        success: false
    }

    const hash = await bcrypt.hash(password, 10)

    await prisma.user.create({data:{
        email,
        phone,
        password: hash
    }})

    return redirect("/admin/categories")
}