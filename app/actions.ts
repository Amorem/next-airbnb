"use server";
import prisma from "@/app/lib/db";
import { redirect } from "next/navigation";

export async function createAirbnbHome({ userId }: { userId: string }) {
  const data = await prisma.home.findFirst({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (data == null) {
    const data = await prisma.home.create({
      data: {
        userId: userId,
      },
    });
    return redirect(`/create/${data.id}/structure`);
  } else if (
    !data.addedCategory &&
    !data.addedDescription &&
    !data.addedLocation
  ) {
    return redirect(`/create/${data.id}/structure`);
  } else if (data.addedCategory && !data.addedDescription) {
    return redirect(`/create/${data.id}/description`);
  }
}

export async function createCategoryPage(formData: FormData) {
  const data = await prisma.home.update({
    where: {
      id: formData.get("homeId") as string,
    },
    data: {
      categoryName: formData.get("categoryName") as string,
      addedCategory: true,
    },
  });
  return redirect(`/create/${formData.get("homeId")}/description`);
}
