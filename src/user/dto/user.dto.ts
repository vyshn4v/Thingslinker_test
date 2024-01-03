import { IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export interface UserDto{
        id: string;
        iat: number;
        exp: number;
}

export class UpdateUserDto{
        @IsEmail()
        @IsOptional()
        email?: string;
      
        @IsString()
        @IsOptional()
        @MinLength(4)
        @MaxLength(20)
        @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
          message: 'password too weak',
        })
        password?: string;

}