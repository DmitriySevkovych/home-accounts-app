import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class IncomeType {
    @PrimaryColumn()
    type: string

    @Column()
    description: string
}
