import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
  })

  const condition = await prisma.rentCondition.findFirst({
    where: {
      category_id: Number(id),
    },
  })

  const createRentCondition = async (formData: FormData) => {
    "use server"

    const weather = formData.getAll("weather") as string[]

    const ratingValue = formData.get("rating") as string
    const rating = Number(ratingValue)

    if (isNaN(rating)) {
      throw new Error("Invalid rating")
    }

    await prisma.rentCondition.upsert({
      where: {
        category_id: Number(id),
      },
      update: {
        weather,
        user_rating: rating,
      },
      create: {
        weather,
        user_rating: rating,
        category_id: Number(id),
      },
    })

    redirect("/admin/rent-conditions")
  }

  return (
    <div className="min-h-[91.5vh] bg-background px-6 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {category?.name} Rental Conditions
          </h1>

          <p className="mt-2 text-muted-foreground">
            Configure rental conditions for{" "}
            <span className="font-medium text-foreground">
              {category?.name}
            </span>
          </p>
        </div>

        {/* Main Container */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
          {/* Top Bar */}
          <div className="border-b border-border bg-muted/40 px-8 py-5">
            <h2 className="text-xl font-semibold text-foreground">
              Rental Settings
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Set weather conditions and minimum rating required
              for rentals.
            </p>
          </div>

          {/* Form */}
          <form
            action={createRentCondition}
            className="space-y-10 p-8"
          >
            {/* Weather */}
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-foreground">
                  Allowed Weather Conditions
                </label>

                <p className="mt-1 text-sm text-muted-foreground">
                  Select weather types where rental is allowed.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  {
                    label: "Clear",
                    value: "clear",
                  },
                  {
                    label: "Fog",
                    value: "fog",
                  },
                  {
                    label: "Rain",
                    value: "rain",
                  },
                  {
                    label: "Snow",
                    value: "snow",
                  },
                ].map((item) => (
                  <label
                    key={item.value}
                    className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-border bg-muted/30 p-4 transition-all duration-200 hover:border-primary hover:bg-muted"
                  >
                    <input
                      type="checkbox"
                      name="weather"
                      value={item.value}
                      defaultChecked={condition?.weather?.includes(
                        item.value
                      )}
                      className="h-5 w-5 accent-primary"
                    />

                    <div>

                      <p className="text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="rating"
                  className="text-sm font-semibold text-foreground"
                >
                  Minimum User Rating
                </label>

                <p className="mt-1 text-sm text-muted-foreground">
                  Users below this rating will not be able to rent.
                </p>
              </div>

              <div className="max-w-sm">
                <Input
                  name="rating"
                  id="rating"
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  placeholder="Example: 4.5"
                  defaultValue={
                    condition?.user_rating ?? ""
                  }
                  className="h-12 rounded-xl border-border bg-background text-base"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-border pt-6">
              <Button
                type="submit"
                className="h-11 rounded-xl px-8"
              >
                Save Condition
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}