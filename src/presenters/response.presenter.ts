import { HttpException, HttpStatus } from '@nestjs/common';

export default class ResponsePresenter {
  success(data, message = 'Data fetched successfully', status = HttpStatus.OK) {
    return {
      data,
      message,
      status,
    };
  }

  error(message, status) {
    throw new HttpException(
      message,
      status || HttpStatus.INTERNAL_SERVER_ERROR,
      {
        description: message,
      },
    );
  }
}
