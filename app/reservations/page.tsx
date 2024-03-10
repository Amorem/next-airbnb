import { NoItems } from "../components/NoItems";
import { ListingCard } from "../components/ListingCard";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";


async function getData(userId: string) {

    const data = await prisma?.reservation.findMany({
        where: {
            userId: userId,
        },
        select: {
            Home: {
                select: {
                    photo: true,
                    id: true,
                    price: true,
                    description: true,
                    country: true,
                    Favorite: {
                        where: {
                        userId: userId
                        }
                    }
                },
            },
        },
    }
    )
    return data;
}

export default async function ReservationsRoute() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) return redirect("/");
    const data = await getData(user.id);
    return (
        <section className="container mx-auto px-5 lg:px-10 mt-10">
          <h2 className="text-3xl font-semibold tracking-tight ">Your reservations</h2>
          {data?.length === 0 ? (
            <NoItems
              title="You dont have any reservations yet..."
              description="Please add a reservation to see them right here..."
            />
          ) : (
            <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">
              {data?.map((home) => (
                <ListingCard
                  key={home.Home?.id}
                  homeId={home.Home?.id as string}
                  price={home.Home?.price as number}
                  location={home.Home?.country as string}
                  description={home.Home?.description as string}
                  imagePath={home.Home?.photo as string}
                  userId={user.id}
                  favoriteId={home.Home?.Favorite[0]?.id as string}
                  isInFavoriteList={
                    (home.Home?.Favorite.length as number) > 0 ? true : false
                  }
                  pathName="/favorites"
                />
              ))}
            </div>
          )}
        </section>
      );;
}