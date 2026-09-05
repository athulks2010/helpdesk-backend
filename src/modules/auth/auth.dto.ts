import { IsEmail, IsString, MinLength, IsOptional, IsNumber } from 'class-validator'

export class LoginDto {
  @IsEmail()
  email!: string

  @IsString()
  password!: string
}

export class RegisterDto {
  @IsString()
  first_name!: string

  @IsString()
  last_name!: string

  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  password!: string

  @IsOptional()
  @IsString()
  password_confirmation?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsNumber()
  country_id?: number

  @IsOptional()
  @IsString()
  city?: string

  @IsOptional()
  @IsString()
  address?: string
}

export class PasswordResetDto {
  @IsEmail()
  email!: string
}

export class PasswordResetWithTokenDto {
  @IsEmail()
  email!: string

  @IsString()
  token!: string

  @IsString()
  @MinLength(8)
  password!: string

  @IsOptional()
  @IsString()
  password_confirmation?: string
}
