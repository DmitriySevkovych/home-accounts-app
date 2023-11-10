import { useRouter } from 'next/router'
import React from 'react'

const EditPage = () => {
    const router = useRouter()
    const { id } = router.query

    return (
        <div>
            <p>Dynamic Page</p>
            <p>ID: {id}</p>
        </div>
    )
}

export default EditPage
