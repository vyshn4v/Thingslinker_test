import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export interface UserDto{
        email: string;
        iat: number;
        exp: number;
}

export class UpdateUserDto{
        @IsEmail()
        @IsNotEmpty()
        email?: string;
      
        @IsString()
        @IsNotEmpty()
        @MinLength(4)
        @MaxLength(20)
        @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
          message: 'password too weak',
        })
        password?: string;

}