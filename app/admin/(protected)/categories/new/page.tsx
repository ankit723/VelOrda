'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategoryAction } from "@/lib/category.actions";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function Page(){
    const [state, action] = useActionState(createCategoryAction, {error: "", success: false})

    useEffect(()=>{
        if(state.error){
            toast(state.error)
        }
    }, [state])

    return(
        <div className="w-full h-[90vh] flex justify-center items-center">
            <div className="bg-card border text-card-foreground p-6 w-100 rounded-2xl">
                <h1 className="text-center text-3xl font-bold">Create Category</h1>
                <form action={action} className="w-full space-y-6 mt-4">
                    <Input type="text" name="name" placeholder="Enter category name"/>
                    <Button className="w-full" size={"lg"} type="submit">Create</Button>
                </form>
            </div>
        </div>
    )
}