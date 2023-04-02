# Domain model description

## Goals of the application:

-   managing income and expense information
    -   data describing the cause of an action
    -   data describing the payment/transaction
    -   data documenting the action (eg. receipts)
-   managing investments

First, let's define a "project-sense" **context**: _home_, _work_, _investments_ are called **contexts** in this project. The contexts are partly overlapping (cf. **transactions** below).

## Description

### Domain Model

Managed data can be broadly categorized as **with** or **without a monetary transaction**.

A monetary **transaction** is a central immutable value containing _essential_ information about the movement of money (date, amount, type of transaction, involved bank accounts, among others), as well as _additional_ **transaction details** and **transaction receipts** (documents proving that a transaction has taken place). Transactions are **context-agnostic**, i.e. the transaction looks and behaves always the same regardless of the context. Thus, it is neither necessary nor meaningful to consider context when talking solely on the level of transactions.
NOTE: the concept of a _database transaction_, if the domain model should need to be aware of it, should be explicitly called a database transaction or DB-transaction.

An **expense** is an immutable value that describes an action which resulted in an outgoing monetary transaction. An expense consists of data describing the action and _contains/references_ a transaction. Every expense is **context-aware** (ie. home expense, work expense, investment expense) and can contain additional data, which is specific to its particular context (eg. work expense -> VAT as additional relevant data).

### Repositories (data persistence interface)

TODO

### Services (data manipulation interfaces)

TODO
