import { SystemInfo, SystemInfoFooter } from '../components/SystemInfoFooter'
import { safeFetch } from '../helpers/requests'
import { API } from '../helpers/routes'

// import styles from '../styles/Home.module.css'

type HomePageProps = {
    systemInfo: SystemInfo
}

export default function Home({ systemInfo }: HomePageProps) {
    return (
        <>
            <SystemInfoFooter {...systemInfo} />
        </>
    )
}

export const getServerSideProps = async () => {
    let backendInfo
    try {
        const req = await safeFetch(API.server.system.info())
        backendInfo = await req.json()
    } catch (err) {
        backendInfo = {
            error: `Fetch ${API.server.system.info()} failed`,
        }
        console.error(err)
    }
    return {
        props: {
            systemInfo: {
                frontend: {
                    environment: process.env.APP_ENV,
                    branch: process.env.GIT_BRANCH
                        ? process.env.GIT_BRANCH
                        : '',
                    commit: process.env.GIT_COMMIT
                        ? process.env.GIT_COMMIT
                        : '',
                },
                backend: backendInfo,
            },
        },
    }
}
