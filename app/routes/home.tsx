import { LoaderFunction, json } from '@remix-run/node'
import { requireUserId } from '~/Utils/auth.server'
import { Layout } from '~/components/layout'
import { UserPanel } from '~/components/user-panel'
import { Outlet, useLoaderData } from '@remix-run/react'
import { prisma } from '~/Utils/prisma.server'

export const loader: LoaderFunction = async ({ request }) => {
    const uId = await requireUserId(request)
    const user = await prisma.user.findUnique({
        where: { id: uId },
        select: { id: true, email: true, profile: true, projects: true },
    })
    return json({user}) // <- A loader always has to return some value, even if that is null
}


export default function Home() {
    const { user } = useLoaderData()



    return (
        <Layout>
            <Outlet />
            <div className="h-full w-full flex z-40">
                <UserPanel user={user} />
            </div>
        </Layout>
    )
}