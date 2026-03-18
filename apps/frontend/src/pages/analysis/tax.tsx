import { OutputVATSummary, USTVA } from 'domain-model'
import React, { useState } from 'react'
import useSWR from 'swr'

import TimeRangeManager, {
    TimeRangeSelection,
    getTimeRange,
} from '../../components/TimeRangeManager'
import { Loader, SectionHeading } from '../../components/Typography'
import { PageWithBackButton } from '../../components/pages/PageWithBackButton'
import { safeFetch } from '../../helpers/requests'
import { PAGES } from '../../helpers/routes'
import {
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Select as ShadcnSelect,
} from '../../lib/shadcn/Select'

type TaxReportOwner = 'Dmitriy' | 'Ivanna'

const _fetchUSTVA = async (
    url: string,
    owner: TaxReportOwner,
    timeRange: TimeRangeSelection
): Promise<USTVA> => {
    const from = timeRange.from.toISOString().split('T')[0]
    const to = timeRange.until.toISOString().split('T')[0]
    const res = await safeFetch(`${url}?owner=${owner}&from=${from}&to=${to}`)
    return await res.json()
}

const _declareUntil = (outputVAT: OutputVATSummary | null): string => {
    if (!outputVAT) {
        const now = new Date()
        return `${now.getFullYear()}-${now.getMonth()}-10 (missing data‼️)`
    }

    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Berlin',
    }).format(new Date(outputVAT.declareUntil))
}

const TaxPage = () => {
    // Local state
    const [timeRange, setTimeRange] = useState<TimeRangeSelection>(
        getTimeRange('currentMonth')
    )

    const [owner, setOwner] = useState<TaxReportOwner>('Dmitriy')

    // Queried data
    const {
        data: ustva,
        error,
        isLoading,
    } = useSWR(
        ['/api/v1/taxes/ustva', owner, timeRange],
        ([url, owner, timeRange]) => _fetchUSTVA(url, owner, timeRange)
    )

    if (error) console.error(error)

    if (isLoading || !ustva) return <Loader />

    const { output, input } = ustva

    console.log({ ustva })

    return (
        <PageWithBackButton
            heading="⚖️🪙Tax Overview page"
            goBackLink={PAGES.home}
            className="flex h-full flex-col justify-between"
            stickyButton={
                <div className="sticky bottom-0 right-0 place-self-end pb-6">
                    <TimeRangeManager
                        timeRange={timeRange}
                        setTimeRange={setTimeRange}
                    />
                </div>
            }
        >
            <section className="flex flex-col gap-8">
                <SectionHeading>{`Monthly USTVA for ${owner} to declare until 🎯${_declareUntil(output)}🎯`}</SectionHeading>

                <div>
                    <ShadcnSelect
                        value={owner}
                        onValueChange={(value) =>
                            setOwner(value as TaxReportOwner)
                        }
                    >
                        <div className="flex items-baseline gap-2">
                            <p>Show transactions of </p>
                            <SelectTrigger className="w-full max-w-48">
                                <SelectValue />
                            </SelectTrigger>
                        </div>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="Ivanna">Ivanna</SelectItem>
                                <SelectItem value="Dmitriy">Dmitriy</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </ShadcnSelect>
                </div>

                <div className="flex flex-col gap-2">
                    <p>VAT (Umsatzsteuer)</p>
                    <p>{`File in net income amount at ${output?.vat ?? 0 * 100}% VAT: 🎯${output?.netAmount ?? 0} EUR`}</p>
                    <p>{`👉 Check VAT amount is ${output?.taxAmount ?? 0} EUR`}</p>
                    <p>{`👉 Check gross amount is ${(output?.netAmount ?? 0) + (output?.taxAmount ?? 0)} EUR`}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p>Input VAT (Vorsteuer)</p>
                    {input.map((inp) => (
                        <p
                            key={inp.country}
                        >{`🌐${inp.country}: file in input VAT deductible: 🎯${inp.inputTaxAmount.toFixed(2)} EUR`}</p>
                    ))}
                </div>
            </section>
        </PageWithBackButton>
    )
}

export default TaxPage
