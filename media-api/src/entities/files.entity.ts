import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('files')
export class FileEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text') 
    path: string;
    
    @Column({
        type: 'enum',
        enum: ['processing', 'failed', 'successful'],
        default: 'processing'
    })
    status: 'processing' | 'failed' | 'successful';

    @Column('text')
    output_path: string;

    @Column('text')
    error: string;

    @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}