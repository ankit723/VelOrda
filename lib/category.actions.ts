'use server'

import { error } from "node:console";
import prisma from "./prisma"
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const createCategoryAction = async(prevState: any, formData: FormData)=>{
    const name = formData.get("name") as string;

    if(await prisma.category.findUnique({where:{name}})) return{
        error: "Category Already exists !",
        success: false
    }

    await prisma.category.create({data:{name}})
    return redirect("/admin/categories")
}

export const updateCategoryAction = async(prevState: any, formData: FormData)=>{
    const name = formData.get("name") as string;
    const id = Number(formData.get("id"));

    if(!await prisma.category.findUnique({where:{name}})) return{
        error: "Category Not Found !",
        success: false
    }

    await prisma.category.update({
        where:{id},
        data: {name}
    })
    return redirect("/admin/categories")
}

export const getAllCategories=async()=>{
    const categories  =await prisma.category.findMany({})
    return categories
}

export const deleteCategory=async(id: number)=>{
    if(await prisma.bicycle.findFirst({where:{category_id: id}})) return

    await prisma.category.delete({where:{id}})

    revalidatePath("/admin/categories")
}