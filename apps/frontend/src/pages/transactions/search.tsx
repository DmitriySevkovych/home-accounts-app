import {
    TransactionFormConstants,
    fetchTransactionConstants,
} from '../../components/TransactionFormPage'

type SearchTransactionsPageProps = {
    constants: TransactionFormConstants
}

const SearchTransactionsPage: React.FC<SearchTransactionsPageProps> = () => {
    return <></>
}

export const getServerSideProps = async () => {
    try {
        return {
            props: {
                constants: await fetchTransactionConstants(),
            },
        }
    } catch (err) {
        console.log(err)
    }
}

export default SearchTransactionsPage
