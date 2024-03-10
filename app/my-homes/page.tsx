import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "../lib/db";
import { redirect } from "next/navigation";
import { NoItems } from "../components/NoItems";
import { ListingCard } from "../components/ListingCard";

async function getData(userId: string) {
  const data = await prisma.home.findMany({
    where: {
      userId: userId,
      addedCategory: true,
      addedDescription: true,
      addedLocation: true,
    },
    select: {
      photo: true,
      id: true,
      price: true,
      description: true,
      country: true,
      Favorite: {
        where: {
          userId: userId,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
}

export default async function MyHomes() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return redirect("/");
  const data = await getData(user.id);
  return (
    <section className="container mx-auto px-5 lg:px-10 mt-10">
      <h2 className="text-3xl font-semibold tracking-tight">Your Homes</h2>
      {data?.length === 0 ? (
        <NoItems
          title="You dont have any Homes listed"
          description="Please list a Home on AirBnB"
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">
          {data?.map((home) => (
            <ListingCard
              key={home.id}
              imagePath={home.photo as string}
              description={home.description as string}
              price={home.price as number}
              location={home.country as string}
              homeId={home.id}
              userId={user.id}
              favoriteId={home.Favorite[0]?.id}
              pathName="/my-homes"
              isInFavoriteList={home.Favorite.length > 0 ? true : false}
            />
          ))}
        </div>
      )}
    </section>
  );
}
