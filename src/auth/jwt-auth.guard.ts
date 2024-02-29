import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add logging to see if the guard is triggered and what the request headers are
    const request = context.switchToHttp().getRequest();
    this.logger.debug(`AuthGuard triggered for ${request.url}`);
    this.logger.debug(`Request headers: ${JSON.stringify(request.headers)}`);

    // Proceed with the standard JWT authentication guard checks
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext, status?: any) {
    // Log any errors or JWT validation issues
    if (err) {
      this.logger.error(`Authentication error: ${err.message}`);
      throw err;
    }
    if (info) {
      this.logger.warn(`JWT validation info: ${info.message}`);
      // Optionally handle the info case differently, for example, throw an exception
      // if the info message indicates a specific type of JWT error you want to handle.
    }

    // You can add additional checks or transformations here if needed.
    // Ensure you have a user object at this point, or throw an exception if necessary.
    if (!user) {
      this.logger.error('No user object was provided after authentication.');
      throw new Error('Authentication failed. No user found.');
    }

    // Proceed with the standard request handling
    return super.handleRequest(err, user, info, context, status);
  }
}
