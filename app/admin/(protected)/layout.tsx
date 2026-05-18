import { Button } from "@/components/ui/button"
import {cookies} from "next/headers"
import Link from "next/link"
import {redirect} from "next/navigation"

export default async function AdminLayout({children}:{children:React.ReactNode}){
    const cookieStore = await cookies()
    if(!cookieStore.get("token")?.value) return redirect("/admin/login")

    return (
        <div className="w-screen min-h-screen bg-background text-foreground">
            <div className="w-full bg-card h-20 flex justify-between items-center p-6 text-card-foreground border">
                <h1 className="text-4xl font-bold">VelOrda</h1>

                <ul className="flex items-center gap-3">
                    <Link href={"/admin/categories"}><Button>Categories</Button></Link>
                    <Link href={"/admin/rent-conditions"}><Button>Rent Conditions</Button></Link>
                    <Link href={"/admin/tarrifs"}><Button>Tarrifs</Button></Link>
                    <Link href={"/admin/applications"}><Button>Application</Button></Link>
                    <Link href={"/admin/promo-codes"}><Button>Promo Codes</Button></Link>
                </ul>
            </div>
            <main className="">
                {children}
            </main>
        </div>
    )
}