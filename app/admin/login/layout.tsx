import {cookies} from "next/headers"
import {redirect} from "next/navigation"

export default async function AdminLayout({children}:{children:React.ReactNode}){
    const cookieStore = await cookies()
    if(cookieStore.get("token")?.value) return redirect("/admin/categories")

    return (
        <div className="w-screen h-screen bg-background text-foreground">
            {children}
        </div>
    )
}