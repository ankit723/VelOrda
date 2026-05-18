import { Tarrif_Type } from "@/app/generated/prisma/enums"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export default async function Page({
  params,
}: {
  params: Promise<{ c_id: string }>
}) {
  const { c_id } = await params

  const category = await prisma.category.findUnique({where:{id: Number(c_id)}})

  const tariffs = await prisma.tarrif.findMany({
    where: {
      category_id: Number(c_id),
    },
    orderBy: {
      id: "desc",
    },
  })

  // CREATE
  const createTariff = async (formData: FormData) => {
    "use server"

    const name = formData.get("name") as string
    const type = formData.get("type") as Tarrif_Type

    const price_per_min = Number(formData.get("price_per_min"))
    const min_price = Number(formData.get("min_price"))
    const max_price = Number(formData.get("max_price"))

    if (isNaN(min_price) || isNaN(max_price)) {
      throw new Error("Invalid prices")
    }

    await prisma.tarrif.create({
      data: {
        name,
        type,
        min_price,
        max_price,
        category_id: Number(c_id),
        price_per_min
      },
    })

    revalidatePath(`/admin/tarrifs/${c_id}`)
  }

  // UPDATE
  const updateTariff = async (formData: FormData) => {
    "use server"

    const tariffId = Number(formData.get("tariff_id"))

    const name = formData.get("name") as string
    const type = formData.get("type") as Tarrif_Type

    const min_price = Number(formData.get("min_price"))
    const max_price = Number(formData.get("max_price"))
    const price_per_min = Number(formData.get("price_per_min"))


    await prisma.tarrif.update({
      where: {
        id: tariffId,
      },
      data: {
        name,
        type,
        min_price,
        max_price,
        price_per_min
      },
    })

    redirect(`/admin/tarrifs/${c_id}`)
  }

  // DELETE
  const deleteTariff = async (formData: FormData) => {
    "use server"

    const tariffId = Number(formData.get("tariff_id"))

    await prisma.tarrif.delete({
      where: {
        id: tariffId,
      },
    })

    redirect(`/admin/tarrifs/${c_id}`)
  }

  return (
  <div className="min-h-[91.5vh] bg-background px-6 py-10">
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {category?.name} Tariffs
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage pricing tariffs for{" "}
          <span className="font-medium text-foreground">
            {category?.name}
          </span>
        </p>
      </div>

      {/* CREATE SECTION */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
        <div className="border-b border-border bg-muted/40 px-8 py-5">
          <h2 className="text-xl font-semibold text-foreground">
            Create Tariff
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add a new pricing tariff for this category.
          </p>
        </div>

        <form
          action={createTariff}
          className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Tariff Name
            </label>

            <Input
              name="name"
              placeholder="Example: Premium Plan"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Type
            </label>

            <select
              name="type"
              defaultValue="FIXED"
              className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            >
              <option value={Tarrif_Type.Fixed}>
                FIXED
              </option>

              <option value={Tarrif_Type.Dynamic}>
                DYNAMIC
              </option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Price per minute
            </label>

            <Input
              name="price_per_min"
              type="number"
              placeholder="0"
              className="h-11"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Minimum Price
            </label>

            <Input
              name="min_price"
              type="number"
              placeholder="0"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Maximum Price
            </label>

            <Input
              name="max_price"
              type="number"
              placeholder="1000"
              className="h-11"
            />
          </div>

          <div className="md:col-span-2 flex justify-end border-t border-border pt-6">
            <Button
              type="submit"
              className="h-11 rounded-xl px-8"
            >
              Create Tariff
            </Button>
          </div>
        </form>
      </div>

      {/* TARIFF LIST */}
      <div className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">
            Existing Tariffs
          </h2>

          <span className="rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
            {tariffs.length} Tariff
            {tariffs.length !== 1 ? "s" : ""}
          </span>
        </div>

        {tariffs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center">
            <p className="text-muted-foreground">
              No tariffs created yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {tariffs.map((tariff) => (
              <form
                key={tariff.id}
                action={updateTariff}
                className="overflow-hidden rounded-3xl border border-border bg-card transition hover:border-primary/40 hover:shadow-lg"
              >
                <input
                  type="hidden"
                  name="tariff_id"
                  value={tariff.id}
                />

                {/* Header */}
                <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Edit Tariff
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Modify tariff details
                    </p>
                  </div>

                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                    ID #{tariff.id}
                  </span>
                </div>

                {/* Body */}
                <div className="space-y-5 p-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Name
                    </label>

                    <Input
                      name="name"
                      defaultValue={tariff.name}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Type
                    </label>

                    <select
                      name="type"
                      defaultValue={tariff.type}
                      className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                    >
                      <option value={Tarrif_Type.Fixed}>
                        FIXED
                      </option>

                      <option value={Tarrif_Type.Dynamic}>
                        DYNAMIC
                      </option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Price per minute
                      </label>

                      <Input
                        name="price_per_min"
                        type="number"
                        defaultValue={
                          tariff.price_per_min || 0
                        }
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Min Price
                      </label>

                      <Input
                        name="min_price"
                        type="number"
                        defaultValue={
                          tariff.min_price || 0
                        }
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Max Price
                      </label>

                      <Input
                        name="max_price"
                        type="number"
                        defaultValue={
                          tariff.max_price || 0
                        }
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-border px-6 py-4">
                  <Button
                    type="submit"
                    className="rounded-xl px-6"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
)
}