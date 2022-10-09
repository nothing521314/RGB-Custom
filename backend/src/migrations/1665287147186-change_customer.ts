import {MigrationInterface, QueryRunner} from "typeorm";

export class changeCustomer1665287147186 implements MigrationInterface {
    name = 'changeCustomer1665287147186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount_condition_product" DROP CONSTRAINT "FK_f05132301e95bdab4ba1cf29a24"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" DROP CONSTRAINT "FK_c759f53b2e48e8cfb50638fe4e0"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" DROP CONSTRAINT "FK_6ef23ce0b1d9cf9b5b833e52b9d"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" DROP CONSTRAINT "FK_e706deb68f52ab2756119b9e704"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" DROP CONSTRAINT "FK_fbb2499551ed074526f3ee36241"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" DROP CONSTRAINT "FK_01486cc9dc6b36bf658685535f6"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" DROP CONSTRAINT "FK_a1c4f9cfb599ad1f0db39cadd5f"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" DROP CONSTRAINT "FK_a0b05dc4257abe639cb75f8eae2"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" DROP CONSTRAINT "FK_8486ee16e69013c645d0b8716b6"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" DROP CONSTRAINT "FK_4d5f98645a67545d8dea42e2eb8"`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" DROP CONSTRAINT "FK_2484cf14c437a04586b07e7dddb"`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" DROP CONSTRAINT "FK_1d04aebeabb6a89f87e536a124d"`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" DROP CONSTRAINT "FK_ece65a774192b34253abc4cd672"`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" DROP CONSTRAINT "FK_25a3138bb236f63d9bb6c8ff111"`);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" DROP CONSTRAINT "FK_346e0016cf045b9980747747645"`);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" DROP CONSTRAINT "FK_f672727ab020df6c50fb64c1a70"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8486ee16e69013c645d0b8716b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d5f98645a67545d8dea42e2eb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a1c4f9cfb599ad1f0db39cadd5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0b05dc4257abe639cb75f8eae"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fbb2499551ed074526f3ee3624"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_01486cc9dc6b36bf658685535f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f05132301e95bdab4ba1cf29a2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c759f53b2e48e8cfb50638fe4e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ef23ce0b1d9cf9b5b833e52b9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e706deb68f52ab2756119b9e70"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2484cf14c437a04586b07e7ddd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1d04aebeabb6a89f87e536a124"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ece65a774192b34253abc4cd67"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_25a3138bb236f63d9bb6c8ff11"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_346e0016cf045b998074774764"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f672727ab020df6c50fb64c1a7"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "name" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."customer_person_in_charge_enum" AS ENUM('Mr', 'Mrs', 'Mr/Mrs')`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "person_in_charge" "public"."customer_person_in_charge_enum" DEFAULT 'Mr/Mrs'`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "address" character varying`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" ADD "metadata" jsonb`);
        await queryRunner.query(`CREATE INDEX "IDX_f05132301e95bdab4ba1cf29a2" ON "discount_condition_product" ("condition_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c759f53b2e48e8cfb50638fe4e" ON "discount_condition_product" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_6ef23ce0b1d9cf9b5b833e52b9" ON "discount_condition_product_type" ("condition_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e706deb68f52ab2756119b9e70" ON "discount_condition_product_type" ("product_type_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_fbb2499551ed074526f3ee3624" ON "discount_condition_product_tag" ("condition_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_01486cc9dc6b36bf658685535f" ON "discount_condition_product_tag" ("product_tag_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a1c4f9cfb599ad1f0db39cadd5" ON "discount_condition_product_collection" ("condition_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a0b05dc4257abe639cb75f8eae" ON "discount_condition_product_collection" ("product_collection_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8486ee16e69013c645d0b8716b" ON "discount_condition_customer_group" ("condition_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4d5f98645a67545d8dea42e2eb" ON "discount_condition_customer_group" ("customer_group_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2484cf14c437a04586b07e7ddd" ON "product_tax_rate" ("rate_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1d04aebeabb6a89f87e536a124" ON "product_tax_rate" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ece65a774192b34253abc4cd67" ON "product_type_tax_rate" ("rate_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_25a3138bb236f63d9bb6c8ff11" ON "product_type_tax_rate" ("product_type_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_346e0016cf045b998074774764" ON "shipping_tax_rate" ("rate_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f672727ab020df6c50fb64c1a7" ON "shipping_tax_rate" ("shipping_option_id") `);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" ADD CONSTRAINT "FK_4d5f98645a67545d8dea42e2eb8" FOREIGN KEY ("customer_group_id") REFERENCES "customer_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" ADD CONSTRAINT "FK_8486ee16e69013c645d0b8716b6" FOREIGN KEY ("condition_id") REFERENCES "discount_condition"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" ADD CONSTRAINT "FK_a0b05dc4257abe639cb75f8eae2" FOREIGN KEY ("product_collection_id") REFERENCES "product_collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" ADD CONSTRAINT "FK_a1c4f9cfb599ad1f0db39cadd5f" FOREIGN KEY ("condition_id") REFERENCES "discount_condition"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" ADD CONSTRAINT "FK_01486cc9dc6b36bf658685535f6" FOREIGN KEY ("product_tag_id") REFERENCES "product_tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" ADD CONSTRAINT "FK_fbb2499551ed074526f3ee36241" FOREIGN KEY ("condition_id") REFERENCES "discount_condition"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" ADD CONSTRAINT "FK_c759f53b2e48e8cfb50638fe4e0" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" ADD CONSTRAINT "FK_f05132301e95bdab4ba1cf29a24" FOREIGN KEY ("condition_id") REFERENCES "discount_condition"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" ADD CONSTRAINT "FK_e706deb68f52ab2756119b9e704" FOREIGN KEY ("product_type_id") REFERENCES "product_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" ADD CONSTRAINT "FK_6ef23ce0b1d9cf9b5b833e52b9d" FOREIGN KEY ("condition_id") REFERENCES "discount_condition"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" ADD CONSTRAINT "FK_1d04aebeabb6a89f87e536a124d" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" ADD CONSTRAINT "FK_2484cf14c437a04586b07e7dddb" FOREIGN KEY ("rate_id") REFERENCES "tax_rate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" ADD CONSTRAINT "FK_25a3138bb236f63d9bb6c8ff111" FOREIGN KEY ("product_type_id") REFERENCES "product_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" ADD CONSTRAINT "FK_ece65a774192b34253abc4cd672" FOREIGN KEY ("rate_id") REFERENCES "tax_rate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" ADD CONSTRAINT "FK_f672727ab020df6c50fb64c1a70" FOREIGN KEY ("shipping_option_id") REFERENCES "shipping_option"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" ADD CONSTRAINT "FK_346e0016cf045b9980747747645" FOREIGN KEY ("rate_id") REFERENCES "tax_rate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" DROP CONSTRAINT "FK_346e0016cf045b9980747747645"`);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" DROP CONSTRAINT "FK_f672727ab020df6c50fb64c1a70"`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" DROP CONSTRAINT "FK_ece65a774192b34253abc4cd672"`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" DROP CONSTRAINT "FK_25a3138bb236f63d9bb6c8ff111"`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" DROP CONSTRAINT "FK_2484cf14c437a04586b07e7dddb"`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" DROP CONSTRAINT "FK_1d04aebeabb6a89f87e536a124d"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" DROP CONSTRAINT "FK_6ef23ce0b1d9cf9b5b833e52b9d"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" DROP CONSTRAINT "FK_e706deb68f52ab2756119b9e704"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" DROP CONSTRAINT "FK_f05132301e95bdab4ba1cf29a24"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" DROP CONSTRAINT "FK_c759f53b2e48e8cfb50638fe4e0"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" DROP CONSTRAINT "FK_fbb2499551ed074526f3ee36241"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" DROP CONSTRAINT "FK_01486cc9dc6b36bf658685535f6"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" DROP CONSTRAINT "FK_a1c4f9cfb599ad1f0db39cadd5f"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" DROP CONSTRAINT "FK_a0b05dc4257abe639cb75f8eae2"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" DROP CONSTRAINT "FK_8486ee16e69013c645d0b8716b6"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" DROP CONSTRAINT "FK_4d5f98645a67545d8dea42e2eb8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f672727ab020df6c50fb64c1a7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_346e0016cf045b998074774764"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_25a3138bb236f63d9bb6c8ff11"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ece65a774192b34253abc4cd67"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1d04aebeabb6a89f87e536a124"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2484cf14c437a04586b07e7ddd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d5f98645a67545d8dea42e2eb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8486ee16e69013c645d0b8716b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0b05dc4257abe639cb75f8eae"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a1c4f9cfb599ad1f0db39cadd5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_01486cc9dc6b36bf658685535f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fbb2499551ed074526f3ee3624"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e706deb68f52ab2756119b9e70"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ef23ce0b1d9cf9b5b833e52b9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c759f53b2e48e8cfb50638fe4e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f05132301e95bdab4ba1cf29a2"`);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "person_in_charge"`);
        await queryRunner.query(`DROP TYPE "public"."customer_person_in_charge_enum"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "last_name" character varying`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "first_name" character varying`);
        await queryRunner.query(`CREATE INDEX "IDX_f672727ab020df6c50fb64c1a7" ON "shipping_tax_rate" ("shipping_option_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_346e0016cf045b998074774764" ON "shipping_tax_rate" ("rate_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_25a3138bb236f63d9bb6c8ff11" ON "product_type_tax_rate" ("product_type_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ece65a774192b34253abc4cd67" ON "product_type_tax_rate" ("rate_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1d04aebeabb6a89f87e536a124" ON "product_tax_rate" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2484cf14c437a04586b07e7ddd" ON "product_tax_rate" ("rate_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e706deb68f52ab2756119b9e70" ON "discount_condition_product_type" ("product_type_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_6ef23ce0b1d9cf9b5b833e52b9" ON "discount_condition_product_type" ("condition_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c759f53b2e48e8cfb50638fe4e" ON "discount_condition_product" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f05132301e95bdab4ba1cf29a2" ON "discount_condition_product" ("condition_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_01486cc9dc6b36bf658685535f" ON "discount_condition_product_tag" ("product_tag_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_fbb2499551ed074526f3ee3624" ON "discount_condition_product_tag" ("condition_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a0b05dc4257abe639cb75f8eae" ON "discount_condition_product_collection" ("product_collection_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a1c4f9cfb599ad1f0db39cadd5" ON "discount_condition_product_collection" ("condition_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4d5f98645a67545d8dea42e2eb" ON "discount_condition_customer_group" ("customer_group_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8486ee16e69013c645d0b8716b" ON "discount_condition_customer_group" ("condition_id") `);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" ADD CONSTRAINT "FK_f672727ab020df6c50fb64c1a70" FOREIGN KEY ("shipping_option_id") REFERENCES "shipping_option"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipping_tax_rate" ADD CONSTRAINT "FK_346e0016cf045b9980747747645" FOREIGN KEY ("rate_id") REFERENCES "tax_rate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" ADD CONSTRAINT "FK_25a3138bb236f63d9bb6c8ff111" FOREIGN KEY ("product_type_id") REFERENCES "product_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_type_tax_rate" ADD CONSTRAINT "FK_ece65a774192b34253abc4cd672" FOREIGN KEY ("rate_id") REFERENCES "tax_rate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" ADD CONSTRAINT "FK_1d04aebeabb6a89f87e536a124d" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_tax_rate" ADD CONSTRAINT "FK_2484cf14c437a04586b07e7dddb" FOREIGN KEY ("rate_id") REFERENCES "tax_rate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" ADD CONSTRAINT "FK_4d5f98645a67545d8dea42e2eb8" FOREIGN KEY ("customer_group_id") REFERENCES "customer_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_customer_group" ADD CONSTRAINT "FK_8486ee16e69013c645d0b8716b6" FOREIGN KEY ("condition_id") REFERENCES "discount_condition"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" ADD CONSTRAINT "FK_a0b05dc4257abe639cb75f8eae2" FOREIGN KEY ("product_collection_id") REFERENCES "product_collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_collection" ADD CONSTRAINT "FK_a1c4f9cfb599ad1f0db39cadd5f" FOREIGN KEY ("condition_id") REFERENCES "discount_condition"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" ADD CONSTRAINT "FK_01486cc9dc6b36bf658685535f6" FOREIGN KEY ("product_tag_id") REFERENCES "product_tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_tag" ADD CONSTRAINT "FK_fbb2499551ed074526f3ee36241" FOREIGN KEY ("condition_id") REFERENCES "discount_condition"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" ADD CONSTRAINT "FK_e706deb68f52ab2756119b9e704" FOREIGN KEY ("product_type_id") REFERENCES "product_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product_type" ADD CONSTRAINT "FK_6ef23ce0b1d9cf9b5b833e52b9d" FOREIGN KEY ("condition_id") REFERENCES "discount_condition"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" ADD CONSTRAINT "FK_c759f53b2e48e8cfb50638fe4e0" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discount_condition_product" ADD CONSTRAINT "FK_f05132301e95bdab4ba1cf29a24" FOREIGN KEY ("condition_id") REFERENCES "discount_condition"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
