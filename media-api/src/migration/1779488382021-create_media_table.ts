import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMediaTable1779488382021 implements MigrationInterface {
    private readonly tableName = 'files';

    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            const tableExists = await queryRunner.hasTable(this.tableName);
            if (tableExists) {
                console.warn(`Table ${this.tableName} already exists. Skipping creation.`);
                return;
            }

            await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
            await queryRunner.createTable(
                new Table({
                    name: this.tableName,
                    columns: [
                        {
                            name: 'id',
                            type: 'uuid',
                            isPrimary: true,
                            generationStrategy: 'uuid',
                            default: 'uuid_generate_v4()',
                        },
                        {
                            name: 'path',
                            type: 'text',
                            isNullable: false,
                        },
                        {
                            name: 'status',
                            type: 'enum',
                            enum: ['processing', 'failed', 'successful'],
                            default: `'processing'`,
                        },
                        {
                            name: 'output_path',
                            type: 'text',
                            isNullable: true,
                        },
                        {
                            name: 'error',
                            type: 'text',
                            isNullable: true,
                        },
                        {
                            name: 'created_at',
                            type: 'timestamp with time zone',
                            default: 'now()',
                        },
                        {
                            name: 'updated_at',
                            type: 'timestamp with time zone',
                            default: 'now()',
                        },
                    ],
                }),
                true, // ifNotExist
            );

            console.log(`Table ${this.tableName} created successfully.`);
        } catch (error) {
            console.error(`Error creating table ${this.tableName}: ${error}`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            const tableExists = await queryRunner.hasTable(this.tableName);
            if (tableExists) {
                queryRunner.dropTable(this.tableName, true).then(() => {
                    console.log(`Table ${this.tableName} dropped successfully.`);
                }) // ifExist
            }
        } catch (error) {
            console.error(`Error dropping table ${this.tableName}: ${error}`);
        }
    }
}
