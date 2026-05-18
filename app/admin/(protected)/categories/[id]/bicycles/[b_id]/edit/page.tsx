import prisma from "@/lib/prisma";
import { EditForm } from "./editForm";

export default async function Page({params}:{params: Promise<{b_id: string}>}){
    const {b_id} = await params
    const bicycle = await prisma.bicycle.findUnique({where:{id: Number(b_id)}})

    return(
        <EditForm bicycle={bicycle}/>
    )
}