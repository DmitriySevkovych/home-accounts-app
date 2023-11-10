import { Transaction } from 'domain-model'
import React from 'react'

import { SERVER_BACKEND_BASE_URL } from '../../helpers/constants'

type EditPageProps = {
    transaction: Transaction
}

const EditTransactionPage = ({ transaction }: EditPageProps) => {
    const { id, origin } = transaction
    return (
        <div>
            <p>Dynamic Page</p>
            <p>ID: {id}</p>
            <p>Origin: {origin}</p>
        </div>
    )
}

export async function getServerSideProps(context: any) {
    const { id } = context.query
    try {
        const response = await fetch(
            `${SERVER_BACKEND_BASE_URL}/transactions/${id}`
        )
        const transaction = await response.json()

        return {
            props: {
                transaction,
            },
        }
    } catch (err) {
        console.log(err)
    }
}

export default EditTransactionPage
