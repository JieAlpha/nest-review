import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "./example-guard.guard";

@Injectable()
export class ExampleGuardService {
    constructor(private jwtService: JwtService) {}

    async generateToken(user: {
        id: number;
        username: string;
        role: UserRole;
    }) {
        const payload = {
            sub: user.id,
            username: user.username,
            role: user.role,
        };

        return this.jwtService.sign(payload);
    }
}
