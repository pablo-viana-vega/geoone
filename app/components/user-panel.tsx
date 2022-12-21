import { useNavigate } from '@remix-run/react'

export function UserPanel({user}:{user:any}) {

    const navigate = useNavigate()

    return (
        <>
            <div className="w-1/6 bg-gray-200 flex flex-col">
                <div className="text-center bg-gray-300 h-20 flex items-center justify-center">
                    <h2 className="text-xl text-blue-600 font-semibold">Olá {user.profile.firstName}</h2>
                </div>
                <div className="flex-1 overflow-y-scroll py-4 flex flex-col gap-y-10 justify-start items-center">
                    <p onClick={() => navigate(`/myprojects`)}>Meus Projetos</p>
                    <p>{JSON.stringify(user) }</p>

                </div>
                <div className="text-center p-6 bg-gray-300">
                    <form action="/logout" method="post">
                        <button
                            type="submit"
                            className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                        >
                            Sair
                        </button>
                    </form>
                </div>
            </div>
            <div className="w-5/6 bg-gray-200 flex flex-col">

            </div>
        </>
    )
}