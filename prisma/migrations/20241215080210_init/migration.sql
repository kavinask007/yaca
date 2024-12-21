-- CreateTable
CREATE TABLE "user_groq_token" (
    "identifier" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_groq_token_pkey" PRIMARY KEY ("identifier")
);

-- AddForeignKey
ALTER TABLE "user_groq_token" ADD CONSTRAINT "user_groq_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
