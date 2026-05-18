'use server'

import { redirect } from "next/navigation"
import prisma from "./prisma"
import path from "path"
import { writeFile } from "fs/promises"
import { revalidatePath } from "next/cache"

export const createProductAction = async(prevState: any, formData: FormData)=>{
    const file = formData.get("image") as File
    let image = null 
    if(file && file.size>0){
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const fileName = `${Date.now()}-${file.name}`
        const uploadpath = path.join(process.cwd(), "public/uploads", fileName)
        await writeFile(uploadpath, buffer)
        image = `/uploads/${fileName}`
    }

    const category_id = Number(formData.get("cat_id"))
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const quantity  = Number(formData.get("quantity"))

    
    console.log("cat", category_id)
    try{
        const data: any = []
        
        for(let i =1; i<=quantity; i++){
            let slug = name.replaceAll(" ", "-");
            if(i>1) {
                slug=`${slug}-${i}`
            }
            console.log("Slug: ", slug)
            data.push(
                {
                    name,
                    description,
                    slug,
                    category_id,
                    image
                }
            )
        }
        await prisma.bicycle.createMany({data})

        
    }catch(err){
        console.log(err)
        return {
            error:err as string,
            success: false
        }
    }

    return redirect(`/admin/categories/${category_id}/bicycles`)
}


export const updateProductAction = async(prevState: any, formData: FormData)=>{
    const file = formData.get("image") as File
    let image = null 
    if(file && file.size>0){
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const fileName = `${Date.now()}-${file.name}`
        const uploadpath = path.join(process.cwd(), "public/uploads", fileName)
        await writeFile(uploadpath, buffer)
        image = `/uploads/${fileName}`
    }

    const category_id = Number(formData.get("cat_id"))
    const id = Number(formData.get("bic_id"))
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const available  = formData.get("available")

    console.log(available)

    
    
    try{
        await prisma.bicycle.update({
            where:{
                id
            },
            data:{
                name,
                description,
                category_id,
                available: available==="on"
            }
        })        
    }catch(err){
        console.log(err)
        return {
            error:err as string,
            success: false
        }
    }

    return redirect(`/admin/categories/${category_id}/bicycles`)
}


export const deleteBicycleAction = async(id: number)=>{
    await prisma.bicycle.delete({where:{id}})

    revalidatePath("/admin/categories")
} 