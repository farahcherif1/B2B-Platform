import { DataSource } from 'typeorm';
import { User } from '../user-management/entities/user.entity';
import { Role } from '../user-management/entities/role.entity';
import { UserRole } from '../user-management/entities/user-role.entity';
import * as bcrypt from 'bcrypt';

export const userSeed = async (dataSource: DataSource): Promise<void> => {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);
  const userRoleRepository = dataSource.getRepository(UserRole);

  const roleNames = ['admin', 'user', 'organizer'];
  const roles: Record<string, Role> = {};

  for (const roleName of roleNames) {
    let role = await roleRepository.findOne({ where: { name: roleName } });

    if (!role) {
      role = roleRepository.create({
        name: roleName,
        is_organizer_role: roleName === 'organizer' || roleName === 'admin', 
      });
      await roleRepository.save(role);
      console.log(`Created role: ${roleName}`);
    } else {
      console.log(`Role ${roleName} already exists`);
    }

    roles[roleName] = role;
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash('password123', salt);

  const userDataToSeed = [
    {
      email: 'admin@gmail.com',
      password: hashedPassword,
      name: 'Admin',
      is_organizer: true,
      createdAt: new Date(),
    },
    {
      email: 'user@gmail.com',
      password: hashedPassword,
      name: 'User',
      createdAt: new Date(),
    },
    {
      email: 'organizer@gmail.com',
      password: hashedPassword,
      name: 'Organizer',
      createdAt: new Date(),
    },
  ];

  const savedUsers: User[] = [];

  for (const userData of userDataToSeed) {
    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (!existingUser) {
      const newUser = userRepository.create({
        ...userData,
        is_organizer: false, 
      });
      const savedUser = await userRepository.save(newUser);
      savedUsers.push(savedUser);
      console.log(`Created user: ${userData.email}`);
    } else {
      console.log(`User ${userData.email} already exists`);
      savedUsers.push(existingUser);
    }
  }
  const userRoleData = [
    {
      user: savedUsers[0],
      role: roles.admin,
    },
    {
      user: savedUsers[1],
      role: roles.user,
    },
    {
      user: savedUsers[2],
      role: roles.organizer,
    },
  ];
  for (const userRoleItem of userRoleData) {
    const existingUserRole = await userRoleRepository.findOne({
      where: {
        user: { id: userRoleItem.user.id },
        role: { id: userRoleItem.role.id },
      },
    });

    if (!existingUserRole) {
      await userRoleRepository.save(userRoleItem);
      console.log(
        `Created user role relation for ${userRoleItem.user.email} with role ${userRoleItem.role.name}`,
      );
    } else {
      console.log(
        `User role relation for ${userRoleItem.user.email} with role ${userRoleItem.role.name} already exists`,
      );
    }

   
    const user = userRoleItem.user;
    const role = userRoleItem.role;

    if (role.is_organizer_role && !user.is_organizer) {
      user.is_organizer = true;
      await userRepository.save(user);
      console.log(`Updated ${user.email} to is_organizer = true`);
    }
  }
};
