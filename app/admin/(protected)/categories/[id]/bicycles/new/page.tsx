'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createCategoryAction } from "@/lib/category.actions";
import { createProductAction } from "@/lib/product.actions";
import { useParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function Page(){
    const [state, action] = useActionState(createProductAction, {error: "", success: false})
    const {id} = useParams()
    console.log(id)

    useEffect(()=>{
        if(state.error){
            toast(state.error)
        }
    }, [state])

    return(
        <div className="w-full h-[90vh] flex justify-center items-center">
            <div className="bg-card border text-card-foreground p-6 w-100 rounded-2xl">
                <h1 className="text-center text-3xl font-bold">Create Cycle</h1>
                <form action={action} className="w-full space-y-6 mt-4">
                    <input type="hidden" name="cat_id" value={id} />
                    <Input type="file" name="image"/>
                    <Input type="text" name="name" placeholder="Enter cycle name"/>
                    <Textarea name="description" placeholder="Enter cycle description"></Textarea>
                    <Input type="number" name="quantity" placeholder="Enter the quantity of cycles"/>
                    <Button className="w-full" size={"lg"} type="submit">Create</Button>
                </form>
            </div>
        </div>
    )
}