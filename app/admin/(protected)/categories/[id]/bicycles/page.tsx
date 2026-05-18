import { Button } from "@/components/ui/button";
import { deleteCategory, getAllCategories } from "@/lib/category.actions";
import prisma from "@/lib/prisma";
import { deleteBicycleAction } from "@/lib/product.actions";
import Image from "next/image";
import Link from "next/link";

export default async function Page({params}:{params: Promise<{id: string}>}){
    const {id} = await params
    const bicycles = await prisma.bicycle.findMany({where:{category_id: Number(id)}})

    return(
        <div className="w-full h-full p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl ">Bicycles of Category {}</h1>
                <Link href={`/admin/categories/${id}/bicycles/new`}><Button>New</Button></Link>
            </div>

            <div className="mt-20 flex flex-col w-full bg-card border text-card-foreground rounded-2xl">
                <div className="grid grid-cols-14 border-b p-4">
                    <p>Id</p>
                    <p>Image</p>
                    <p className="col-span-2">Name</p>
                    <p className="col-span-3">Description</p>
                    <p className="col-span-3">Slug</p>
                    <p>Wear</p>
                    <p>Availability</p>
                    <p className="text-center col-span-2">Actions</p>
                </div>

                {
                    bicycles.map((b, i)=>(
                        <div key={i} className="grid grid-cols-14 border-b p-4">
                            <p>{i+1}</p>
                            {b.image ? (
                                <Image src={b.image || ""} alt="Cycle photo" width={20} height={20}/>
                            ):(
                                <div className="w-10 h-10 bg-accent"></div>
                            )}
                            <p className="col-span-2">{b.name}</p>
                            <p className="col-span-3">{b.description}</p>
                            <p className="col-span-3">{b.slug}</p>
                            <p>{b.wear}</p>
                            <p>{b.available?"Available":"Not Available"}</p>
                            <Link href={`/admin/categories/${id}/bicycles/${b.id}/edit`} className="text-center"><Button>Edit</Button></Link>
                            <form action={deleteBicycleAction.bind(null, b.id)} className="text-center"><Button type="submit">Delete Bicycle</Button></form>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}