import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  isString,
} from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}

// export interface user {
//   id: string;
//   email: String;
//   password: String;
//   status: Boolean;
//   otp: String;
//   @I
//   otpExpired: DateTime;
//   createdAt: DateTime;
//   updatedAt: DateTime;
// }
