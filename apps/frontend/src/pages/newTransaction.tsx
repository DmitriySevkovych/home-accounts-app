export default function newTransactionPage() {
    const tempCategories: string[] = ['FOOD', 'TRANSPORTATION', 'VACATION']
    const tags: string[] = []
    const paymentMethods: string[] = ['PAYPAL', 'CASH', 'EC']
    const bankAccounts: string[] = [
        'KSKWN',
        'CoBa Premium',
        'CoBa Business',
        'CoBa Invest Wasen',
    ]
    const taxCategories: string[] = [
        'EINKOMMENSTEUER',
        'AUSSERORDENTLICHE_BELASTUNGEN',
        'VERMIETUNG_UND_VERPACHTUNG',
        'WERBUNGSKOSTEN',
    ]
    return (
        <>
            <h1>Create Transaction</h1>
            <div>
                <form action="">
                    <label htmlFor="category">Category</label>
                    <select name="category" id="category">
                        {tempCategories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="origin">Origin</label>
                    <input id="origin" type="text" placeholder="origin" />

                    <label htmlFor="description">Description</label>
                    <input
                        id="description"
                        type="text"
                        placeholder="description"
                    />

                    <label htmlFor="transactionDate">Transaction date:</label>
                    <input
                        type="date"
                        id="transactionDate"
                        name="transactionDate"
                    ></input>

                    <label htmlFor="amount">Amount</label>
                    <input type="number" id="amount" />

                    <label htmlFor="currency">Currency</label>
                    <input type="text" id="currency" />

                    <label htmlFor="exchangeRate">Exchange Rate</label>
                    <input type="number" id="exchangeRate" />

                    <label htmlFor="paymentMethod">Payment Method</label>
                    <select name="paymentMethod" id="paymentMethod">
                        {paymentMethods.map((paymentMethod) => (
                            <option key={paymentMethod} value={paymentMethod}>
                                {paymentMethod}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="sourceBankAccount">
                        Source Bank Account
                    </label>
                    <select name="sourceBankAccount" id="sourceBankAccount">
                        {bankAccounts.map((bankAccount) => (
                            <option key={bankAccount} value={bankAccount}>
                                {bankAccount}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="targetBankAccount">
                        Target Bank Account
                    </label>
                    <select name="targetBankAccount" id="targetBankAccount">
                        {bankAccounts.map((bankAccount) => (
                            <option key={bankAccount} value={bankAccount}>
                                {bankAccount}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="taxCategory">Tax Category</label>
                    <select name="taxCategory" id="taxCategory">
                        {taxCategories.map((taxCategory) => (
                            <option key={taxCategory} value={taxCategory}>
                                {taxCategory}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="comment">Comment</label>
                    <textarea name="comment" id="comment" />

                    <p>Select specifics</p>
                    <input
                        type="radio"
                        id="NoSpecifics"
                        name="specifics"
                        value="NoSpecifics"
                        defaultChecked
                    />
                    <label htmlFor="NoSpecifics">None</label>
                    <input
                        type="radio"
                        id="WorkSpecifics"
                        name="specifics"
                        value="WorkSpecifics"
                    />
                    <label htmlFor="WorkSpecifics">WorkSpecifics</label>
                    <input
                        type="radio"
                        id="InvestmentSpecifics"
                        name="specifics"
                        value="InvestmentSpecifics"
                    />
                    <label htmlFor="InvestmentSpecifics">
                        InvestmentSpecifics
                    </label>

                    <label htmlFor="newTag">New tag</label>
                    <input id="newTag" type="text" placeholder="new tag" />
                    <div>
                        {tags.map((tag) => (
                            <div key={tag}>{tag}</div>
                        ))}
                    </div>
                </form>
            </div>
        </>
    )
}
