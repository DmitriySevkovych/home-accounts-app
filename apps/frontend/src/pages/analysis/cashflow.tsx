import { SectionHeading } from '../../components/Typography'
import { PageWithBackButton } from '../../components/pages/PageWithBackButton'
import { PAGES } from '../../helpers/routes'

const CashflowAnalysisPage: React.FC = () => {
    // TODO: fetch data - serverside or clientside?

    return (
        <PageWithBackButton
            heading="Cashflow Analysis"
            goBackLink={PAGES.home}
            className="flex h-full flex-col justify-between"
        >
            {/* Income summary */}
            <section>
                <SectionHeading>Income</SectionHeading>
            </section>

            {/* Expense summary */}
            <section>
                <SectionHeading>Expenses</SectionHeading>
            </section>

            {/* Assets summary */}
            <section>
                <SectionHeading>Assets</SectionHeading>
            </section>

            {/* Liabilities summary */}
            <section>
                <SectionHeading>Liabilities</SectionHeading>
            </section>

            {/* Total cashflow result */}
            <section>
                <SectionHeading>Cashflow</SectionHeading>
            </section>
        </PageWithBackButton>
    )
}

export default CashflowAnalysisPage
