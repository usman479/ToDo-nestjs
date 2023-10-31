import { SetMetadata } from "@nestjs/common/decorators";

// decorator to set the role for the route then authenticate in the roles guard
export const Roles = (...roles:string[]) => SetMetadata('roles',roles);