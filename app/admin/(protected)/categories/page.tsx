import { Button } from "@/components/ui/button";
import { deleteCategory, getAllCategories } from "@/lib/category.actions";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Page(){
    const categories = await getAllCategories()
    return(
        <div className="w-full h-full p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl ">Categories</h1>
                <Link href={"/admin/categories/new"}><Button>New</Button></Link>
            </div>

            <div className="mt-20 flex flex-col w-full bg-card border text-card-foreground rounded-2xl">
                <div className="grid grid-cols-5 border-b p-4">
                    <p>Id</p>
                    <p>Name</p>
                    <p className="text-center col-span-3">Actions</p>
                </div>

                {
                    categories.map((c, i)=>(
                        <div key={c.id} className="grid grid-cols-5 p-6">
                            <p>{i+1}</p>
                            <p>{c.name}</p>
                            <Link href={`/admin/categories/${c.id}/bicycles`} className="text-center"><Button>View Bicycles</Button></Link>
                            <Link href={`/admin/categories/${c.id}/edit`} className="text-center"><Button>Edit</Button></Link>
                            <form action={deleteCategory.bind(null, c.id)} className="text-center"><Button type="submit">Delete Category</Button></form>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}