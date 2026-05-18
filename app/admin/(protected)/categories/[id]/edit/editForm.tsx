'use client';

import { Category } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategoryAction } from "@/lib/category.actions";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export function EditForm({category}:{category: Category | null}){
    const [state, action] = useActionState(createCategoryAction, {error: "", success: false})
    const router = useRouter()

    if(!category) return (
        <div className="">Category Not found</div>
    )
    useEffect(()=>{
        if(state.error){
            toast(state.error)
        }
    }, [state])

    return(
        <div className="w-full h-[90vh] flex justify-center items-center">
            <div className="bg-card border text-card-foreground p-6 w-100 rounded-2xl">
                <h1 className="text-center text-3xl font-bold">Update Category</h1>
                <form action={action} className="w-full space-y-6 mt-4">
                    <input type="hidden" name="id" value={category.id} />
                    <Input type="text" name="name" placeholder="Enter category name" defaultValue={category.name}/>
                    <Button className="w-full" size={"lg"} type="submit">Create</Button>
                </form>
            </div>
        </div>
    )
}