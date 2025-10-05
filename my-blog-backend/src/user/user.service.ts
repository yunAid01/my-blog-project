import { Injectable, NotFoundException, UnauthorizedException  } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'; // 1. bcrypt를 import 합니다.
import { JwtService } from '@nestjs/jwt'; // 1. JwtService를 import 합니다.
import { LoginUserDto } from './dto/login-user.dto';
// (login-user.dto.ts 파일은 CreateUserDto와 내용이 동일합니다. 새로 만들어주세요.)

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  // create 메서드를 async/await를 사용하도록 변경합니다.
  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    // 2. 비밀번호를 해싱합니다.
    // bcrypt.hash(평문 비밀번호, saltOrRounds)
    // saltOrRounds는 해싱의 복잡도를 결정하는 숫자입니다. 높을수록 안전하지만 오래 걸립니다. 보통 10-12를 사용합니다.
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. 해싱된 비밀번호로 유저를 생성합니다.
    const newUser = await this.prisma.user.create({
      data: {
        email: email,
        password: hashedPassword, // 원본 비밀번호가 아닌 해시된 비밀번호를 저장합니다!
      },
    });

    // 4. 보안을 위해, 생성된 유저 정보에서 비밀번호 필드를 제거하고 반환합니다.
    // 'password' 속성을 별도의 변수로 빼내고(하지만 사용하지 않음), '...rest'를 사용해
    // 나머지 속성들만 'userWithoutPassword'라는 새로운 객체에 담습니다.
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword; // 비밀번호가 제외된 새로운 객체를 반환합니다.
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // 3. 이메일로 유저가 존재하는지 확인합니다.
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      throw new NotFoundException('해당하는 이메일의 유저를 찾을 수 없습니다.');
    }

    // 4. 입력된 비밀번호와 DB의 암호화된 비밀번호를 비교합니다.
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    // 5. 비밀번호가 일치하면, '출입증(JWT)'을 생성합니다.
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    // 6. 생성된 출입증을 반환합니다.
    return {
      message: '로그인 성공!',
      accessToken,
    };
  }


  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
