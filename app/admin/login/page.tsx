'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction, registerAction } from "@/lib/user.actions";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function Page(){
    const [state, action] = useActionState(loginAction, {error: "", success: false})

    useEffect(()=>{
        if(state.error){
            toast(state.error)
        }
    }, [state])

    return(
        <div className="w-full h-full flex justify-center items-center">
            <div className="bg-card border text-card-foreground p-6 w-100 rounded-2xl">
                <h1 className="text-center text-3xl font-bold">Velorda Login</h1>
                <form action={action} className="w-full space-y-6 mt-4">
                    <Input type="text" name="email" placeholder="Enter your email"/>
                    <p className="text-base">OR</p>
                    <Input type="text" name="phone" placeholder="Enter your Phone"/>
                    <Input type="password" name="password" placeholder="Enter Password"/>
                    <Button className="w-full" size={"lg"} type="submit">Login</Button>
                </form>
            </div>
        </div>
    )
}