import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function Page({
  params,
}: {
  params: Promise<{ c_id: string }>
}) {
  const { c_id } = await params

  const category = await prisma.category.findUnique({where: {id: Number(c_id)}})

  const promo = await prisma.promoCode.findUnique({
    where: {
      category_id: Number(c_id),
    },
  })

  const savePromoCode = async (
    formData: FormData
  ) => {
    "use server"

    const code = formData.get("code") as string

    const free_usage_min =
      formData.get("free_usage_min")
        ? Number(
            formData.get(
              "free_usage_min"
            )
          )
        : null

    const discount_percent =
      formData.get("discount_percent")
        ? Number(
            formData.get(
              "discount_percent"
            )
          )
        : null

    const expires_at = new Date(
      formData.get(
        "expires_at"
      ) as string
    )

    await prisma.promoCode.upsert({
      where: {
        category_id: Number(c_id),
      },
      update: {
        code,
        expires_at,
        free_usage_min,
        discount_percent,
      },
      create: {
        code,
        expires_at,
        free_usage_min,
        discount_percent,
        category_id: Number(c_id),
      },
    })

    redirect(`/admin/promo-codes/${c_id}`)
  }

  const deletePromoCode = async () => {
    "use server"

    await prisma.promoCode.delete({
      where: {
        category_id: Number(c_id),
      },
    })

    redirect(`/admin/promo-codes/${c_id}`)
  }

  return (
    <div className="min-h-[91.5vh] bg-background px-6 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {category?.name} Promo Code
          </h1>

          <p className="mt-2 text-muted-foreground">
            Configure promotional benefits for{" "}
            <span className="font-medium text-foreground">
              {category?.name}
            </span>
          </p>
        </div>

        {/* Main Container */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
          {/* Header */}
          <div className="border-b border-border bg-muted/40 px-8 py-5">
            <h2 className="text-xl font-semibold text-foreground">
              {promo
                ? "Update Promo Code"
                : "Create Promo Code"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Set discount or free usage benefits
              for this category.
            </p>
          </div>

          {/* Form */}
          <form
            action={savePromoCode}
            className="space-y-6 p-8"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Promo Code
              </label>

              <Input
                name="code"
                defaultValue={
                  promo?.code ?? ""
                }
                placeholder="SUMMER2026"
                className="h-11"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Free Usage Minutes
                </label>

                <Input
                  name="free_usage_min"
                  type="number"
                  defaultValue={
                    promo?.free_usage_min ??
                    ""
                  }
                  placeholder="10"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Discount Percent
                </label>

                <Input
                  name="discount_percent"
                  type="number"
                  step="0.1"
                  defaultValue={
                    promo?.discount_percent ??
                    ""
                  }
                  placeholder="20"
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Expiration Time
              </label>

              <Input
                name="expires_at"
                type="datetime-local"
                defaultValue={
                  promo?.expires_at
                    ? new Date(
                        promo.expires_at
                      )
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                className="h-11"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 border-t border-border pt-6">
              <Button
                type="submit"
                className="flex-1 rounded-xl"
              >
                {promo
                  ? "Save Changes"
                  : "Create Promo Code"}
              </Button>
            </div>
          </form>

          {/* Delete */}
          {promo && (
            <div className="px-8 pb-8">
              <form action={deletePromoCode}>
                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full rounded-xl"
                >
                  Delete Promo Code
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}