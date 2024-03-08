ALTER TABLE "transactions" ALTER COLUMN "transaction_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "transaction_status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "transaction_status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "wallets" ALTER COLUMN "amount" SET NOT NULL;