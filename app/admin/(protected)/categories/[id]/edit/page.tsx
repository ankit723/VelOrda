import prisma from "@/lib/prisma";
import { EditForm } from "./editForm";

export default async function Page({params}:{params: Promise<{id: string}>}){
    const {id} = await params
    const category = await prisma.category.findUnique({where:{id: Number(id)}})

    return(
        <EditForm category={category}/>
    )
}