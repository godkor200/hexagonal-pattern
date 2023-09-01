export interface IDelDto {
  lessonId: string;
  password: string;
}

export interface DelLessonInboundPort {
  execute(arg: IDelDto): Promise<Boolean>;
}
