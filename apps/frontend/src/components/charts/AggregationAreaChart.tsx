import { TransactionAggregate } from 'domain-model'
import React, { useState } from 'react'
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

import CategoriesCheckboxGrid from '../CategoriesCheckboxGrid'

type ChartData = {
    month: string
    date: Date
} & { [category: string]: number | string | Date }

type AggregatesTransform = {
    [month: string]: ChartData
}

type AggregationAreaChartProps = {
    aggregates: TransactionAggregate[]
}

const AggregationAreaChart: React.FC<AggregationAreaChartProps> = ({
    aggregates,
}) => {
    // Local state
    const [drawCategories, setDrawCategories] = useState<string[]>([])

    // Data transformations
    const transform = aggregates?.reduce(
        (transform: AggregatesTransform, aggregate) => {
            const { timeRange, category, amount } = aggregate
            const month = `${timeRange.from.getFullYear()}-${timeRange.from.getMonth() + 1}`
            if (transform[month]) {
                transform[month] = {
                    ...transform[month],
                    [category]: Math.abs(amount),
                }
            } else {
                transform[month] = {
                    month,
                    date: timeRange.from,
                    [category]: Math.abs(amount),
                }
            }
            return transform
        },
        {}
    )

    const chartData = Object.values(transform).sort(
        (a, b) => a.date.valueOf() - b.date.valueOf()
    )

    return (
        <>
            <CategoriesCheckboxGrid
                checkedCategories={drawCategories}
                setCheckedCategories={setDrawCategories}
            />

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    width={730}
                    height={250}
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient
                            id="colorUv"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#8884d8"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="#8884d8"
                                stopOpacity={0}
                            />
                        </linearGradient>
                        <linearGradient
                            id="colorPv"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#82ca9d"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="#82ca9d"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="50 50" />
                    {drawCategories.map((category, index) => (
                        <Area
                            key={`area-chart-${category}`}
                            type="monotone"
                            dataKey={category}
                            stroke={index % 2 === 0 ? '#8884d8' : '#82ca9d'}
                            fillOpacity={1}
                            fill={
                                index % 2 === 0
                                    ? 'url(#colorUv)'
                                    : 'url(#colorPv)'
                            }
                        />
                    ))}
                    <Area type="monotone" dataKey="_placeholderToDrawXAxis" />
                </AreaChart>
            </ResponsiveContainer>
        </>
    )
}

export default AggregationAreaChart
