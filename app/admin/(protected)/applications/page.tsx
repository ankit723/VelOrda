import { CategoryScalarFieldEnum } from "@/app/generated/prisma/internal/prismaNamespace";
import { getAllCategories } from "@/lib/category.actions";
import Link from "next/link";

export default async function Page() {
    const categories = await getAllCategories()

    return (
        <div className="w-full h-full p-6 flex flex-col ">
            <h1 className="text-3xl font-bold">Select the Category of Managing applications</h1>
            <div className="flex w-full justify-center">
                <div className="w-1/2 flex justify-between gap-6 mt-20">

                    {categories.map(c=>(
                        <Link key={c.id} href={`/admin/applications/${c.id}`}>
                            <div className="bg-card text-card-foreground p-6 rounded-2xl flex justify-center items-center border w-full hover:scale-105 active:scale-95 transition-all">
                                {c.name}        
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )

}