import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.services";
import { PrismaModule } from "src/prisma/prisma.module";
import { MailerService } from "src/mailer/mailer.service";
import { MailerModule } from "src/mailer/mailer.module";

@Module({
    imports:[MailerModule],
    controllers:[AuthController],
    providers:[AuthService]
})
export class AuthModule{
    
}
