export type ReqLessonResData = {
  id: string;
  password: string;
};

export interface ReqLessonInboundPortInputDto {
  customerName: string;
  phoneNumber: string;
  coachName: string;
  isRegularLesson: Boolean;
  timesPerWeek?: number; // Optional, only for regular lessons
  lessonTimes: Date[];
  endTime: string;
}

export interface ICustomerDao
  extends Pick<ReqLessonInboundPortInputDto, 'phoneNumber' | 'customerName'> {
  username: string;
  password: string;
}

export interface ReqLessonInboundPort {
  execute(body: ReqLessonInboundPortInputDto): Promise<ReqLessonResData>;
}
