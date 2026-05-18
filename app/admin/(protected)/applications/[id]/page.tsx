import prisma from "@/lib/prisma"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const category = await prisma.category.findUnique({where:{id:Number(id)}})

  const applications = await prisma.applications.findMany({
    where: {
      category_id: Number(id),
    },
    orderBy: {
      id: "desc",
    },
  })

  return (
  <div className="min-h-[91.5vh] bg-background px-6 py-10">
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {category?.name} Applications
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage submitted applications for{" "}
          <span className="font-medium text-foreground">
            {category?.name}
          </span>
        </p>
      </div>

      {/* Applications */}
      {applications.length === 0 ? (
        <div className="rounded-3xl border border-border bg-muted/20 py-20 text-center">
          <h3 className="text-lg font-medium text-foreground">
            No Applications Yet
          </h3>

          <p className="mt-2 text-muted-foreground">
            No users have submitted applications for this
            category.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {applications.map((application) => (
            <div
              key={application.id}
              className="overflow-hidden rounded-3xl border border-border bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-lg"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-4">
                <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                  ID #{application.id}
                </span>

                <span className="text-sm text-muted-foreground">
                  {new Date(
                    application.created_at
                  ).toLocaleDateString()}
                </span>
              </div>

              {/* Body */}
              <div className="space-y-5 p-5">
                {/* Name */}
                <div className="rounded-2xl bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Name
                  </p>

                  <p className="mt-1 text-base font-semibold text-foreground">
                    {application.name}
                  </p>
                </div>

                {/* Phone */}
                <div className="rounded-2xl bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Phone
                  </p>

                  <p className="mt-1 text-base font-medium text-foreground">
                    {application.phone}
                  </p>
                </div>

                {/* Email */}
                <div className="rounded-2xl bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Email
                  </p>

                  <p className="mt-1 break-all text-base font-medium text-foreground">
                    {application.email}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)
}