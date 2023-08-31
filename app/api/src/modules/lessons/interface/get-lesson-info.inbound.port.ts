export enum Coache {
  KIM = '1',
  OH = '2',
  LEE = '3',
  PARK = '4',
}

export enum LessonType {
  SINGLE = 'trial',
  REGULAR = 'regular',
}

export enum LessonNumber {
  ONCE = 'once_a_week',
  TWICE = 'twice_a_week',
  THRICE = 'three_times_a_week',
}

export enum LessonTime {
  HALF_HOUR = '30min',
  ONE_HOUR = '1hour',
}

export type GetLessonInfoInboundPortInputDto = {
  coacheName: string;
  lessonType: LessonType;
  lessonNumber: LessonNumber;
  lessonTime: LessonTime;
};

export interface GetLessonInfoInboundPort {
  execute(params: GetLessonInfoInboundPortInputDto): Promise<string[]>;
}
