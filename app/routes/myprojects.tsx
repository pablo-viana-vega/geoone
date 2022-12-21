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
    return json({ user }) // <- A loader always has to return some value, even if that is null



const createProject = await prisma.projects.create({
    data: {
        projectName: 'teste',
        description: 'isjvksndcvnscnvlksncvlksnvlsc',
        lat: '65165156165654',
        long: '1651516516515313',
        user: {
            connect: {
                id: uId
            },
        },

    },
})
}

export default function myprojects() {
    const { user, createProject } = useLoaderData()
    return (

        <div className="h-full w-full flex z-40">

            <h1>Projetos</h1>
            <Outlet />
            <div className="h-full w-full flex z-40">
                <UserPanel user={user} />
            </div>
        </div>

    )
}